# 1. Usamos uma imagem leve do Node.js
FROM node:20-slim

# 2. Criamos a pasta onde o código vai morar dentro do container
WORKDIR /usr/src/app

# 3. Instalamos dependências do sistema necessárias para o Prisma (openssl)
RUN apt-get update -y && apt-get install -y openssl

# 4. Copiamos os arquivos de dependências primeiro (otimiza o cache)
COPY package*.json ./

# 5. Instalamos as dependências
RUN npm install

# 6. Copiamos a pasta do Prisma para gerar o Client
COPY prisma ./prisma/

# 7. Geramos o Prisma Client (Passo vital para o IAM funcionar)
RUN npx prisma generate

# 8. Copiamos o resto do código
COPY . .

# 9. Expomos a porta que o Fastify está usando
EXPOSE 3333

# 10. Comando para rodar a aplicação em modo desenvolvimento
CMD ["npm", "run", "dev"]