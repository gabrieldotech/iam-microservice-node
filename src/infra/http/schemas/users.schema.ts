import { z } from "zod";

export const createUserBodySchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(6),
});

export const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type CreateUserData = z.infer<typeof createUserBodySchema>;
export type AuthenticateData = z.infer<typeof authenticateBodySchema>;

export const createUserSchema = {
  summary: "Register a new user",
  tags: ["Authentication"],
  body: createUserBodySchema,
  response: {
    201: z.object({
      id: z.uuid(),
      name: z.string().nullable(),
      email: z.string(),
    }),
    409: z.object({ message: z.string() }),
  },
};

export const authenticateSchema = {
  summary: "Authenticate user",
  tags: ["Authentication"],
  body: authenticateBodySchema,
  response: {
    200: z.object({
      token: z.string(),
    }),
    401: z.object({ message: z.string() }),
  },
};

export const getProfileSchema = {
  summary: "Get user profile",
  tags: ["Users"],
  response: {
    200: z.object({
      user: z.object({
        id: z.uuid(),
        name: z.string().nullable(),
        email: z.string(),
      }),
    }),
  },
};

export const refreshSchema = {
  summary: "Renew access token",
  description:
    "Uses the refreshToken cookie to generate a new access token and a new refresh token (Rotation).",
  tags: ["Authentication"],
  response: {
    200: z.object({
      token: z.string().describe("New Access Token"),
    }),
    401: z.object({
      message: z.string(),
    }),
  },
};
