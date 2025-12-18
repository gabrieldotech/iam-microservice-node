import fastify from "fastify";
import { z } from "zod";

const app = fastify();

app.get("/health", async () => {
  return {
    status: "ok",
  };
});

app.post("/users", async (req, reply) => {
  const createUserSchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres."),
    email: z.email("Email inválido"),
    password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  });

  try {
    const { name, email, password } = createUserSchema.parse(req.body);
    return reply.status(201).send({
      message: "Dados válidados com sucesso.",
      user: { name, email },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Erro de validação",
        errors: z.treeifyError(error),
      });
    }
    return reply.status(500).send({ message: "Erro interno no servidor." });
  }
});

app.listen({ port: 3333 }).then(() => {
  console.log("Servidor rodando em http://localhost:3333");
});
