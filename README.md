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

