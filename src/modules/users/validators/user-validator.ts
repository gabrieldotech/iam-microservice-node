import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres."),
  email: z.email("Email inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
});

export type CreateUserData = z.infer<typeof createUserSchema>;
