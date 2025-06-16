# cub-api-en-docker
Transfer to Server: Use scp or rsync to copy your entire my-fullstack-app directory to your Hetzner server.
`````bash
scp -r my-fullstack-app user@your_server_ip:/home/user/my-fullstack-app
`````

SSH into Server:
`````bash
ssh user@your_server_ip
`````

Navigate and Deploy:
`````bash
cd /home/user/my-fullstack-app
docker compose up -d --build
`````

The --build flag ensures your Docker images are rebuilt with the latest code. -d runs containers in detached mode.
Monitor Logs: Check the logs to ensure everything starts up correctly:
`````bash
docker compose logs -f
`````

Look for messages indicating Express is listening, Vite dev server is running, Caddy is serving, and PostgreSQL is ready. Caddy should automatically obtain SSL certificates for lovefilm.cc and api.lovefilm.cc.
## Configure DNS: Go to your domain registrar and create/update the following A records to point to your Hetzner Cloud server's public IP address:

lovefilm.cc (A record) -> your_server_ip

api.lovefilm.cc (A record) -> your_server_ip

## Test: Once DNS has propagated (which can take a few minutes to a few hours):

Open https://lovefilm.cc in your browser. You should see your frontend app.

Open https://lovefilm.cc/developer/ in your browser. You should also see your frontend app.

Test your API: https://lovefilm.cc/api/ or https://api.lovefilm.cc/.
