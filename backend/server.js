'use strict';

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Octokit } = require('@octokit/rest');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');

const {
  agentsConfig,
  generateAgentResponse,
  generateAgentActivity,
  generateSystemActivity,
  getRandomItem,
} = require('./agents-config');

const { getAIResponse, isAIAvailable } = require('./ai-engine');

// ─── Constants ────────────────────────────────────────────────────────────────
const PORT = 3000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_ORG = 'guilhermeazambuja16-bot';
const GITHUB_REPO = 'business-dashboard';
const SERVER_START = Date.now();

// ─── Express / Socket.io setup ────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join('/root/dashboard/public')));

// ─── Octokit ─────────────────────────────────────────────────────────────────
const octokit = new Octokit({ auth: GITHUB_TOKEN });

// ─── In-memory state ──────────────────────────────────────────────────────────

// Deep-clone agents from config so we can mutate freely
const agents = {};
for (const [id, cfg] of Object.entries(agentsConfig)) {
  agents[id] = { ...cfg, messages: [], uptime: 0 };
}

// Tasks
const tasks = [];
let taskIdCounter = 1;

function createTaskId() {
  return `task_${taskIdCounter++}_${Date.now()}`;
}

// Conversations
const conversations = {};

// Activity log (last 100 entries)
const activityLog = [];
const MAX_ACTIVITY = 100;

function addActivity(message, type = 'info', agentId = null) {
  const entry = {
    id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    message,
    type,
    agentId,
    timestamp: new Date().toISOString(),
  };
  activityLog.unshift(entry);
  if (activityLog.length > MAX_ACTIVITY) activityLog.pop();
  io.emit('activity:new', entry);
  return entry;
}

// ─── Helper: Metrics ─────────────────────────────────────────────────────────
function computeMetrics() {
  const agentList = Object.values(agents);
  return {
    agentsOnline: agentList.filter((a) => a.status === 'online').length,
    agentsStandby: agentList.filter((a) => a.status === 'standby').length,
    agentsWorking: agentList.filter((a) => a.status === 'working').length,
    tasksCompleted: tasks.filter((t) => t.status === 'completed').length,
    tasksInProgress: tasks.filter((t) => t.status === 'in_progress').length,
    tasksPending: tasks.filter((t) => t.status === 'pending').length,
    totalMessages: Object.values(conversations).reduce((sum, msgs) => sum + msgs.length, 0),
    totalTasks: tasks.length,
    uptime: Date.now() - SERVER_START,
  };
}

// ─── REST: Tasks ──────────────────────────────────────────────────────────────
app.get('/api/tasks', (_req, res) => {
  res.json({ success: true, data: tasks });
});

app.post('/api/tasks', (req, res) => {
  const { title, description = '', agentId, priority = 'medium' } = req.body;
  if (!title || !agentId) {
    return res.status(400).json({ success: false, error: 'title and agentId are required' });
  }
  const task = {
    id: createTaskId(),
    title,
    description,
    agentId,
    status: 'pending',
    priority,
    progress: 0,
    createdAt: new Date().toISOString(),
    startedAt: null,
    completedAt: null,
    timeSpent: 0,
  };
  tasks.push(task);
  io.emit('task:update', task);
  addActivity(`Nova tarefa criada: "${title}" atribuída para ${agents[agentId]?.name || agentId}`, 'task', agentId);
  res.status(201).json({ success: true, data: task });
});

app.put('/api/tasks/:id', (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ success: false, error: 'Task not found' });

  const { status, progress, title, description, priority } = req.body;

  if (status !== undefined) {
    const prev = task.status;
    task.status = status;
    if (status === 'in_progress' && prev !== 'in_progress') {
      task.startedAt = new Date().toISOString();
      if (agents[task.agentId]) agents[task.agentId].status = 'working';
    }
    if (status === 'completed' && prev !== 'completed') {
      task.completedAt = new Date().toISOString();
      task.progress = 100;
      task.timeSpent = task.startedAt ? Date.now() - new Date(task.startedAt).getTime() : 0;
      if (agents[task.agentId]) {
        agents[task.agentId].tasksCompleted += 1;
        agents[task.agentId].status = 'online';
        agents[task.agentId].currentTask = null;
      }
      addActivity(`Tarefa concluída: "${task.title}"`, 'success', task.agentId);
    }
  }
  if (progress !== undefined) task.progress = Math.min(100, Math.max(0, progress));
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (priority !== undefined) task.priority = priority;

  io.emit('task:update', task);
  res.json({ success: true, data: task });
});

