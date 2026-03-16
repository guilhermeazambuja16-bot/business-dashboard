#!/bin/bash
cd /root/dashboard
git add -A
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M') - CEO Dashboard update"
git push origin main
systemctl restart ceo-dashboard
echo "Deploy concluido! Dashboard disponivel em http://$(hostname -I | awk '{print $1}'):3000"
