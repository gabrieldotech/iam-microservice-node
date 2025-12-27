# 🏗️ DIAGRAMA COMPLETO E DIDÁTICO - IAM SERVICE

> **Diagrama ABSOLUTAMENTE COMPLETO** mostrando TUDO que acontece na aplicação: arquitetura, princípios SOLID, Clean Architecture, Docker, fluxos de dados, segurança, validações e muito mais!

---

## 📊 DIAGRAMA MERMAID COMPLETO

```mermaid
graph TB
    %% ============================================
    %% CAMADA DE INFRAESTRUTURA - DOCKER
    %% ============================================
    subgraph DOCKER["🐳 INFRAESTRUTURA DOCKER"]
        DOCKER_COMPOSE["docker-compose.yml<br/>━━━━━━━━━━━━━━━━<br/>Orquestra containers"]
        
        subgraph CONTAINER_DB["Container: database"]
            POSTGRES_IMAGE["Imagem: bitnami/postgresql:latest<br/>━━━━━━━━━━━━━━━━<br/>Porta: 5432<br/>User: postgres<br/>Database: iam_db"]
        end
        
        subgraph CONTAINER_API["Container: api"]
            DOCKERFILE["Dockerfile<br/>━━━━━━━━━━━━━━━━<br/>FROM node:22-alpine<br/>WORKDIR /app<br/>npm install<br/>prisma generate<br/>Porta: 3333"]
        end
        
        NETWORK["Network: iam-network<br/>━━━━━━━━━━━━━━━━<br/>Driver: bridge<br/>Comunicação entre containers"]
        
        DOCKER_COMPOSE --> CONTAINER_DB
        DOCKER_COMPOSE --> CONTAINER_API
        CONTAINER_DB --> NETWORK
        CONTAINER_API --> NETWORK
    end
    
    %% ============================================
    %% INICIALIZAÇÃO DA APLICAÇÃO
    %% ============================================
    subgraph INIT["🚀 INICIALIZAÇÃO DO SERVIDOR"]
        START([npm run dev<br/>tsx watch]) --> SERVER["server.ts<br/>━━━━━━━━━━━━━━━━<br/>Entry Point da aplicação"]
        SERVER --> ENV_LOAD["env/index.ts<br/>━━━━━━━━━━━━━━━━<br/>Zod Schema para ENV<br/>✓ NODE_ENV<br/>✓ JWT_SECRET<br/>✓ PORT (3333)<br/>✓ DATABASE_URL"]
        
        ENV_LOAD -->|Validação falhou| ENV_ERROR[❌ Lança erro<br/>Invalid environment variables]
        ENV_LOAD -->|Validação OK| APP_INIT["app.ts<br/>━━━━━━━━━━━━━━━━<br/>Configuração do Fastify"]
    end
    
    %% ============================================
    %% CONFIGURAÇÃO DO FASTIFY
    %% ============================================
    subgraph FASTIFY_CONFIG["⚙️ CONFIGURAÇÃO FASTIFY"]
        APP_INIT --> FASTIFY_INSTANCE["Instância Fastify<br/>━━━━━━━━━━━━━━━━<br/>withTypeProvider\u003cZodTypeProvider\u003e()"]
        
        FASTIFY_INSTANCE --> REGISTER_PLUGINS["Registro de Plugins"]
        
        subgraph PLUGINS["📦 PLUGINS REGISTRADOS"]
            COOKIE_PLUGIN["@fastify/cookie<br/>━━━━━━━━━━━━━━━━<br/>Secret: custom secret<br/>Hook: onRequest<br/>Gerencia cookies HTTP"]
            
            JWT_PLUGIN["@fastify/jwt<br/>━━━━━━━━━━━━━━━━<br/>Secret: env.JWT_SECRET<br/>Access: 10min<br/>Refresh: 7 dias<br/>Cookie: refreshToken"]
            
            SWAGGER_PLUGIN["@fastify/swagger<br/>━━━━━━━━━━━━━━━━<br/>OpenAPI 3.0<br/>Bearer Auth configurado<br/>Schemas automáticos"]
            
            SWAGGER_UI["@fastify/swagger-ui<br/>━━━━━━━━━━━━━━━━<br/>Rota: /docs<br/>Interface interativa"]
            
            ZOD_PROVIDER["fastify-type-provider-zod<br/>━━━━━━━━━━━━━━━━<br/>Validator Compiler<br/>Serializer Compiler<br/>JSON Schema Transform"]
        end
        
        REGISTER_PLUGINS --> COOKIE_PLUGIN
        REGISTER_PLUGINS --> JWT_PLUGIN
        REGISTER_PLUGINS --> SWAGGER_PLUGIN
        REGISTER_PLUGINS --> SWAGGER_UI
        REGISTER_PLUGINS --> ZOD_PROVIDER
    end
    
    %% ============================================
    %% HOOKS E MIDDLEWARES GLOBAIS
    %% ============================================
    subgraph HOOKS_CONFIG["🔗 HOOKS E MIDDLEWARES"]
        COOKIE_PLUGIN --> HOOKS_SETUP["Configuração de Hooks"]
        
        HOOKS_SETUP --> ON_RESPONSE["onResponse Hook<br/>━━━━━━━━━━━━━━━━<br/>Log de requisições em dev<br/>[METHOD] URL - STATUS"]
        
        HOOKS_SETUP --> ERROR_HANDLER_SETUP["Error Handler Global<br/>━━━━━━━━━━━━━━━━<br/>error-handler.ts"]
        
        subgraph ERROR_HANDLER_LOGIC["🛡️ TRATAMENTO DE ERROS"]
            ERR_CHECK{Tipo de Erro?}
            
            ERR_ZOD["ZodError<br/>━━━━━━━━━━━━━━━━<br/>Status: 400<br/>z.treeifyError()<br/>Erros de validação formatados"]
            
            ERR_APP["AppError (custom)<br/>━━━━━━━━━━━━━━━━<br/>Status: error.statusCode<br/>Message: error.message<br/>Erros de negócio"]
            
            ERR_GENERIC["Erro Genérico<br/>━━━━━━━━━━━━━━━━<br/>Status: 500<br/>Internal server error<br/>Log completo em dev"]
            
            ERR_CHECK -->|instanceof ZodError| ERR_ZOD
            ERR_CHECK -->|instanceof AppError| ERR_APP
            ERR_CHECK -->|Outro| ERR_GENERIC
        end
        
        ERROR_HANDLER_SETUP --> ERR_CHECK
    end
    
    %% ============================================
    %% REGISTRO DE ROTAS
    %% ============================================
    subgraph ROUTES_SETUP["🛣️ REGISTRO DE ROTAS"]
        HOOKS_SETUP --> ROUTE_REGISTRATION["Registro de Rotas HTTP"]
        
        ROUTE_REGISTRATION --> ROUTE_1["POST /users<br/>━━━━━━━━━━━━━━━━<br/>createUser route<br/>Schema: createUserSchema<br/>Controller: createUserController"]
        
        ROUTE_REGISTRATION --> ROUTE_2["POST /sessions<br/>━━━━━━━━━━━━━━━━<br/>authenticateRoute<br/>Schema: authenticateSchema<br/>Controller: authenticateController"]
        
        ROUTE_REGISTRATION --> ROUTE_3["GET /me<br/>━━━━━━━━━━━━━━━━<br/>getProfile route<br/>Middleware: verifyJWT<br/>Schema: getProfileSchema<br/>Controller: getProfileController"]
        
        ROUTE_REGISTRATION --> ROUTE_4["PATCH /token/refresh<br/>━━━━━━━━━━━━━━━━<br/>refresh route<br/>Schema: refreshSchema<br/>Controller inline"]
        
        ROUTE_REGISTRATION --> ROUTE_5["GET /docs<br/>━━━━━━━━━━━━━━━━<br/>Swagger UI<br/>Documentação interativa OpenAPI"]
    end
    
    %% ============================================
    %% SERVIDOR PRONTO
    %% ============================================
    ROUTE_REGISTRATION --> LISTEN["app.listen()<br/>━━━━━━━━━━━━━━━━<br/>Host: 0.0.0.0<br/>Port: env.PORT (3333)"]
    LISTEN --> READY([✅ Servidor Rodando<br/>IAM Microservice running])
    
    %% ============================================
    %% FLUXO 1: CRIAR USUÁRIO
    %% ============================================
    subgraph FLOW_CREATE["📝 FLUXO 1: CRIAR USUÁRIO - POST /users"]
        REQ_CREATE([Cliente HTTP<br/>POST /users]) --> ZOD_CREATE["Zod Validation<br/>━━━━━━━━━━━━━━━━<br/>Body Schema:<br/>• name: min 3 chars<br/>• email: formato email<br/>• password: min 6 chars"]
        
        ZOD_CREATE -->|❌ Inválido| ZOD_ERR_CREATE[ZodError → 400]
        ZOD_CREATE -->|✅ Válido| CTRL_CREATE["createUserController<br/>━━━━━━━━━━━━━━━━<br/>Extrai: name, email, password"]
        
        CTRL_CREATE --> FACTORY_CREATE["makeCreateUserUseCase()<br/>━━━━━━━━━━━━━━━━<br/>🏭 FACTORY PATTERN<br/>📌 SOLID: D - Dependency Inversion"]
        
        FACTORY_CREATE --> REPO_INST_CREATE["new PrismaUsersRepository()<br/>━━━━━━━━━━━━━━━━<br/>🗄️ REPOSITORY PATTERN<br/>Implementa: IUsersRepository"]
        
        REPO_INST_CREATE --> UC_INST_CREATE["new CreateUserUseCase(repo)<br/>━━━━━━━━━━━━━━━━<br/>💉 DEPENDENCY INJECTION<br/>📌 SOLID: S - Single Responsibility"]
        
        UC_INST_CREATE --> UC_EXECUTE_CREATE["useCase.execute()<br/>━━━━━━━━━━━━━━━━<br/>Lógica de criação"]
        
        UC_EXECUTE_CREATE --> CHECK_EMAIL_CREATE["findByEmail(email)<br/>━━━━━━━━━━━━━━━━<br/>Verifica duplicação no DB"]
        
        CHECK_EMAIL_CREATE -->|Email já existe| ERR_EXISTS["UserAlreadyExistsError<br/>━━━━━━━━━━━━━━━━<br/>extends AppError<br/>Status: 409 Conflict<br/>Message: User already exists"]
        
        CHECK_EMAIL_CREATE -->|Email disponível| HASH_CREATE["bcrypt.hash(password, 10)<br/>━━━━━━━━━━━━━━━━<br/>🔐 SEGURANÇA<br/>Hash com 10 salt rounds"]
        
        HASH_CREATE --> PRISMA_CREATE["prisma.user.create()<br/>━━━━━━━━━━━━━━━━<br/>INSERT INTO users<br/>Retorna: User completo"]
        
        PRISMA_CREATE --> RESPONSE_CREATE["Response 201 Created<br/>━━━━━━━━━━━━━━━━<br/>Remove password_hash<br/>Retorna: id, name, email"]
    end
    
    %% ============================================
    %% FLUXO 2: AUTENTICAR USUÁRIO
    %% ============================================
    subgraph FLOW_AUTH["🔐 FLUXO 2: AUTENTICAR - POST /sessions"]
        REQ_AUTH([Cliente HTTP<br/>POST /sessions]) --> ZOD_AUTH["Zod Validation<br/>━━━━━━━━━━━━━━━━<br/>Body Schema:<br/>• email: formato email<br/>• password: min 6 chars"]
        
        ZOD_AUTH -->|❌ Inválido| ZOD_ERR_AUTH[ZodError → 400]
        ZOD_AUTH -->|✅ Válido| CTRL_AUTH["authenticateController<br/>━━━━━━━━━━━━━━━━<br/>Extrai: email, password"]
        
        CTRL_AUTH --> FACTORY_AUTH["makeAuthenticateUserUseCase()<br/>━━━━━━━━━━━━━━━━<br/>🏭 FACTORY PATTERN"]
        
        FACTORY_AUTH --> REPO_INST_AUTH["new PrismaUsersRepository()<br/>━━━━━━━━━━━━━━━━<br/>🗄️ REPOSITORY PATTERN"]
        
        REPO_INST_AUTH --> UC_INST_AUTH["new AuthenticateUserUseCase(repo)<br/>━━━━━━━━━━━━━━━━<br/>💉 DEPENDENCY INJECTION"]
        
        UC_INST_AUTH --> UC_EXECUTE_AUTH["useCase.execute()<br/>━━━━━━━━━━━━━━━━<br/>email, password_plain"]
        
        UC_EXECUTE_AUTH --> FIND_USER_AUTH["findByEmail(email)<br/>━━━━━━━━━━━━━━━━<br/>Busca usuário no DB"]
        
        FIND_USER_AUTH -->|❌ Não encontrado| ERR_CRED_1["InvalidCredentialsError<br/>━━━━━━━━━━━━━━━━<br/>extends AppError<br/>Status: 401 Unauthorized<br/>Message: Invalid credentials"]
        
        FIND_USER_AUTH -->|✅ Encontrado| COMPARE_PASS["bcrypt.compare()<br/>━━━━━━━━━━━━━━━━<br/>password_plain vs password_hash<br/>🔐 SEGURANÇA"]
        
        COMPARE_PASS -->|❌ Senha inválida| ERR_CRED_2["InvalidCredentialsError<br/>━━━━━━━━━━━━━━━━<br/>Status: 401"]
        
        COMPARE_PASS -->|✅ Senha válida| RETURN_USER["Retorna user<br/>━━━━━━━━━━━━━━━━<br/>id, email, name, role"]
        
        RETURN_USER --> GEN_ACCESS["reply.jwtSign()<br/>━━━━━━━━━━━━━━━━<br/>Access Token<br/>Payload: {role}<br/>Sub: userId<br/>Expira: 10min"]
        
        RETURN_USER --> GEN_REFRESH["reply.jwtSign()<br/>━━━━━━━━━━━━━━━━<br/>Refresh Token<br/>Payload: {}<br/>Sub: userId<br/>Expira: 7 dias"]
        
        GEN_REFRESH --> SET_COOKIE_AUTH["reply.setCookie()<br/>━━━━━━━━━━━━━━━━<br/>Nome: refreshToken<br/>httpOnly: true<br/>secure: true<br/>sameSite: true<br/>path: /<br/>🔒 XSS/CSRF Protection"]
        
        SET_COOKIE_AUTH --> RESPONSE_AUTH["Response 200 OK<br/>━━━━━━━━━━━━━━━━<br/>Body: {token: accessToken}<br/>Cookie: refreshToken"]
    end
    
    %% ============================================
    %% FLUXO 3: OBTER PERFIL (PROTEGIDO)
    %% ============================================
    subgraph FLOW_PROFILE["👤 FLUXO 3: OBTER PERFIL - GET /me"]
        REQ_PROFILE([Cliente HTTP<br/>GET /me<br/>Header: Authorization: Bearer \u003ctoken\u003e]) --> MIDDLEWARE_VERIFY["verifyJWT Middleware<br/>━━━━━━━━━━━━━━━━<br/>Hook: onRequest<br/>Executa ANTES do controller"]
        
        MIDDLEWARE_VERIFY --> JWT_VERIFY_PROFILE["request.jwtVerify()<br/>━━━━━━━━━━━━━━━━<br/>Verifica assinatura JWT<br/>Valida expiração<br/>Decodifica payload"]
        
        JWT_VERIFY_PROFILE -->|❌ Token inválido/expirado| ERR_UNAUTH_PROF["401 Unauthorized<br/>━━━━━━━━━━━━━━━━<br/>Message: Unauthorized<br/>🔒 MIDDLEWARE BLOQUEOU"]
        
        JWT_VERIFY_PROFILE -->|✅ Token válido| DECODE_JWT["Decodifica JWT<br/>━━━━━━━━━━━━━━━━<br/>request.user = {<br/>  sub: userId,<br/>  role: userRole<br/>}"]
        
        DECODE_JWT --> CTRL_PROFILE["getProfileController<br/>━━━━━━━━━━━━━━━━<br/>userId = request.user.sub"]
        
        CTRL_PROFILE --> FACTORY_PROFILE["makeGetUserProfileUseCase()<br/>━━━━━━━━━━━━━━━━<br/>🏭 FACTORY PATTERN"]
        
        FACTORY_PROFILE --> REPO_INST_PROFILE["new PrismaUsersRepository()<br/>━━━━━━━━━━━━━━━━<br/>🗄️ REPOSITORY PATTERN"]
        
        REPO_INST_PROFILE --> UC_INST_PROFILE["new GetUserProfileUseCase(repo)<br/>━━━━━━━━━━━━━━━━<br/>💉 DEPENDENCY INJECTION"]
        
        UC_INST_PROFILE --> UC_EXECUTE_PROFILE["useCase.execute({userId})<br/>━━━━━━━━━━━━━━━━<br/>Busca perfil"]
        
        UC_EXECUTE_PROFILE --> FIND_BY_ID["findById(userId)<br/>━━━━━━━━━━━━━━━━<br/>Busca no DB por ID"]
        
        FIND_BY_ID -->|❌ Não encontrado| ERR_NOT_FOUND["ResourceNotFoundError<br/>━━━━━━━━━━━━━━━━<br/>extends AppError<br/>Status: 404 Not Found"]
        
        FIND_BY_ID -->|✅ Encontrado| RESPONSE_PROFILE["Response 200 OK<br/>━━━━━━━━━━━━━━━━<br/>user: {<br/>  id, name, email, role<br/>}<br/>SEM password_hash"]
    end
    
    %% ============================================
    %% FLUXO 4: REFRESH TOKEN
    %% ============================================
    subgraph FLOW_REFRESH["🔄 FLUXO 4: RENOVAR TOKEN - PATCH /token/refresh"]
        REQ_REFRESH([Cliente HTTP<br/>PATCH /token/refresh<br/>Cookie: refreshToken]) --> CTRL_REFRESH["refresh controller (inline)<br/>━━━━━━━━━━━━━━━━<br/>Lógica direto na rota"]
        
        CTRL_REFRESH --> VERIFY_REFRESH_TOKEN["request.jwtVerify()<br/>━━━━━━━━━━━━━━━━<br/>onlyCookie: true<br/>Valida apenas o cookie"]
        
        VERIFY_REFRESH_TOKEN -->|❌ Token inválido| ERR_REFRESH_INVALID["InvalidRefreshTokenError<br/>━━━━━━━━━━━━━━━━<br/>extends AppError<br/>Status: 401<br/>🔒 TOKEN ROTATION FAILED"]
        
        VERIFY_REFRESH_TOKEN -->|✅ Token válido| EXTRACT_SUB["Extrai userId<br/>━━━━━━━━━━━━━━━━<br/>const {sub} = request.user"]
        
        EXTRACT_SUB --> NEW_ACCESS_TOKEN["reply.jwtSign()<br/>━━━━━━━━━━━━━━━━<br/>Novo Access Token<br/>Sub: userId<br/>Expira: 10min"]
        
        EXTRACT_SUB --> NEW_REFRESH_TOKEN["reply.jwtSign()<br/>━━━━━━━━━━━━━━━━<br/>Novo Refresh Token<br/>Sub: userId<br/>Expira: 7 dias<br/>🔄 TOKEN ROTATION"]
        
        NEW_REFRESH_TOKEN --> SET_COOKIE_REFRESH["reply.setCookie()<br/>━━━━━━━━━━━━━━━━<br/>Atualiza cookie httpOnly<br/>refreshToken renovado"]
        
        SET_COOKIE_REFRESH --> RESPONSE_REFRESH["Response 200 OK<br/>━━━━━━━━━━━━━━━━<br/>Body: {token: newAccessToken}<br/>Cookie: newRefreshToken"]
    end
    
    %% ============================================
    %% CAMADA DE DADOS - PRISMA
    %% ============================================
    subgraph DATABASE_LAYER["🗄️ CAMADA DE DADOS - PRISMA ORM"]
        PRISMA_CLIENT["@prisma/client<br/>━━━━━━━━━━━━━━━━<br/>Gerado por: prisma generate<br/>Type-safe database client"]
        
        PRISMA_SCHEMA["schema.prisma<br/>━━━━━━━━━━━━━━━━<br/>Datasource: postgresql<br/>Generator: client"]
        
        subgraph MODELS["📋 MODELS E ENUMS"]
            USER_MODEL["model User {<br/>━━━━━━━━━━━━━━━━<br/>id: String @id @default(uuid)<br/>email: String @unique<br/>name: String?<br/>password_hash: String<br/>role: Role @default(MEMBER)<br/>createdAt: DateTime @default(now)<br/>updatedAt: DateTime @updatedAt<br/>@@map('users')<br/>}"]
            
            ROLE_ENUM["enum Role {<br/>━━━━━━━━━━━━━━━━<br/>ADMIN<br/>MEMBER<br/>}"]
        end
        
        PRISMA_SCHEMA --> USER_MODEL
        PRISMA_SCHEMA --> ROLE_ENUM
        
        MIGRATIONS["prisma/migrations/<br/>━━━━━━━━━━━━━━━━<br/>SQL migration files<br/>Versionamento do schema"]
        
        PRISMA_SCHEMA --> MIGRATIONS
        PRISMA_CLIENT --> POSTGRES_DB
    end
    
    %% ============================================
    %% BANCO DE DADOS
    %% ============================================
    subgraph DATABASE["💾 POSTGRESQL DATABASE"]
        POSTGRES_DB[("PostgreSQL<br/>━━━━━━━━━━━━━━━━<br/>Database: iam_db<br/>Port: 5432<br/>Tabela: users")]
        
        TABLE_STRUCTURE["Estrutura da Tabela users:<br/>━━━━━━━━━━━━━━━━<br/>• PK: id (UUID)<br/>• UNIQUE: email<br/>• Índices automáticos<br/>• Timestamps automáticos"]
        
        POSTGRES_DB --> TABLE_STRUCTURE
    end
    
    %% ============================================
    %% CLEAN ARCHITECTURE - CAMADAS
    %% ============================================
    subgraph CLEAN_ARCH["🏛️ CLEAN ARCHITECTURE - CAMADAS"]
        LAYER_1["CAMADA 1: CORE (Domain)<br/>━━━━━━━━━━━━━━━━<br/>• Erros customizados (AppError)<br/>• Regras de negócio puras<br/>• Independente de frameworks<br/>📌 SOLID: S, O, L"]
        
        LAYER_2["CAMADA 2: MODULES (Use Cases)<br/>━━━━━━━━━━━━━━━━<br/>• CreateUserUseCase<br/>• AuthenticateUserUseCase<br/>• GetUserProfileUseCase<br/>• Repositories (interfaces)<br/>• DTOs<br/>📌 SOLID: S, D"]
        
        LAYER_3["CAMADA 3: INFRA (Adapters)<br/>━━━━━━━━━━━━━━━━<br/>• HTTP (Fastify, Controllers, Routes)<br/>• Database (Prisma, Repositories)<br/>• Middlewares<br/>• Schemas Zod<br/>📌 SOLID: I, D"]
        
        LAYER_4["CAMADA 4: MAIN (Frameworks)<br/>━━━━━━━━━━━━━━━━<br/>• server.ts<br/>• app.ts<br/>• Configurações e Plugins<br/>• Entry point"]
        
        LAYER_1 --> LAYER_2
        LAYER_2 --> LAYER_3
        LAYER_3 --> LAYER_4
        
        DEPENDENCY_RULE["📐 REGRA DE DEPENDÊNCIA<br/>━━━━━━━━━━━━━━━━<br/>Camadas internas NÃO conhecem externas<br/>Dependências apontam para DENTRO<br/>Use Cases não conhecem Fastify<br/>Domain não conhece Prisma"]
    end
    
    %% ============================================
    %% PRINCÍPIOS SOLID
    %% ============================================
    subgraph SOLID_PRINCIPLES["⭐ PRINCÍPIOS SOLID APLICADOS"]
        SOLID_S["S - Single Responsibility<br/>━━━━━━━━━━━━━━━━<br/>✅ 1 UseCase = 1 responsabilidade<br/>✅ CreateUserUseCase: só criar user<br/>✅ AuthenticateUserUseCase: só autenticar<br/>✅ Cada controller: 1 endpoint"]
        
        SOLID_O["O - Open/Closed<br/>━━━━━━━━━━━━━━━━<br/>✅ IUsersRepository (interface)<br/>✅ Pode adicionar novos repos<br/>✅ Sem modificar use cases"]
        
        SOLID_L["L - Liskov Substitution<br/>━━━━━━━━━━━━━━━━<br/>✅ PrismaUsersRepository<br/>✅ InMemoryUsersRepository<br/>✅ Ambos implementam IUsersRepository<br/>✅ Intercambiáveis nos testes"]
        
        SOLID_I["I - Interface Segregation<br/>━━━━━━━━━━━━━━━━<br/>✅ IUsersRepository: métodos específicos<br/>✅ create(), findByEmail(), findById()<br/>✅ Sem métodos desnecessários"]
        
        SOLID_D["D - Dependency Inversion<br/>━━━━━━━━━━━━━━━━<br/>✅ Use Cases dependem de INTERFACES<br/>✅ NÃO de implementações concretas<br/>✅ Dependency Injection via constructor<br/>✅ Factories gerenciam dependências"]
    end
    
    %% ============================================
    %% SEGURANÇA
    %% ============================================
    subgraph SECURITY["🔒 SEGURANÇA E BOAS PRÁTICAS"]
        SEC_1["Password Hashing<br/>━━━━━━━━━━━━━━━━<br/>✅ bcrypt com 10 salt rounds<br/>✅ NUNCA armazena senha plain<br/>✅ NUNCA retorna password_hash"]
        
        SEC_2["JWT Strategy<br/>━━━━━━━━━━━━━━━━<br/>✅ Access Token: 10min (curto)<br/>✅ Refresh Token: 7 dias<br/>✅ Refresh em httpOnly cookie<br/>✅ Token Rotation no refresh"]
        
        SEC_3["Cookie Security<br/>━━━━━━━━━━━━━━━━<br/>✅ httpOnly: true (anti-XSS)<br/>✅ secure: true (só HTTPS)<br/>✅ sameSite: true (anti-CSRF)<br/>✅ Não acessível via JavaScript"]
        
        SEC_4["Validação de Input<br/>━━━━━━━━━━━━━━━━<br/>✅ Zod schemas em TODAS rotas<br/>✅ Validação ANTES do controller<br/>✅ Type-safe em runtime<br/>✅ Erros 400 formatados"]
        
        SEC_5["Environment Variables<br/>━━━━━━━━━━━━━━━━<br/>✅ .env não commitado (.gitignore)<br/>✅ .env.example como template<br/>✅ Validação Zod no startup<br/>✅ JWT_SECRET obrigatório"]
        
        SEC_6["Error Handling<br/>━━━━━━━━━━━━━━━━<br/>✅ Nunca expõe stack trace em prod<br/>✅ Mensagens genéricas para client<br/>✅ Log detalhado apenas em dev<br/>✅ Status codes semânticos"]
    end
    
    %% ============================================
    %% TESTABILIDADE
    %% ============================================
    subgraph TESTING["🧪 TESTABILIDADE"]
        TEST_UNIT["Testes Unitários (Vitest)<br/>━━━━━━━━━━━━━━━━<br/>✅ Use Cases isolados<br/>✅ InMemoryUsersRepository<br/>✅ Sem rede/banco real<br/>✅ Rápidos e confiáveis"]
        
        TEST_E2E["Testes E2E<br/>━━━━━━━━━━━━━━━━<br/>✅ Controllers completos<br/>✅ Banco de teste (.env.test)<br/>✅ Supertest + Fastify<br/>✅ Fluxo HTTP real"]
        
        TEST_PATTERN["Padrões que facilitam testes:<br/>━━━━━━━━━━━━━━━━<br/>✅ Dependency Injection<br/>✅ Repository Pattern<br/>✅ Factory Pattern<br/>✅ Interfaces bem definidas"]
    end
    
    %% ============================================
    %% CONEXÕES ENTRE FLUXOS E COMPONENTES
    %% ============================================
    READY --> REQ_CREATE
    READY --> REQ_AUTH
    READY --> REQ_PROFILE
    READY --> REQ_REFRESH
    
    PRISMA_CREATE --> POSTGRES_DB
    FIND_USER_AUTH --> POSTGRES_DB
    CHECK_EMAIL_CREATE --> POSTGRES_DB
    FIND_BY_ID --> POSTGRES_DB
    
    ERR_EXISTS --> ERR_CHECK
    ERR_CRED_1 --> ERR_CHECK
    ERR_CRED_2 --> ERR_CHECK
    ERR_NOT_FOUND --> ERR_CHECK
    ERR_REFRESH_INVALID --> ERR_CHECK
    ZOD_ERR_CREATE --> ERR_CHECK
    ZOD_ERR_AUTH --> ERR_CHECK
    ERR_UNAUTH_PROF --> ERR_CHECK
    
    POSTGRES_IMAGE --> POSTGRES_DB
    DOCKERFILE --> FASTIFY_INSTANCE
    
    %% ============================================
    %% ESTILOS
    %% ============================================
    classDef docker fill:#0db7ed,stroke:#2496ed,stroke-width:3px,color:#000,font-weight:bold
    classDef init fill:#4ade80,stroke:#22c55e,stroke-width:2px,color:#000
    classDef fastify fill:#60a5fa,stroke:#3b82f6,stroke-width:2px,color:#000
    classDef plugin fill:#c084fc,stroke:#a855f7,stroke-width:2px,color:#000
    classDef route fill:#f472b6,stroke:#ec4899,stroke-width:2px,color:#000
    classDef controller fill:#a78bfa,stroke:#8b5cf6,stroke-width:2px,color:#000
    classDef usecase fill:#fbbf24,stroke:#f59e0b,stroke-width:2px,color:#000
    classDef repo fill:#34d399,stroke:#10b981,stroke-width:2px,color:#000
    classDef error fill:#f87171,stroke:#ef4444,stroke-width:3px,color:#000
    classDef db fill:#38bdf8,stroke:#0ea5e9,stroke-width:3px,color:#000
    classDef middleware fill:#fb923c,stroke:#f97316,stroke-width:2px,color:#000
    classDef security fill:#fcd34d,stroke:#fbbf24,stroke-width:2px,color:#000
    classDef solid fill:#d946ef,stroke:#c026d3,stroke-width:2px,color:#000
    classDef clean fill:#818cf8,stroke:#6366f1,stroke-width:2px,color:#000
    classDef test fill:#4ade80,stroke:#22c55e,stroke-width:2px,color:#000
    
    class DOCKER_COMPOSE,CONTAINER_DB,CONTAINER_API,POSTGRES_IMAGE,DOCKERFILE,NETWORK docker
    class START,SERVER,ENV_LOAD,APP_INIT,READY init
    class FASTIFY_INSTANCE,REGISTER_PLUGINS,LISTEN fastify
    class COOKIE_PLUGIN,JWT_PLUGIN,SWAGGER_PLUGIN,SWAGGER_UI,ZOD_PROVIDER plugin
    class ROUTE_1,ROUTE_2,ROUTE_3,ROUTE_4,ROUTE_5,ROUTE_REGISTRATION route
    class CTRL_CREATE,CTRL_AUTH,CTRL_PROFILE,CTRL_REFRESH controller
    class UC_INST_CREATE,UC_INST_AUTH,UC_INST_PROFILE,UC_EXECUTE_CREATE,UC_EXECUTE_AUTH,UC_EXECUTE_PROFILE usecase
    class REPO_INST_CREATE,REPO_INST_AUTH,REPO_INST_PROFILE,PRISMA_CLIENT repo
    class ERR_CHECK,ERR_ZOD,ERR_APP,ERR_GENERIC,ERR_EXISTS,ERR_CRED_1,ERR_CRED_2,ERR_NOT_FOUND,ERR_REFRESH_INVALID,ERR_UNAUTH_PROF,ERROR_HANDLER_SETUP error
    class POSTGRES_DB,DATABASE_LAYER,PRISMA_SCHEMA,USER_MODEL,TABLE_STRUCTURE db
    class MIDDLEWARE_VERIFY,JWT_VERIFY_PROFILE,ON_RESPONSE middleware
    class SEC_1,SEC_2,SEC_3,SEC_4,SEC_5,SEC_6 security
    class SOLID_S,SOLID_O,SOLID_L,SOLID_I,SOLID_D solid
    class LAYER_1,LAYER_2,LAYER_3,LAYER_4,DEPENDENCY_RULE clean
    class TEST_UNIT,TEST_E2E,TEST_PATTERN test
```

