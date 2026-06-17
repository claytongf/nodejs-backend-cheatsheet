# 03 · Add Refresh Tokens

Level: Advanced

## Context

The current JWT flow returns one access token. That is easy to understand, but production
systems often use short-lived access tokens plus refresh tokens.

## Requirements

- Keep access tokens short-lived.
- Add a refresh token flow.
- Store enough refresh token state to support revocation.
- Add logout/revoke behavior.
- Keep password hashes and token secrets out of responses and logs.

## Likely Files

- `prisma/schema.prisma`
- `src/modules/auth/auth.schemas.ts`
- `src/modules/auth/auth.service.ts`
- `src/modules/auth/auth.controller.ts`
- `src/modules/auth/auth.routes.ts`
- `src/shared/utils/jwt.ts`
- `src/tests/auth.test.ts`
- `src/config/swagger.ts`

## Suggested Steps

1. Model refresh tokens or token sessions in Prisma.
2. Return access token and refresh token on login/register.
3. Add `POST /auth/refresh`.
4. Add `POST /auth/logout`.
5. Hash stored refresh tokens instead of storing raw tokens.
6. Add tests for refresh, invalid refresh, and logout.
7. Document the trade-offs in the auth chapter.

## Acceptance Criteria

- A valid refresh token returns a new access token.
- An invalid refresh token returns `401`.
- A revoked refresh token cannot be reused.
- Logout invalidates the active refresh token.
- Auth tests cover success and failure paths.

## Interview Follow-Ups

- Why are refresh tokens harder to revoke if they are fully stateless?
- Why should stored refresh tokens be hashed?
- What changes if tokens are stored in browser cookies instead of local storage?
