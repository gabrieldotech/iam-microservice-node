import fastify from "fastify";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { env } from "../../env/index.js";
import { authenticateRoute } from "./routes/authenticate.js";
import { getProfile } from "./routes/get-profile.js";
import { createUser } from "./routes/create-user.js";
import { refreshToken } from "./routes/refresh.js";
import { errorHandler } from "./error-handler.js";

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.addHook("onResponse", (request, reply, done) => {
  if (env.NODE_ENV === "dev") {
    console.log(`[${request.method}] ${request.url} - ${reply.statusCode}`);
  }
  done();
});

app.register(cookie, {
  secret: "eu-descobri-o-seu-segredin",
  hook: "onRequest",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(swagger, {
  openapi: {
    info: {
      title: "IAM Microservice",
      description: "Professional Identity and Access Management Service",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "JWT access token sent in the Authorization header using the Bearer scheme.",
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

app.register(swaggerUi, {
  routePrefix: "/docs",
});

app.register(jwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
});

app.register(authenticateRoute);
app.register(getProfile);
app.register(createUser);
app.register(refreshToken);

app.setErrorHandler(errorHandler);