---

## 📖 LEGENDA DO DIAGRAMA

### 🎨 Cores e Significados

| Cor | Componente | Descrição |
|-----|------------|-----------|
| 🔵 **Azul Claro** | Docker | Infraestrutura de containers |
| 🟢 **Verde** | Inicialização | Entry points e startup |
| 🔵 **Azul Médio** | Fastify | Framework e configurações |
| 🟣 **Roxo Claro** | Plugins | Extensões do Fastify |
| 🌸 **Rosa** | Rotas | Endpoints HTTP |
| 🟣 **Roxo** | Controllers | Camada de controle HTTP |
| 🟡 **Amarelo** | Use Cases | Lógica de negócio |
| 🟢 **Verde Água** | Repositories | Camada de dados |
| 🔴 **Vermelho** | Erros | Tratamento de exceções |
| 🔵 **Azul Água** | Database | PostgreSQL e Prisma |
| 🟠 **Laranja** | Middlewares | Interceptadores |
| 🟡 **Amarelo Claro** | Segurança | Práticas de segurança |
| 💜 **Magenta** | SOLID | Princípios de design |
| 🔵 **Índigo** | Clean Arch | Arquitetura limpa |
| 🟢 **Verde Limão** | Testes | Estratégias de teste |

---

## 🏗️ RESUMO DA ARQUITETURA

