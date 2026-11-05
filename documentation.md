# E-Commerce Store Backend — Architecture & Technical Documentation

> **Version:** 1.0.0  
> **Status:** Active Development  
> **Target Runtime:** Node.js 24+ (ESM `"type": "module"`)  
> **Framework:** NestJS 12.x  
> **Primary Database:** MongoDB (Mongoose 9.x)  
> **In-Memory Cache & Session Store:** Redis (Upstash)  
> **Security & Auth:** JWT (`jsonwebtoken`), Bcrypt, Role-Based Access Control (RBAC)  

---

## Table of Contents
1. [Overview & Project Objectives](#1-overview--project-objectives)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Project Directory Structure](#3-project-directory-structure)
4. [Environment Configuration](#4-environment-configuration)
5. [Chronological Implementation Progression](#5-chronological-implementation-progression)
   - [Phase 1: Project Initialization & Tooling](#phase-1-project-initialization--tooling)
   - [Phase 2: Database Connection & Base Validation](#phase-2-database-connection--base-validation)
   - [Phase 3: Robust DTO Validation Layer](#phase-3-robust-dto-validation-layer)
   - [Phase 4: User Schema Design & Password Hashing](#phase-4-user-schema-design--password-hashing)
   - [Phase 5: User Registration (Signup API)](#phase-5-user-registration-signup-api)
   - [Phase 6: Standardized Success Response Interceptor](#phase-6-standardized-success-response-interceptor)
   - [Phase 7: Centralized Exception Filter](#phase-7-centralized-exception-filter)
   - [Phase 8: Custom Password Match Validator](#phase-8-custom-password-match-validator)
   - [Phase 9: Email Service & Verification Flag](#phase-9-email-service--verification-flag)
   - [Phase 10: Redis Service Integration & OTP Caching](#phase-10-redis-service-integration--otp-caching)
   - [Phase 11: JWT Token Service & Login API](#phase-11-jwt-token-service--login-api)
   - [Phase 12: Authentication Middleware](#phase-12-authentication-middleware)
   - [Phase 13: Guards, Role-Based Access Control (RBAC) & Profile Endpoints](#phase-13-guards-role-based-access-control-rbac--profile-endpoints)
   - [Phase 14: Composite Authentication & Authorization Decorator](#phase-14-composite-authentication--authorization-decorator)
6. [API Specification & Endpoints](#6-api-specification--endpoints)
   - [Authentication APIs (`/api/auth`)](#authentication-apis-apiauth)
   - [User Management APIs (`/users`)](#user-management-apis-users)
7. [In-Depth Architectural & Security Patterns](#7-in-depth-architectural--security-patterns)
   - [Mongoose Virtuals & Data Normalization](#1-mongoose-virtuals--data-normalization)
   - [Sensitive Data Sanitization via `toJSON`](#2-sensitive-data-sanitization-via-tojson)
   - [Audience & Signature Segregation in JWTs](#3-audience--signature-segregation-in-jwts)
   - [Dual Execution Context (HTTP & WebSocket) Support](#4-dual-execution-context-http--websocket-support)
   - [Redis Connection Lifecycle Management](#5-redis-connection-lifecycle-management)
   - [Composite Decorator Pattern (`applyDecorators`)](#6-composite-decorator-pattern-applydecorators)
8. [Next Roadmap Milestones](#8-next-roadmap-milestones)

---

## 1. Overview & Project Objectives
The **E-Commerce Store Backend** is an enterprise-ready, modular RESTful API built on the **NestJS** framework. It provides a scalable, secure, and resilient foundation for an e-commerce platform.

### Core Objectives:
- **Modular Monolith Architecture:** Separation of concerns using NestJS modules (`AuthModule`, `UserModule`, `RedisModule`).
- **High Security & RBAC:** Granular authorization distinguishing standard `USER` roles from privileged `ADMIN` roles.
- **Session & Caching Performance:** Utilizing Redis for ephemeral tokens, OTP storage, and future WebSocket state management.
- **Consistent API Contracts:** Enforcing strict request validation and unified JSON response formats for both success and error outcomes.

---

## 2. Tech Stack & Dependencies

| Layer / Domain | Technology | Package / Version | Description |
| :--- | :--- | :--- | :--- |
| **Framework** | NestJS | `@nestjs/core`, `@nestjs/common` (v12.0.1) | Modular architecture with inversion of control (IoC). |
| **Language & Engine** | TypeScript | `typescript` (v6.0.2), Node.js 24+ | Modern ESM configuration (`"type": "module"`). |
| **NoSQL Database** | MongoDB & Mongoose | `@nestjs/mongoose` (v12.0.0), `mongoose` (v9.10.1) | Document-oriented schema with virtuals and transforms. |
| **In-Memory Store** | Redis | `redis` (v6.2.1) & Upstash | Distributed key-value cache with TTL management. |
| **Validation** | Class Validator | `class-validator` (v0.15.1), `class-transformer` (v0.5.1) | Decorator-driven runtime schema validation. |
| **Authentication** | JWT | `jsonwebtoken` (v9.0.3) | Stateless access and refresh token management. |
| **Cryptography** | Bcrypt | `bcrypt` (v6.0.0) | Salted password hashing with environment-driven rounds. |
| **Mailing** | Nodemailer | `nodemailer` (v10.0.12) | SMTP client configured for transactional HTML emails. |
| **Linter & Test** | Oxlint & Vitest | `oxlint` (v1.58.0), `vitest` (v4.1.2) | High-speed static analysis and unit/E2E testing. |

---

## 3. Project Directory Structure

```text
e-commerce-store/
├── .env.dev                             # Development environment configuration
├── .env.pro                             # Production environment configuration
├── documentation.md                     # Single source of technical documentation
├── package.json                         # Project manifest & dependencies
├── tsconfig.json                        # Base TypeScript compiler settings
├── tsconfig.build.json                  # Production build configuration
├── vitest.config.ts                     # Unit testing setup
├── oxlint.json                          # Linter rule set
├── src/
│   ├── main.ts                          # Application entry point & bootstrap
│   ├── app.module.ts                    # Root module configuring global providers & DBs
│   ├── app.controller.ts                # Base health-check controller
│   ├── app.service.ts                   # Base application service
│   │
│   ├── config/
│   │   └── env.service.ts               # Centralized process.env mapping
│   │
│   ├── DB/
│   │   ├── index.ts                     # Barrel export for database schemas and models
│   │   └── models/
│   │       └── user.model.ts            # User schema, virtuals, and toJSON hooks
│   │
│   ├── common/                          # Shared cross-cutting concerns
│   │   ├── Decorator/
│   │   │   ├── index.ts                 # Barrel exports for custom decorators
│   │   │   ├── auth.decorator.ts        # Composite @auth() decorator combining guards and roles
│   │   │   └── role.decorator.ts        # Custom @Role() metadata decorator
│   │   ├── Enums/
│   │   │   ├── index.ts
│   │   │   └── user.enum.ts             # UserRole, UserGender, and UserProvider enums
│   │   ├── Filters/
│   │   │   └── http-exception.filter.ts # GlobalExceptionFilter for unified error output
│   │   ├── Interceptors/
│   │   │   └── transform.interceptor.ts # TransformInterceptor for standardized success output
│   │   ├── Interfaces/
│   │   │   ├── index.ts
│   │   │   ├── auth.interface.ts        # IAuthReq extending Express Request
│   │   │   └── User.Interface.ts        # Domain user interfaces
│   │   ├── guard/
│   │   │   ├── index.ts
│   │   │   ├── authentication.guard.ts  # Token extraction & user hydration guard
│   │   │   └── authorzation.guard.ts    # RBAC role evaluation guard
│   │   ├── middelware/
│   │   │   └── authentication.middelware.ts # Route-level token decoding middleware
│   │   ├── pipe/
│   │   │   ├── validation.pipe.ts       # Global input validation pipe
│   │   │   └── customvalidation.pipe.ts # Custom pipe implementations
│   │   ├── services/
│   │   │   ├── email/
│   │   │   │   └── email.service.ts     # MailService (Nodemailer Gmail SMTP)
│   │   │   ├── redis/
│   │   │   │   ├── redis.module.ts      # RedisModule configuration
│   │   │   │   └── redis.service.ts     # Redis client operations & lifecycle hooks
│   │   │   └── token/
│   │   │       └── token.service.ts     # JWT generation, audience differentiation & decoding
│   │   └── utils/
│   │       └── security/
│   │           └── hash.ts              # Hashing service wrapping bcrypt
│   │
│   └── module/                          # Feature domain modules
│       ├── auth/
│       │   ├── auth.module.ts           # Authentication domain module
│       │   ├── auth.controller.ts       # Signup and login endpoints
│       │   ├── auth.service.ts          # Core authentication business logic
│       │   └── dto/
│       │       ├── signup.dto.ts        # Registration payload with password match check
│       │       └── login.dto.ts         # Login credentials payload
│       └── user/
│           ├── user.module.ts           # User management domain module
│           ├── user.controller.ts       # Profile and administrative endpoints
│           ├── user.service.ts          # User persistence logic
│           └── dto/
│               ├── create-user.dto.ts
│               └── update-user.dto.ts
```

---

## 4. Environment Configuration

The application leverages `@nestjs/config` loaded globally in `AppModule`. It supports loading from `.env.dev` and `.env.pro`.

```env
# Server
PORT=3008
MOOD=dev
BASE_URL=localhost:3000/

# Database
MONGO_URI=mongodb://localhost:27017/Nest_E-Commerce

# Cryptography & Bcrypt
SALT=12

# JWT Secrets & Signatures (Role Segregated)
JWT_ADMIN_SIGNATURE=AdminSecretSignatureKey
JWT_USER_SIGNATURE=UserSecretSignatureKey
JWT_ADMIN_REFRESH_SIGNATURE=AdminRefreshSignatureKey
JWT_USER_REFRESH_SIGNATURE=UserRefreshSignatureKey

# Email Service (Google SMTP)
EMAIL_USER=ahmedyosri733@gmail.com
EMAIL_PASS=your-google-app-password

# Redis Configuration (Upstash or Local)
REDIS_URL=rediss://default:your-token@your-host.upstash.io:6379

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# AWS S3 Storage (Future Media Uploads)
AWS_BUCKET_NAME=socialmedia-wensday
AWS_REGION=us-east-1
AWS_EXPIRATION_IN=120
```

---

## 5. Chronological Implementation Progression

This section documents the step-by-step evolution of the repository in exact chronological order based on git commit history.

```
[95c7137] Initial commit clean
   └── [0822d7c] Config & Mongo DB Connection & ValidationPipe
         └── [dcaf7e2] Class-validator & Class-transformer
               └── [c67abb4] User Schema & Bcrypt Hashing & Auth DTOs
                     └── [cf472d9] Signup API Implementation
                           └── [0e7f1d6] TransformInterceptor (Standard Success JSON)
                                 └── [0c2b44f] GlobalExceptionFilter (Standard Error JSON)
                                       └── [2ec4452] Custom Validator (confirmPassword check)
                                             └── [6c58af1] MailService (Gmail SMTP) & IsVerified flag
                                                   └── [18c1966] RedisService (Upstash Caching & TTL)
                                                         └── [2615aa2] Signup Bugfixes & Response Shaping
                                                               └── [dadfd27] TokenService (JWT Sign/Verify) & Login API
                                                                     └── [256539f] Authentication Middleware
                                                                           └── [7564b13] Guards & RBAC & User Profile APIs
```

---

### Phase 1: Project Initialization & Tooling
- **Commit:** `95c7137 - Initial commit clean`
- **Actions:**
  - Initialized a modern NestJS 12 skeleton with native ECMAScript Modules (`"type": "module"` in `package.json`).
  - Configured TypeScript with strict compiler checks.
  - Installed high-performance development tools: `oxlint` for rapid linting and `vitest` for test execution.

---

### Phase 2: Database Connection & Base Validation
- **Commit:** `0822d7c - add validationpip & add configration of DB in appmodule`
- **Actions:**
  - Installed `@nestjs/config` and `@nestjs/mongoose`.
  - Configured `MongooseModule.forRootAsync` in `AppModule` using `ConfigService.getOrThrow<string>('MONGO_URI')`.
  - Implemented detailed lifecycle event logging on the Mongoose connection:
    ```typescript
    connection.on('connected', () => console.log('DB connected'));
    connection.on('open', () => console.log('open'));
    connection.on('disconnected', () => console.log('disconnected'));
    connection.on('reconnected', () => console.log('reconnected'));
    connection.on('disconnecting', () => console.log('disconnecting'));
    ```
  - Scaffolded the initial `ValidationPipe` in `src/common/pipe/validation.pipe.ts`.

---

### Phase 3: Robust DTO Validation Layer
- **Commit:** `dcaf7e2 - implment class-validator && class-transformer for validtion`
- **Actions:**
  - Installed `class-validator` and `class-transformer`.
  - Enhanced `ValidationPipe` to transform incoming plain JavaScript payload objects into typed class instances via `plainToInstance(metatype, value)`.
  - Executed `validate(object)` on incoming instances, automatically rejecting malformed inputs with a `BadRequestException`.

---

### Phase 4: User Schema Design & Password Hashing
- **Commit:** `c67abb4 - add bcrypt packge and implemanted && impelment user Schema && add module auth and intgrated wiht app.module && create login and signup dto`
- **Actions:**
  1. **Domain Enums (`src/common/Enums/user.enum.ts`):**
     - `UserRole`: `USER`, `ADMIN`.
     - `UserGender`: `MALE`, `FEMALE`.
     - `UserProvider`: `SYSTEM`, `GOOGLE`.
  2. **User Mongoose Schema (`src/DB/models/user.model.ts`):**
     - Defined fields: `firstName`, `lastName`, `email` (unique, indexed), `phone`, `profilePic`, `gender`, `provider` (default: `SYSTEM`), `role` (default: `USER`), `password`.
     - Added virtual property `userName` with getter (`${firstName} ${lastName}`) and setter (splits full string by space into `firstName` and `lastName`).
     - Added `toJSON.transform` hook to delete `password` and `__v` from serialization outputs.
  3. **Hashing Utility (`src/common/utils/security/hash.ts`):**
     - Created `@Injectable() Hashing` provider using `bcrypt`.
     - `hashtext(plantext)`: Uses `ConfigService.getOrThrow<string>('SALT')` to asynchronously hash passwords.
     - `comparetext(plantext, cypherText)`: Verifies candidate passwords against stored hashes.
  4. **Module Scaffolding:**
     - Created `AuthModule`, `AuthController`, `AuthService`, and baseline `SignupDto` and `LoginDto`.

---

### Phase 5: User Registration (Signup API)
- **Commit:** `cf472d9 - add signup Api && implemant bycrpt for hashpassword`
- **Actions:**
  - Implemented `AuthService.signup(data: SignupDto)`:
    - Pre-flight check: Queries `UserModel.findOne({ email: data.email })`; throws `BadRequestException('This email Existed ')` on duplicate.
    - Hashes plain-text password via `this.hash.hashtext(data.password)`.
    - Persists user document via `this.UserModel.create(data)`.
  - Exposed `POST /api/auth/signup` route in `AuthController`.

---

### Phase 6: Standardized Success Response Interceptor
- **Commit:** `0e7f1d6 - Implemant Custom Response Interceptor For all Apis in app`
- **Actions:**
  - Built `TransformInterceptor<T>` implementing NestJS `NestInterceptor`.
  - Defined standard response contract:
    ```typescript
    export interface Response<T> {
      message: string;
      status: number;
      data: T;
    }
    ```
  - Intercepted request stream to dynamically attach HTTP status code (`context.switchToHttp().getResponse().statusCode`) and wrap payload in `{ message: 'success', status, data: data ?? null }`.
  - Registered globally via `APP_INTERCEPTOR` in `AppModule`.

---

### Phase 7: Centralized Exception Filter
- **Commit:** `0c2b44f - Add global Exception Filter for standard error format`
- **Actions:**
  - Built `GlobalExceptionFilter` implementing `ExceptionFilter`.
  - Handled both:
    - Known `HttpException` instances (extracting nested error arrays from `class-validator`).
    - Unhandled runtime `Error` instances (defaulting to HTTP 500).
  - Standardized error envelope:
    ```json
    {
      "message": "Error description or validation error list",
      "status": 400,
      "data": null,
      "timestamp": "2026-11-04T19:00:00.000Z"
    }
    ```
  - Registered globally via `APP_FILTER` in `AppModule`.

---

### Phase 8: Custom Password Match Validator
- **Commit:** `2ec4452 - impelmant method for check confirmPassword in dto signup`
- **Actions:**
  - Built custom constraint class `IsMatched` implementing `ValidatorConstraintInterface` in `src/module/auth/dto/signup.dto.ts`.
  - Evaluates `value === (args.object as any).password`.
  - Decorated `SignupDto.confirmPassword` with `@Validate(IsMatched)` to ensure equality at the validation stage before hitting controller logic.

---

### Phase 9: Email Service & Verification Flag
- **Commit:** `6c58af1 - implemant Email service && add key IsVerified in userModel`
- **Actions:**
  - Added `@Prop({ type: Boolean, default: false }) IsVerified!: Boolean;` to `User` schema.
  - Built `MailService` (`src/common/services/email/email.service.ts`) leveraging `nodemailer` with Gmail transport (`EMAIL_USER`, `EMAIL_PASS`).
  - Integrated into `AuthService.signup`:
    - Generates 5-digit verification code: `let code = Number(Math.random().toFixed(5).split('.')[1])`.
    - Dispatches welcome and OTP verification email to user upon successful creation.

---

### Phase 10: Redis Service Integration & OTP Caching
- **Commit:** `18c1966 - impleamt redis and his configgrations`
- **Actions:**
  - Created `RedisModule` and `@Injectable() RedisService` connected to Upstash Redis via `REDIS_URL`.
  - Managed connection lifecycle: `onModuleInit` initiates `client.connect()`; `onModuleDestroy` executes graceful `client.quit()`.
  - Provided comprehensive helper methods:
    - `set({ key, value, ttl })`: JSON stringifies objects and applies TTL.
    - `get(key)`: Retrieves and auto-parses JSON strings.
    - `delete`, `ttl`, `exists`, `mget`, `keys`.
    - `createRevokeKey({ userId, token })`: Constructs keys for token blacklisting (`revokeToken::{userId}::{token}`).
    - WebSocket tracking: `addSocket`, `removeSocket`, `getSockets`, `hasSockets`, `removeUser`.
  - Injected `RedisService` into `AuthService.signup` to cache generated OTP under `OTP::{userId}` with a 5-minute TTL (`ttl: 60 * 5`).

---

### Phase 11: JWT Token Service & Login API
- **Commit:** `dadfd27 - implement login API && implemant TokenService`
- **Actions:**
  1. **Token Service (`src/common/services/token/token.service.ts`):**
     - `generateToken(user, host)`:
       - Checks `user.role`:
         - If `ADMIN`: Uses `JWT_ADMIN_SIGNATURE` & `JWT_ADMIN_REFRESH_SIGNATURE` with audience `Admin`.
         - Default: Uses `JWT_USER_SIGNATURE` & `JWT_USER_REFRESH_SIGNATURE` with audience `User`.
       - Issues `accessToken` (60m validity) and `RefreshToken` (1-year validity).
     - `decodeAccessToken(token)` & `decodeRefreshToken(token)`:
       - Reads unverified token payload audience (`decode.aud`) to select the appropriate secret key, then validates signature with `jwt.verify`.
  2. **Login Logic (`AuthService.login`):**
     - Queries `UserModel.findOne({ email: data.email })`.
     - Validates password via `this.hash.comparetext(data.password, user.password)`.
     - Generates and returns access/refresh token pair alongside sanitized user object.

---

### Phase 12: Authentication Middleware
- **Commit:** `256539f - implemant middelware`
- **Actions:**
  - Created `AuthenticationMiddelware` implementing `NestMiddleware`.
  - Extracts and validates `authorization` header presence and syntax.
  - Verifies token via `TokenService.decodeAccessToken`.
  - Configured in `AuthModule` for all `auth/*` sub-routes.

---

### Phase 13: Guards, Role-Based Access Control (RBAC) & Profile Endpoints
- **Commit:** `7564b13 - feat(auth): implement authentication guard, role authorization, and user profile endpoints`
- **Actions:**
  1. **Extended Request Interface (`src/common/Interfaces/auth.interface.ts`):**
     - Created `IAuthReq` extending Express `Request` with `credentials: { decodeData: JwtPayload; userId: string; user?: UserDocument }`.
  2. **Authentication Guard (`src/common/guard/authentication.guard.ts`):**
     - Implements `CanActivate` supporting both HTTP and WebSocket (`ws`) contexts.
     - Parses `Authorization` header: supports `Basic <base64>` and `Bearer <token>`.
     - Decodes token via `TokenService` and queries database:
       `const user = await this.userModel.findById(userId);`
     - Attaches hydrated `user` and `userId` directly to `req.credentials`.
  3. **Role Metadata Decorator (`src/common/Decorator/role.decorator.ts`):**
     - Created `@Role(roles: UserRole[])` setting metadata on target handlers or controllers.
  4. **Authorization Guard (`src/common/guard/authorzation.guard.ts`):**
     - Evaluates target handler and class metadata using NestJS `Reflector`.
     - Compares required roles against `(req as IAuthReq).credentials.user.role`.
     - Rejects unauthorized requests with `ForbiddenException`.
  5. **Protected User Controller (`src/module/user/user.controller.ts`):**
     - Decorated controller with `@Role([UserRole.ADMIN])` and `@UseGuards(AuthenticationGuard, AuthorizationGuard)`.
     - Added endpoints:
       - `GET /users/profile`: Returns authenticated user document from request context.
       - `GET /users/newprofile`: Additional profile query endpoint.
       - `GET /users/getUser`: Retrieves user by authenticated ID via `UserService.findOne`.
       - `GET /users`: Dumps authenticated user ID and decoded token payload.

---

### Phase 14: Composite Authentication & Authorization Decorator
- **Commit:** `feat(auth): implement composite auth decorator combining roles and guards`
- **Actions:**
  1. **Composite Auth Decorator (`src/common/Decorator/auth.decorator.ts`):**
     - Implemented custom composite decorator `@auth(roles: UserRole[])` leveraging NestJS `applyDecorators`.
     - Bundled `@Role(roles)` metadata decorator with `@UseGuards(AuthenticationGuard, AuthorizationGuard)` into a single unified annotation.
     - Enforces deterministic guard execution sequence (`AuthenticationGuard` validates authentication and hydrates `req.credentials.user`, followed by `AuthorizationGuard` evaluating RBAC permissions).
  2. **Barrel Export Update (`src/common/Decorator/index.ts`):**
     - Exported `auth.decorator.ts` alongside `role.decorator.ts` for clean cross-module imports.
  3. **Refactored Protected Controller (`src/module/user/user.controller.ts`):**
     - Replaced fragmented multi-decorator declarations (`@Role(...)` + `@UseGuards(...)`) with the clean `@auth([UserRole.ADMIN])` decorator.
     - Cleaned up unused guard imports, adhering strictly to the DRY (Don't Repeat Yourself) principle.

---

## 6. API Specification & Endpoints

### Authentication APIs (`/api/auth`)

#### 1. User Registration
- **Endpoint:** `POST /api/auth/signup`
- **Access:** Public
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "userName": "Ahmed Yosri",
    "email": "ahmed.yosri@example.com",
    "phone": "+201012345678",
    "gender": "MALE",
    "password": "SecurePassword123!",
    "confirmPassword": "SecurePassword123!"
  }
  ```
- **Validation Constraints:**
  - `userName`: String, non-empty. Splits automatically into `firstName` and `lastName`.
  - `email`: Valid RFC 5322 email string. Must be unique in database.
  - `gender`: Enum member (`MALE` | `FEMALE`).
  - `password`: String, required.
  - `confirmPassword`: Must match `password` identically (enforced by `IsMatched`).
- **Success Response (HTTP 201 Created):**
  ```json
  {
    "message": "success",
    "status": 201,
    "data": {
      "NewUser": {
        "firstName": "Ahmed",
        "lastName": "Yosri",
        "email": "ahmed.yosri@example.com",
        "phone": "+201012345678",
        "gender": "MALE",
        "provider": "SYSTEM",
        "role": "USER",
        "IsVerified": false,
        "_id": "67290123abcd4567890ef123",
        "userName": "Ahmed Yosri"
      }
    }
  }
  ```

---

#### 2. User Login
- **Endpoint:** `POST /api/auth/login`
- **Access:** Public
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "ahmed.yosri@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Success Response (HTTP 200 OK):**
  ```json
  {
    "message": "success",
    "status": 200,
    "data": {
      "user": {
        "_id": "67290123abcd4567890ef123",
        "firstName": "Ahmed",
        "lastName": "Yosri",
        "email": "ahmed.yosri@example.com",
        "phone": "+201012345678",
        "gender": "MALE",
        "provider": "SYSTEM",
        "role": "USER",
        "IsVerified": false,
        "userName": "Ahmed Yosri"
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "RefreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

---

### User Management APIs (`/users`)
> [!IMPORTANT]
> All endpoints under `/users` require:
> 1. Header: `Authorization: Bearer <accessToken>`
> 2. Authenticated user must possess the `ADMIN` role.

#### 1. Retrieve Current Authenticated Profile
- **Endpoint:** `GET /users/profile` (or `GET /users/newprofile`)
- **Success Response (HTTP 200 OK):**
  ```json
  {
    "message": "success",
    "status": 200,
    "data": {
      "message": "Done",
      "data": {
        "_id": "67290123abcd4567890ef123",
        "firstName": "Ahmed",
        "lastName": "Yosri",
        "email": "admin@example.com",
        "role": "ADMIN",
        "gender": "MALE"
      }
    }
  }
  ```

#### 2. Query User Entity by Authenticated ID
- **Endpoint:** `GET /users/getUser`
- **Success Response (HTTP 200 OK):**
  ```json
  {
    "message": "success",
    "status": 200,
    "data": {
      "_id": "67290123abcd4567890ef123",
      "firstName": "Ahmed",
      "lastName": "Yosri",
      "email": "admin@example.com",
      "role": "ADMIN"
    }
  }
  ```

#### 3. Session & Token Debug Route
- **Endpoint:** `GET /users`
- **Success Response (HTTP 200 OK):**
  ```json
  {
    "message": "success",
    "status": 200,
    "data": {
      "userID": "67290123abcd4567890ef123",
      "DecodeDATA": {
        "id": "67290123abcd4567890ef123",
        "iat": 1730744000,
        "exp": 1730747600,
        "aud": "Admin",
        "iss": "localhost:3000"
      }
    }
  }
  ```

---

## 7. In-Depth Architectural & Security Patterns

### 1. Mongoose Virtuals & Data Normalization
To keep database storage clean while offering convenience to client applications:
- The database persists `firstName` and `lastName` independently for indexing and sorting.
- The virtual `userName` field acts as an abstraction:
  - **Setter:** Accepts a single string `"First Last"`, parses the space delimiter, and sets `this.firstName` and `this.lastName`.
  - **Getter:** Returns the concatenated string `${firstName} ${lastName}`.

### 2. Sensitive Data Sanitization via `toJSON`
To eliminate the risk of leaking sensitive hashes:
```typescript
toJSON: {
  virtuals: true,
  transform: (doc, ret: Record<string, any>) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
}
```
Regardless of where a `User` Mongoose document is serialized, the password hash and version key are automatically stripped out.

### 3. Audience & Signature Segregation in JWTs
To prevent privilege escalation attacks where a token generated for a regular user is repurposed for administrative endpoints:
1. `TokenService` checks `user.role`.
2. Admin tokens are signed with `JWT_ADMIN_SIGNATURE` with audience `Admin`.
3. Standard user tokens are signed with `JWT_USER_SIGNATURE` with audience `User`.
4. When decoding via `decodeAccessToken`, the audience claim (`aud`) is parsed first to select the expected cryptographic secret before executing verification.

### 4. Dual Execution Context (HTTP & WebSocket) Support
`AuthenticationGuard` is engineered to inspect context types:
```typescript
switch (context.getType()) {
  case 'http':
    req = context.switchToHttp().getRequest();
    authorzation = req.headers['authorization'];
    break;
  case 'ws':
    req = context.switchToWs().getClient();
    authorzation = req.headers?.['authorization'];
    break;
}
```
This enables seamless guard reusability when real-time WebSocket gateways are introduced.

### 5. Redis Connection Lifecycle Management
`RedisService` implements NestJS `OnModuleInit` and `OnModuleDestroy` hooks:
- Connects automatically upon application bootstrap.
- Closes client connections gracefully during server termination via `client.quit()`.
- Logs explicit telemetry for connection events (`connect`, `ready`, `reconnecting`, `error`).

### 6. Composite Decorator Pattern (`applyDecorators`)
Rather than distributing repetitive security metadata and guard bindings across route handlers or controllers, NestJS `applyDecorators` merges them into a clean, single-point composite decorator:
```typescript
export const auth = (roles: UserRole[]) => {
  return applyDecorators(
    Role(roles),
    UseGuards(AuthenticationGuard, AuthorizationGuard),
  );
};
```
This encapsulates guard evaluation order, standardizes RBAC attachment, prevents human error (e.g. forgetting `AuthenticationGuard` or altering guard order), and adheres to the DRY principle across protected resources.

---

## 8. Next Roadmap Milestones

1. **Email OTP Verification (`POST /api/auth/verify-otp`):**
   - Compare submitted OTP against cached Redis key `OTP::{userId}`.
   - Upon match, update `IsVerified: true` in MongoDB and delete the Redis key.
2. **Token Blacklisting & Logout (`POST /api/auth/logout`):**
   - Cache revoked tokens in Redis via `createRevokeKey({ userId, token })` with remaining TTL.
   - Enforce blacklist check in `AuthenticationGuard`.
3. **Password Reset Flow (`Forgot / Reset Password`):**
   - Issue temporary reset tokens via email OTP verification.
4. **Core E-Commerce Modules:**
   - **Catalog Module:** Categories, sub-categories, brands.
   - **Product Module:** Multi-variant inventory with AWS S3 image presigned URLs.
   - **Cart & Order Processing:** Real-time inventory deduction and payment gateway integration.
