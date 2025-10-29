# Task Manager API - Sprint 1

API REST desarrollada en NestJS para gestionar tareas (Tasks) con autenticación JWT, validaciones y persistencia en PostgreSQL.

## Descripción

Esta API permite a usuarios autenticados gestionar sus tareas personales mediante operaciones CRUD completas, con validaciones robustas, documentación Swagger y tests automatizados.

## Características

- ✅ Autenticación JWT (registro y login)
- ✅ CRUD completo de tareas
- ✅ Paginación en listado de tareas
- ✅ Validaciones con class-validator
- ✅ Documentación con Swagger
- ✅ Tests unitarios y e2e
- ✅ Persistencia en PostgreSQL con TypeORM
- ✅ Solo usuarios autenticados pueden acceder a sus propias tareas

## Stack Tecnológico

- **Framework:** NestJS
- **Lenguaje:** TypeScript
- **Base de datos:** PostgreSQL
- **ORM:** TypeORM
- **Autenticación:** JWT (JsonWebToken)
- **Validación:** class-validator, class-transformer
- **Documentación:** Swagger (@nestjs/swagger)
- **Testing:** Jest (unit + e2e)

## Requisitos Previos

- Node.js >= 18
- PostgreSQL >= 14
- npm

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

## Variables de Entorno

Crear archivo `.env` en la raíz:

```env
# Database
DB_URI=postgresql://postgres.swalgkwxvjdoyguflzby:paJdxhJngfNrApTA@aws-1-us-east-1.pooler.supabase.com:6543/postgres

# JWT
JWT_SECRET=tu_secret_super_seguro
JWT_EXPIRATION=1d

# App
PORT=3000
NODE_ENV=development
```

## Ejecutar la Aplicación

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

## Endpoints API

### Autenticación

#### POST /auth/register
Registrar un nuevo usuario
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### POST /auth/login
Iniciar sesión
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Tareas (requieren autenticación)

#### GET /tasks?page=1&limit=10
Listar tareas con paginación

#### POST /tasks
Crear una nueva tarea
```json
{
  "title": "Completar documentación",
  "description": "Escribir README con ejemplos"
}
```

#### GET /tasks/:id
Obtener una tarea por ID

#### PATCH /tasks/:id
Actualizar una tarea
```json
{
  "title": "Título actualizado",
  "status": "completed"
}
```

#### DELETE /tasks/:id
Eliminar una tarea

## Documentación Swagger

Una vez iniciado el servidor, acceder a:

```
http://localhost:3000/api
```

## Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## Estructura del Proyecto

```
src/
├── auth/
│   ├── dto/
│   │   ├── register.dto.ts
│   │   └── login.dto.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── tasks/
│   ├── dto/
│   │   ├── create-task.dto.ts
│   │   ├── update-task.dto.ts
│   │   └── pagination.dto.ts
│   ├── entities/
│   │   └── task.entity.ts
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   ├── tasks.service.spec.ts
│   └── tasks.module.ts
├── users/
│   ├── entities/
│   │   └── user.entity.ts
│   ├── users.service.ts
│   └── users.module.ts
├── common/
│   └── decorators/
│       └── get-user.decorator.ts
├── app.module.ts
└── main.ts
```

## Criterios de Aceptación

- ✅ AC-1: Endpoints CRUD funcionan y responden JSON correctamente
- ✅ AC-2: Solo usuarios autenticados pueden crear/editar/eliminar y ver sus propias tareas
- ✅ AC-3: Validaciones en create y update (título obligatorio, mínimo 3 caracteres)
- ✅ AC-4: Paginación en listado (page, limit) con valores por defecto (page=1, limit=10)
- ✅ AC-5: Swagger disponible en /api
- ✅ AC-6: Persistencia en PostgreSQL
- ✅ AC-7: Tests básicos implementados (unitarios y e2e)

## Convención de Commits

Este proyecto utiliza Conventional Commits:

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `test:` Añadir o modificar tests
- `refactor:` Refactorización de código
- `style:` Cambios de formato
- `chore:` Tareas de mantenimiento

## Autor

Desarrollado como parte del Sprint 1 - Task Manager API