### Camadas (de fora para dentro):

1. **Infrastructure (Docker)** → Containers e orquestração
2. **Main (Entry Point)** → server.ts, app.ts, configurações
3. **HTTP Layer** → Routes, Controllers, Middlewares, Schemas
4. **Use Cases** → Regras de negócio, Factories
5. **Domain** → Entities, Interfaces, Errors
6. **Data** → Repositories, Prisma, PostgreSQL

### Fluxos Principais:

1. **Criar Usuário**: Request → Validação Zod → Controller → Factory → UseCase → Repository → DB → Response
2. **Autenticar**: Request → Validação → Controller → UseCase → Verificação bcrypt → Geração JWT → Response + Cookie
3. **Perfil Protegido**: Request → Middleware JWT → Verificação → Controller → UseCase → DB → Response
4. **Refresh Token**: Request com Cookie → Verificação → Rotação de Tokens → Response + Novo Cookie

### Princípios SOLID:

- **S**: 1 classe = 1 responsabilidade
- **O**: Extensível via interfaces (Repository)
- **L**: Substituível (Prisma ↔ InMemory)
- **I**: Interfaces segregadas e específicas
- **D**: Depende de abstrações (DI via constructor)

### Segurança:

- Bcrypt para senhas (10 rounds)
- JWT para autenticação (Access 10min + Refresh 7d)
- Cookies httpOnly/secure/sameSite
- Validação Zod em toda entrada
- Variáveis de ambiente protegidas

---

**Diagrama gerado para IAM Service - Mostrando TODO o fluxo da aplicação!** 🚀
