# 11 · Authorization (Roles & Permissions)

## What it is

**Authorization** answers "are you allowed to do this?" — it runs _after_ authentication.
This project combines two checks:

- **Role-based**: users have a role (`USER` or `ADMIN`); some routes require `ADMIN`.
- **Ownership-based**: a user may only touch projects/tasks they own (admins may touch any).

## Why it matters in backend development

Authentication without authorization means any logged-in user can read or delete anyone's
data. Ownership checks are the most common real-world authorization rule and a frequent
source of security bugs (the "IDOR" vulnerability).

## How it appears in real Node.js jobs

You will write a `requireRole('ADMIN')` middleware, and inside services you will verify the
resource belongs to `req.user` before mutating it. Reviewers will specifically look for
missing ownership checks.

## Simple code example

```ts
// Role middleware
export function requireRole(role: Role) {
  return (req, _res, next) => {
    if (req.user.role !== role) throw new ForbiddenError();
    next();
  };
}

// Ownership check inside a service
async function getOwnedProject(projectId: string, user: AuthUser) {
  const project = await projectsRepository.findById(projectId);
  if (!project) throw new NotFoundError('Project not found');
  if (project.ownerId !== user.id && user.role !== 'ADMIN') {
    throw new ForbiddenError();
  }
  return project;
}
```

## Practical example from this project

`GET /users` and `DELETE /users/:id` require `ADMIN` via the role middleware. The
`projects` and `tasks` services enforce ownership: a `USER` can only read/update/delete
their own records, while an `ADMIN` bypasses the ownership check. This logic lives in the
services, not the controllers.

## Laravel comparison

| Laravel                                | This project                     |
| -------------------------------------- | -------------------------------- |
| Gates (`Gate::allows`)                 | role middleware + service checks |
| Policies (`ProjectPolicy`)             | ownership checks in services     |
| `$this->authorize('update', $project)` | `getOwnedProject(id, user)`      |
| Roles via Spatie permission            | `role` enum on `User`            |

## Common beginner mistakes

- Checking only authentication, not ownership (IDOR: `/projects/999` returns someone
  else's project).
- Doing authorization in the controller inconsistently instead of in the service.
- Returning `404` vs `403` inconsistently (leaking whether a resource exists).
- Trusting a `role` value sent by the client instead of the one from the verified token/DB.

## Best practices

- Authenticate first, then authorize.
- Centralize ownership checks in services (one helper per resource).
- Treat the role from the verified token/DB as the source of truth.
- Decide a consistent policy for hidden resources (often return `404` to avoid leaking
  existence) and apply it everywhere.

## Study checklist

- [ ] I can explain the difference between authentication and authorization.
- [ ] I can implement a role-checking middleware.
- [ ] I can add an ownership check in a service.
- [ ] I understand the IDOR vulnerability.

## Interview questions

**Q: Difference between RBAC and ownership checks?**
A: RBAC grants access by role (admin/user); ownership checks grant access based on whether
the user owns the specific resource. Real apps usually need both.

**Q: What is an IDOR vulnerability?**
A: Insecure Direct Object Reference — letting a user access another user's resource by
guessing/changing an ID, because the server never checks ownership.

**Q: Where should authorization live?**
A: In the service layer (and reusable middleware for roles), so it is consistent and
testable, not scattered across controllers.
