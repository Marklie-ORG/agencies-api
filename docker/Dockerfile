FROM node:20

WORKDIR /usr/src/app

RUN npm install -g pnpm


COPY ../app/package.json ../app/pnpm-lock.yaml ./

RUN pnpm install
RUN pnpm build:all

COPY app .

CMD ["pnpm", "start"]