app.delete('/api/tasks/:id', (req, res) => {
  const idx = tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Task not found' });
  const [removed] = tasks.splice(idx, 1);
  io.emit('task:deleted', { id: removed.id });
  res.json({ success: true, data: removed });
});

// ─── REST: Chat ───────────────────────────────────────────────────────────────
app.get('/api/chat/:agentId', (req, res) => {
  const { agentId } = req.params;
  if (!agents[agentId]) return res.status(404).json({ success: false, error: 'Agent not found' });
  res.json({ success: true, data: conversations[agentId] || [] });
});

app.post('/api/chat/:agentId', async (req, res) => {
  const { agentId } = req.params;
  const { content } = req.body;
  if (!agents[agentId]) return res.status(404).json({ success: false, error: 'Agent not found' });
  if (!content) return res.status(400).json({ success: false, error: 'content is required' });

  if (!conversations[agentId]) conversations[agentId] = [];

  const userMsg = {
    id: `msg_${Date.now()}_u`,
    role: 'user',
    content,
    timestamp: new Date().toISOString(),
  };
  conversations[agentId].push(userMsg);

  // Sinaliza que o agente está "pensando"
  agents[agentId].status = 'working';
  io.emit('agent:status', Object.values(agents));

  let responseContent;
  try {
    if (isAIAvailable()) {
      // Passa histórico anterior (sem a msg atual) + mensagem atual
      const history = conversations[agentId].slice(0, -1);
      responseContent = await getAIResponse(agentId, history, content);
    } else {
      responseContent = generateAgentResponse(agentId, content);
    }
  } catch (err) {
    console.error(`[AI] Erro ao chamar Claude API para ${agentId}:`, err.message);
    responseContent = generateAgentResponse(agentId, content);
  }

  const agentMsg = {
    id: `msg_${Date.now()}_a`,
    role: 'assistant',
    content: responseContent,
    timestamp: new Date().toISOString(),
  };
  conversations[agentId].push(agentMsg);

  // Volta para online após responder
  agents[agentId].status = 'online';
  io.emit('agent:status', Object.values(agents));
  io.emit('chat:response', { agentId, message: agentMsg });
  addActivity(`${agents[agentId].name} respondeu no chat`, 'chat', agentId);

  res.json({ success: true, data: { userMessage: userMsg, agentMessage: agentMsg } });
});

// ─── REST: GitHub ─────────────────────────────────────────────────────────────
app.get('/api/github/repos', async (_req, res) => {
  try {
    const { data } = await octokit.repos.listForOrg({ org: GITHUB_ORG, per_page: 30 });
    const simplified = data.map((r) => ({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      description: r.description,
      private: r.private,
      url: r.html_url,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      updatedAt: r.updated_at,
    }));
    res.json({ success: true, data: simplified });
  } catch (err) {
    // Fallback mock data when token lacks permission or rate-limited
    res.json({
      success: true,
      data: [
        { id: 1, name: GITHUB_REPO, fullName: `${GITHUB_ORG}/${GITHUB_REPO}`, description: 'Business Dashboard', private: false, url: `https://github.com/${GITHUB_ORG}/${GITHUB_REPO}`, stars: 0, forks: 0, language: 'JavaScript', updatedAt: new Date().toISOString() },
      ],
      _fallback: true,
      _error: err.message,
    });
  }
});

app.get('/api/github/commits', async (_req, res) => {
  try {
    const { data } = await octokit.repos.listCommits({
      owner: GITHUB_ORG,
      repo: GITHUB_REPO,
      per_page: 10,
    });
    const simplified = data.map((c) => ({
      sha: c.sha.slice(0, 7),
      message: c.commit.message,
      author: c.commit.author.name,
      date: c.commit.author.date,
      url: c.html_url,
    }));
    res.json({ success: true, data: simplified });
  } catch (err) {
    const mockCommits = [
      { sha: 'abc1234', message: 'feat: add agent dashboard UI', author: 'Dev Bot', date: new Date(Date.now() - 3600000).toISOString(), url: '#' },
      { sha: 'def5678', message: 'fix: socket reconnection logic', author: 'Dev Bot', date: new Date(Date.now() - 7200000).toISOString(), url: '#' },
      { sha: 'ghi9012', message: 'chore: update dependencies', author: 'Dev Bot', date: new Date(Date.now() - 86400000).toISOString(), url: '#' },
    ];
    res.json({ success: true, data: mockCommits, _fallback: true, _error: err.message });
  }
});

