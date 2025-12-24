import { z } from "zod";

export const errorResponseSchema = z
  .object({
    message: z.string(),
  })
  .describe("Standard API error response structure");

export const createUserBodySchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type CreateUserData = z.infer<typeof createUserBodySchema>;
export type AuthenticateData = z.infer<typeof authenticateBodySchema>;

export const createUserSchema = {
  summary: "Register a new user",
  description:
    "Creates a new user in the system. The email address must be unique.",
  tags: ["Users"],
  body: createUserBodySchema,
  response: {
    201: z
      .object({
        id: z.uuid(),
        name: z.string().nullable(),
        email: z.email(),
      })
      .describe("User created successfully"),
    409: errorResponseSchema.describe("The provided email is already in use"),
    400: errorResponseSchema.describe(
      "Validation error in the submitted fields"
    ),
  },
};

export const authenticateSchema = {
  summary: "Authenticate user",
  description:
    "Generates a JWT Access Token and an HttpOnly Refresh Token cookie for authenticated sessions.",
  tags: ["Authentication"],
  body: authenticateBodySchema,
  response: {
    200: z
      .object({
        token: z.string(),
      })
      .describe("Authentication successful"),
    401: errorResponseSchema.describe("Invalid email or password"),
  },
};

export const getProfileSchema = {
  summary: "Get user profile",
  description:
    "Retrieves the authenticated user's data using the Bearer Token.",
  tags: ["Users"],
  security: [{ bearerAuth: [] }],
  response: {
    200: z
      .object({
        user: z.object({
          id: z.uuid(),
          name: z.string().nullable(),
          email: z.email(),
        }),
      })
      .describe("Profile data retrieved successfully"),
    401: errorResponseSchema.describe("Token is missing, invalid, or expired"),
  },
};

export const refreshSchema = {
  summary: "Renew access token",
  description:
    "Uses the Refresh Token sent via Cookie to generate a new pair of tokens (Rotation strategy).",
  tags: ["Authentication"],
  response: {
    200: z
      .object({
        token: z.string().describe("Newly generated Access Token"),
      })
      .describe("Tokens renewed successfully"),
    401: errorResponseSchema.describe("Refresh Token is invalid or expired"),
  },
};
