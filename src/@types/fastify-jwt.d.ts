import "@fastify/jwt";

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      sub: string; // É aqui que o ID do usuário fica guardado
    };
  }
}