app.get('/api/github/files', async (_req, res) => {
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_ORG,
      repo: GITHUB_REPO,
      path: '',
    });
    const files = Array.isArray(data) ? data.map((f) => ({ name: f.name, type: f.type, size: f.size, path: f.path, url: f.html_url })) : [data];
    res.json({ success: true, data: files });
  } catch (err) {
    res.json({
      success: true,
      data: [
        { name: 'backend', type: 'dir', size: 0, path: 'backend', url: '#' },
        { name: 'public', type: 'dir', size: 0, path: 'public', url: '#' },
        { name: 'package.json', type: 'file', size: 512, path: 'package.json', url: '#' },
        { name: 'README.md', type: 'file', size: 1024, path: 'README.md', url: '#' },
      ],
      _fallback: true,
      _error: err.message,
    });
  }
});

// ─── REST: Metrics & Activity ─────────────────────────────────────────────────
app.get('/api/metrics', (_req, res) => {
  res.json({ success: true, data: computeMetrics() });
});

app.get('/api/activity', (_req, res) => {
  res.json({ success: true, data: activityLog.slice(0, 20) });
});

// ─── REST: Agents ─────────────────────────────────────────────────────────────
app.get('/api/agents', (_req, res) => {
  res.json({ success: true, data: Object.values(agents) });
});

app.get('/api/agents/:id', (req, res) => {
  const agent = agents[req.params.id];
  if (!agent) return res.status(404).json({ success: false, error: 'Agent not found' });
  res.json({ success: true, data: agent });
});

