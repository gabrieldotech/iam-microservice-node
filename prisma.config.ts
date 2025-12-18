import { defineConfig } from "@prisma/config";
import "dotenv/config"; // 💡 Esta linha é a chave. Ela lê o .env e coloca no process.env

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
