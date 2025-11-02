---
name: api-development
description: RESTful API development best practices for Node.js, Express, TypeScript. Covers endpoints, routes, middleware, error handling, validation, authentication, API design patterns, HTTP methods, status codes, and API documentation. Use when building REST APIs, creating endpoints, designing routes, implementing middleware, or working with HTTP services.
---

# API Development Best Practices

## Purpose

Provide comprehensive guidance for building robust, maintainable RESTful APIs with Node.js, Express, and TypeScript.

## When to Use

- Creating new API endpoints or routes
- Designing API architecture
- Implementing middleware
- Setting up authentication/authorization
- Handling API errors and validation
- Working with HTTP methods and status codes

## Table of Contents

- [Core Principles](#core-principles)
- [Project Structure](#project-structure)
- [Security Checklist](#security-checklist)
- [Common Pitfalls](#common-pitfalls)
- [Reference Files](#reference-files)

## Core Principles

### 1. RESTful Design

**Resource-Based URLs:**
```typescript
// ✅ Good - Noun-based, hierarchical
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
GET    /api/users/:id/posts

// ❌ Bad - Verb-based
GET /api/getUsers
POST /api/createUser
```

**HTTP Method Semantics:**
- `GET` - Retrieve data (idempotent, no side effects)
- `POST` - Create new resource
- `PUT` - Replace entire resource
- `PATCH` - Partial update
- `DELETE` - Remove resource

### 2. Status Codes

Use appropriate HTTP status codes:

**Success:**
- `200` OK - GET, PUT, PATCH success
- `201` Created - POST success
- `204` No Content - DELETE success

**Client Errors:**
- `400` Bad Request - Validation error
- `401` Unauthorized - Authentication required
- `403` Forbidden - No permission
- `404` Not Found
- `409` Conflict - Duplicate resource
- `422` Unprocessable Entity

**Server Errors:**
- `500` Internal Server Error
- `503` Service Unavailable

### 3. Error Handling

**Consistent Error Response:**
```typescript
// types/api.ts
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
    stack?: string; // Development only
  };
}

// middleware/errorHandler.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      }
    });
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
};
```

### 4. Request Validation

**Use Zod for Type-Safe Validation:**
```typescript
import { z } from 'zod';

const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1).max(100)
  })
});

export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: error.errors
          }
        });
      }
      next(error);
    }
  };
};

// Usage
router.post('/users', validate(createUserSchema), createUser);
```

### 5. Async Error Handling

**Wrap Async Routes:**
```typescript
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage
router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await userService.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
  }
  res.json({ data: user });
}));
```

### 6. Authentication Middleware

**JWT Authentication:**
```typescript
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'NO_TOKEN', 'Authentication required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    throw new ApiError(401, 'INVALID_TOKEN', 'Invalid or expired token');
  }
});
```

### 7. Response Formatting

**Consistent Success Response:**
```typescript
interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  meta?: any
) => {
  const response: ApiResponse<T> = { data };
  if (meta) response.meta = meta;
  res.status(statusCode).json(response);
};
```

### 8. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests'
    }
  }
});

app.use('/api', apiLimiter);
```

### 9. CORS Configuration

```typescript
import cors from 'cors';

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
};

app.use(cors(corsOptions));
```

## Project Structure

```
src/
├── routes/           # Route definitions
│   ├── index.ts
│   ├── users.ts
│   └── auth.ts
├── controllers/      # Request handlers
│   ├── userController.ts
│   └── authController.ts
├── services/         # Business logic
│   ├── userService.ts
│   └── authService.ts
├── middleware/       # Custom middleware
│   ├── auth.ts
│   ├── errorHandler.ts
│   └── validation.ts
├── types/           # TypeScript types
│   ├── api.ts
│   └── models.ts
├── utils/           # Helper functions
│   └── asyncHandler.ts
└── app.ts           # Express app setup
```

## Security Checklist

- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection (sanitize output)
- [ ] CSRF protection for state-changing operations
- [ ] Rate limiting configured
- [ ] Authentication on protected routes
- [ ] Authorization checks for resource access
- [ ] Secure headers (use helmet.js)
- [ ] HTTPS in production
- [ ] Environment variables for secrets
- [ ] Error messages don't leak sensitive info

## Common Pitfalls

❌ **Don't return sensitive data:**
```typescript
// Bad - Includes password hash
res.json(user);

// Good - Filter sensitive fields
const { password, ...safeUser } = user;
res.json(safeUser);
```

❌ **Don't trust client data:**
```typescript
// Bad - Client can modify
const userId = req.body.userId;

// Good - Use authenticated user
const userId = req.user.userId;
```

❌ **Don't catch errors silently:**
```typescript
// Bad - Error ignored
try { await operation(); } catch (e) { /* ignored */ }

// Good - Log and rethrow
try { await operation(); } catch (e) {
  logger.error(e);
  throw e;
}
```

## Performance Tips

1. **Database Optimization**
   - Use indexes on frequently queried fields
   - Avoid N+1 queries
   - Implement pagination

2. **Caching**
   - Cache expensive computations
   - Use Redis for sessions
   - Implement HTTP caching headers

3. **Compression**
   ```typescript
   import compression from 'compression';
   app.use(compression());
   ```

4. **Async Operations**
   - Don't block the event loop
   - Use worker threads for CPU-intensive tasks
   - Implement background jobs for long operations

## Reference Files

For detailed examples and advanced patterns, see:

- [AUTHENTICATION.md](AUTHENTICATION.md) - Complete auth patterns (JWT, OAuth, sessions)
- [TESTING.md](TESTING.md) - API testing strategies with examples
- [DOCUMENTATION.md](DOCUMENTATION.md) - OpenAPI/Swagger setup guide
- [ADVANCED.md](ADVANCED.md) - WebSockets, GraphQL, microservices

---

**Remember**: APIs are contracts. Once published, maintain backward compatibility or version your API (e.g., `/api/v1/`, `/api/v2/`).

**Line Count**: < 500 lines ✅