app.put('/api/agents/:id/status', (req, res) => {
  const agent = agents[req.params.id];
  if (!agent) return res.status(404).json({ success: false, error: 'Agent not found' });
  const { status } = req.body;
  if (!['online', 'standby', 'working', 'offline'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status' });
  }
  agent.status = status;
  io.emit('agent:status', Object.values(agents));
  res.json({ success: true, data: agent });
});

// ─── Socket.io ───────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);
  addActivity('Novo cliente conectado ao dashboard', 'system');

  // Send initial state
  socket.emit('agent:status', Object.values(agents));
  socket.emit('metrics:update', computeMetrics());

  // chat:message
  socket.on('chat:message', async ({ agentId, content }) => {
    if (!agents[agentId] || !content) return;
    if (!conversations[agentId]) conversations[agentId] = [];

    const userMsg = { id: `msg_${Date.now()}_u`, role: 'user', content, timestamp: new Date().toISOString() };
    conversations[agentId].push(userMsg);

    // Sinaliza "pensando"
    agents[agentId].status = 'working';
    io.emit('agent:status', Object.values(agents));
    io.emit('chat:thinking', { agentId });

    let responseContent;
    try {
      if (isAIAvailable()) {
        const history = conversations[agentId].slice(0, -1);
        responseContent = await getAIResponse(agentId, history, content);
      } else {
        await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));
        responseContent = generateAgentResponse(agentId, content);
      }
    } catch (err) {
      console.error(`[AI] Erro socket para ${agentId}:`, err.message);
      responseContent = generateAgentResponse(agentId, content);
    }

    const agentMsg = { id: `msg_${Date.now()}_a`, role: 'assistant', content: responseContent, timestamp: new Date().toISOString() };
    conversations[agentId].push(agentMsg);

    agents[agentId].status = 'online';
    io.emit('agent:status', Object.values(agents));
    io.emit('chat:response', { agentId, message: agentMsg });
    addActivity(`${agents[agentId].name} respondeu no chat`, 'chat', agentId);
  });

  // task:create
  socket.on('task:create', (data) => {
    const { title, description = '', agentId, priority = 'medium' } = data || {};
    if (!title || !agentId) return;
    const task = {
      id: createTaskId(),
      title,
      description,
      agentId,
      status: 'pending',
      priority,
      progress: 0,
      createdAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      timeSpent: 0,
    };
    tasks.push(task);
    io.emit('task:update', task);
    addActivity(`Nova tarefa criada: "${title}"`, 'task', agentId);
  });

  // agent:activate
  socket.on('agent:activate', ({ agentId }) => {
    if (!agents[agentId]) return;
    agents[agentId].status = 'working';
    io.emit('agent:status', Object.values(agents));
    addActivity(`${agents[agentId].name} ativado e em execução`, 'agent', agentId);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// ─── Real-time broadcasts every 3 seconds ─────────────────────────────────────
setInterval(() => {
  // Update uptime for online/working agents
  for (const agent of Object.values(agents)) {
    if (agent.status === 'online' || agent.status === 'working') {
      agent.uptime += 3000;
    }
  }
  io.emit('agent:status', Object.values(agents));
  io.emit('metrics:update', computeMetrics());
}, 3000);

// ─── Realistic activity simulation every 8–15 seconds ────────────────────────
function scheduleNextActivity() {
  const delay = 8000 + Math.random() * 7000;
  setTimeout(() => {
    simulateRandomActivity();
    scheduleNextActivity();
  }, delay);
}

const agentIds = Object.keys(agents);
const activeAgentIds = agentIds.filter((id) => id !== 'ceo'); // CEO is always online

function simulateRandomActivity() {
  const roll = Math.random();

  if (roll < 0.4) {
    // Agent activity
    const agentId = getRandomItem(agentIds);
    const activity = generateAgentActivity(agentId);
    if (activity) addActivity(activity, 'agent', agentId);

  } else if (roll < 0.6) {
    // Micro-task completion simulation
    const pendingOrProgress = tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress');
    if (pendingOrProgress.length > 0) {
      const task = getRandomItem(pendingOrProgress);
      if (task.status === 'pending') {
        task.status = 'in_progress';
        task.startedAt = new Date().toISOString();
        if (agents[task.agentId]) {
          agents[task.agentId].status = 'working';
          agents[task.agentId].currentTask = task.id;
        }
        addActivity(`Tarefa iniciada: "${task.title}"`, 'task', task.agentId);
        io.emit('task:update', task);
      } else {
        // Advance progress
        task.progress = Math.min(100, task.progress + Math.floor(Math.random() * 30 + 10));
        if (task.progress >= 100) {
          task.status = 'completed';
          task.completedAt = new Date().toISOString();
          task.timeSpent = task.startedAt ? Date.now() - new Date(task.startedAt).getTime() : 0;
          if (agents[task.agentId]) {
            agents[task.agentId].tasksCompleted += 1;
            agents[task.agentId].status = 'online';
            agents[task.agentId].currentTask = null;
          }
          addActivity(`Tarefa concluída: "${task.title}"`, 'success', task.agentId);
        } else {
          addActivity(`Progresso em "${task.title}": ${task.progress}%`, 'task', task.agentId);
        }
        io.emit('task:update', task);
      }
    } else {
      addActivity(generateSystemActivity(), 'system');
    }

  } else if (roll < 0.75) {
    // Random standby agent activates briefly
    const standbyAgents = Object.values(agents).filter((a) => a.status === 'standby');
    if (standbyAgents.length > 0) {
      const agent = getRandomItem(standbyAgents);
      agent.status = 'working';
      addActivity(`${agent.name} iniciou execução de subtarefa`, 'agent', agent.id);
      io.emit('agent:status', Object.values(agents));
      // Return to standby after a bit
      setTimeout(() => {
        if (agent.status === 'working') {
          agent.status = 'standby';
          agent.tasksCompleted += 1;
          addActivity(`${agent.name} concluiu subtarefa`, 'success', agent.id);
          io.emit('agent:status', Object.values(agents));
        }
      }, 4000 + Math.random() * 6000);
    } else {
      addActivity(generateSystemActivity(), 'system');
    }

  } else {
    // System activity
    addActivity(generateSystemActivity(), 'system');
  }
}

// Seed initial activity
addActivity('Sistema de dashboard inicializado', 'system');
addActivity('Todos os agentes carregados com sucesso', 'system');
addActivity('Claude CEO online e monitorando operações', 'agent', 'ceo');

scheduleNextActivity();

// ─── Start server ─────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`[Server] Dashboard backend rodando em http://localhost:${PORT}`);
  console.log(`[Server] Serving static files from /root/dashboard/public/`);
  console.log(`[Server] Agentes carregados: ${agentIds.join(', ')}`);
  console.log(`[Server] Socket.io ativo`);
  console.log(`[Server] GitHub integrado: org=${GITHUB_ORG}`);
});

module.exports = { app, server, io };
