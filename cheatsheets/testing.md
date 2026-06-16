# Cheatsheet · Testing (Jest & Supertest)

## Run

| Command                 | Does                    |
| ----------------------- | ----------------------- |
| `npm test`              | Run all tests           |
| `npm run test:watch`    | Watch mode              |
| `npx jest path/to/file` | Run one file            |
| `npx jest -t "name"`    | Run tests matching name |

## Structure

```ts
describe('feature', () => {
  beforeAll(async () => {
    /* setup */
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });
  beforeEach(async () => {
    /* reset DB */
  });

  it('does the thing', () => {
    expect(2 + 2).toBe(4);
  });
});
```

## Common matchers

| Matcher                        | Checks                |
| ------------------------------ | --------------------- |
| `toBe(x)`                      | Strict equality       |
| `toEqual(obj)`                 | Deep equality         |
| `toBeUndefined()`              | Is undefined          |
| `toBeTruthy()` / `toBeFalsy()` | Truthiness            |
| `toContain(x)`                 | Array/string contains |
| `toHaveProperty('k')`          | Object has key        |
| `rejects.toThrow()`            | Async throws          |

## Supertest (HTTP)

```ts
import request from 'supertest';
import { app } from '../app.js';

const res = await request(app).post('/auth/login').send({ email, password });

expect(res.status).toBe(200);
expect(res.body.token).toBeDefined();

// Authenticated request:
await request(app).get('/auth/me').set('Authorization', `Bearer ${token}`);
```

## Patterns

- Register → login → use token for protected routes.
- Test happy path **and** `401` / `403` / `422`.
- Use a dedicated test DB; reset between tests.
- Always `prisma.$disconnect()` in `afterAll`.
