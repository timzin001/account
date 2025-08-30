# Run docker

docker-compose up -d

## Eviroment

Node: v20.11.1

# Install redis on Windows

https://naveenrenji.medium.com/install-redis-on-windows-b80880dc2a36
wsl redis-cli

# Create resource

nest g resource
nest g resource modules/auth

## Swagger document

- Local
  http://127.0.0.1:3000/api-doc

## Create project

- Create resource
  nest g resource
- Create main project
  nest new api
- Create sub project
  nest g sub-app libraries
  nest g sub-app websocket
- Create modules
  nest g module auth
- Create controller
  nest g controller auth
- Create service
  nest g service auth

## Dev

yarn install
yarn run start:dev

## Build

- API
  yarn run build
- Websocket
  yarn run build websocket

## Deploy

- API
  pm2 start dist/main.js --name SOIVIP-BE -i 1
  pm2 start dist/main.js --name SOIVIP-BE -i 2
  pm2 start dist/main.js --name SOIVIP-BE -i 3
- Websocket
  pm2 start dist/apps/websocket/main.js --name socket -i 1

# pm2 start dist/apps/websocket/main.js --name gw_websocket_dev05_4043 -i 1

pm2 start dist/apps/websocket/main.js --name socket -i 1

## Restart service

pm2 restart SOIVIP-BE --update-env

pm2 restart socket --update-env

# pm2 restart gw_websocket_dev05_4043 --update-env

pm2 restart socket --update-env

## Delete instance

- API
  pm2 delete api
- Websocket
  pm2 delete socket

## Scale

- API
  pm2 scale api 5

## List port is running

netstat -tulpn | grep LISTEN

## Nginx

- View status
  systemctl status nginx
- Restart
  systemctl restart nginx
