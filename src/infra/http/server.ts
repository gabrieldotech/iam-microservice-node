import fastify from "fastify";
import jwt from "@fastify/jwt";
import { authenticateRoute } from "./routes/authenticate.js";
import { getProfile } from "./routes/get-profile.js";
import { createUser } from "./routes/create-user.js";

const app = fastify();

app.register(jwt, {
  secret: process.env.JWT_SECRET || "fallback-secret-para-dev",
});

app.register(authenticateRoute);
app.register(getProfile);
app.register(createUser);

app.listen({ port: 3333 }).then(() => {
  console.log("Servidor rodando em http://localhost:3333");
});
