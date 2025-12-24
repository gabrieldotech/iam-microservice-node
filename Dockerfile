
FROM node:20-slim


WORKDIR /usr/src/app


RUN apt-get update -y && apt-get install -y openssl


COPY package*.json ./


RUN npm install


COPY prisma ./prisma/


RUN npx prisma generate

COPY . .


EXPOSE 3333


CMD ["npm", "run", "dev"]