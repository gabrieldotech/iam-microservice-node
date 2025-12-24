import fastify from "fastify";
import jwt from "@fastify/jwt";
import { authenticateRoute } from "./routes/authenticate.js";
import { getProfile } from "./routes/get-profile.js";
import { createUser } from "./routes/create-user.js";
import { UserAlreadyExistsError } from "../../core/errors/user-already-exists-error.js";
import { InvalidCredentialsError } from "../../core/errors/invalid-credentials-error.js";
import z from "zod";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(swagger, {
  openapi: {
    info: { title: "IAM Microservice", version: "1.0.0" },
  },
  transform: jsonSchemaTransform,
});

app.register(swaggerUi, {
  routePrefix: "/docs",
});

app.register(jwt, {
  secret: process.env.JWT_SECRET || "fallback-secret-para-dev",
});

app.register(authenticateRoute);
app.register(getProfile);
app.register(createUser);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof z.ZodError) {
    return reply.status(400).send({
      message: "Validation error.",
      erros: z.treeifyError(error),
    });
  }

  if (error instanceof UserAlreadyExistsError) {
    return reply.status(409).send({ message: error.message });
  }

  if (error instanceof InvalidCredentialsError) {
    return reply.status(401).send({ message: error.message });
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }

  return reply.status(500).send({ message: "Internal server error." });
});

app.listen({ port: 3333 }).then(() => {
  console.log("Servidor rodando em http://localhost:3333");
});
