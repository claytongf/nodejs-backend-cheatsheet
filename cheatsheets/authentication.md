# Cheatsheet · Authentication & Authorization

## Password hashing (bcrypt)

```ts
import bcrypt from 'bcryptjs';
const hash = await bcrypt.hash(plain, 10); // on register
const ok = await bcrypt.compare(plain, hash); // on login
```

## JWT

```ts
import jwt from 'jsonwebtoken';
const token = jwt.sign({ sub: user.id, role: user.role }, SECRET, { expiresIn: '1d' });
const payload = jwt.verify(token, SECRET); // throws if invalid/expired
```

## Bearer header

```
Authorization: Bearer <token>
```

```ts
const header = req.headers.authorization ?? '';
const token = header.startsWith('Bearer ') ? header.slice(7) : null;
```

## Auth middleware (attach req.user)

```ts
export function authenticate(req, _res, next) {
  const token = getBearer(req);
  if (!token) throw new UnauthorizedError();
  const payload = jwt.verify(token, env.JWT_SECRET);
  req.user = { id: payload.sub, role: payload.role };
  next();
}
```

## Role guard

```ts
export const requireRole = (role) => (req, _res, next) => {
  if (req.user.role !== role) throw new ForbiddenError();
  next();
};
```

## Ownership check

```ts
if (resource.ownerId !== user.id && user.role !== 'ADMIN') {
  throw new ForbiddenError();
}
```

## Status codes

| Case                          | Code  |
| ----------------------------- | ----- |
| No / invalid token            | `401` |
| Authenticated but not allowed | `403` |
| Bad credentials on login      | `401` |

## Don'ts

- ❌ Plain-text or fast-hash passwords
- ❌ Secrets in code
- ❌ Returning `passwordHash`
- ❌ Trusting client-sent roles
