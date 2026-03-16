# CEO Dashboard — Business Dashboard de Agentes

Painel centralizado de comando e controle para gerenciar agentes de IA, tarefas, comunicacao em tempo real e integracao com GitHub.

---

## O que e este projeto

O CEO Dashboard e uma interface web full-stack que permite ao CEO/operador:

- Visualizar e gerenciar todos os agentes de IA ativos
- Criar, atribuir e acompanhar tarefas por agente
- Comunicar-se em tempo real com cada agente via chat integrado
- Monitorar o status dos servicos e do repositorio GitHub
- Receber atualizacoes ao vivo via WebSockets (Socket.IO)

---

## Stack tecnica

| Camada      | Tecnologia                              |
|-------------|------------------------------------------|
| Backend     | Node.js + Express 4                      |
| Tempo real  | Socket.IO 4                              |
| GitHub API  | @octokit/rest 20                         |
| Frontend    | HTML/CSS/JS vanilla (sem framework)      |
| Processo    | systemd (auto-start, restart automatico) |
| Deploy      | Git + systemctl via deploy.sh            |

---

## Como rodar localmente

### Pre-requisitos

- Node.js 18+
- npm

### Instalacao

```bash
cd /root/dashboard
npm install            # instala dependencias raiz (se houver)
cd backend
npm install            # instala dependencias do backend
```

### Iniciar o servidor

```bash
node /root/dashboard/backend/server.js
```

Ou, a partir do diretorio backend:

```bash
npm start
```

O servidor sobe na porta `3000` por padrao (configuravel pela variavel de ambiente `PORT`).

---

## Como acessar o dashboard

Apos iniciar o servidor, acesse no navegador:

```
http://<IP-do-servidor>:3000
```

Exemplo:

```
http://192.168.1.100:3000
```

Se estiver rodando localmente:

```
http://localhost:3000
```

---

## Agentes e suas funcoes

| Agente              | Funcao principal                                                   |
|---------------------|--------------------------------------------------------------------|
| Agente CEO          | Orquestra todos os outros agentes, toma decisoes estrategicas      |
| Agente Dev          | Desenvolvimento de codigo, revisao de PRs, debug                   |
| Agente Marketing    | Criacao de conteudo, campanhas, analise de mercado                 |
| Agente Financeiro   | Relatorios financeiros, controle de custos, previsoes              |
| Agente Suporte      | Atendimento ao cliente, triagem de tickets, base de conhecimento   |
| Agente Dados        | Pipeline de dados, relatorios analiticos, dashboards internos      |
| Agente Infraestrutura | Monitoramento de servidores, alertas, automacao de deploy        |

---

## Estrutura de arquivos

```
/root/dashboard/
├── backend/
│   ├── server.js          # Servidor principal Express + Socket.IO
│   └── package.json       # Dependencias do backend
├── public/
│   ├── index.html         # Interface principal do dashboard
│   ├── favicon.svg        # Icone da aplicacao (hexagono roxo com "C")
│   └── ...                # CSS, JS e assets estaticos
├── deploy.sh              # Script de deploy (git push + restart systemd)
├── .gitignore
└── README.md
```

---

## Como criar tarefas

1. Acesse o dashboard em `http://<IP>:3000`
2. No painel lateral, selecione o agente desejado
3. Clique em **"+ Nova Tarefa"**
4. Preencha o titulo, descricao e prioridade
5. Clique em **"Criar"** — a tarefa aparecera na fila do agente em tempo real

---

## Como usar o chat

1. Selecione um agente no painel lateral
2. A aba **"Chat"** abrira automaticamente
3. Digite sua mensagem na caixa de texto e pressione `Enter` ou clique em **"Enviar"**
4. As respostas chegam em tempo real via Socket.IO
5. O historico da conversa e mantido durante a sessao

---

## Servico systemd

O backend e gerenciado como servico systemd para garantir auto-start e reinicializacao automatica.

### Comandos uteis

```bash
# Ver status do servico
systemctl status ceo-dashboard

# Iniciar
systemctl start ceo-dashboard

# Parar
systemctl stop ceo-dashboard

# Reiniciar
systemctl restart ceo-dashboard

# Ver logs em tempo real
tail -f /var/log/ceo-dashboard.log
```

---

## Deploy

Execute o script de deploy para publicar alteracoes e reiniciar o servico:

```bash
bash /root/dashboard/deploy.sh
```

O script realiza:
1. `git add -A` — adiciona todos os arquivos modificados
2. `git commit` — cria commit com timestamp automatico
3. `git push origin main` — envia para o repositorio remoto
4. `systemctl restart ceo-dashboard` — reinicia o servico
5. Exibe a URL de acesso ao dashboard
