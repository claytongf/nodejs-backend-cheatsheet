// 13 · Common Node.js vulnerabilities — and how to fix them.
//
// Run it:  npx tsx examples/13-security/index.ts
//
// Each section shows a VULNERABLE pattern and the FIXED version side by side, and prints
// proof of the difference. These are the bugs that show up in real Node code reviews and in
// security interviews. Pair this file with docs/13-security-best-practices.md and the
// OWASP Top 10 (https://owasp.org/www-project-top-ten/).
//
// The app in src/ already applies the production-grade defenses (helmet, rate limiting,
// Zod validation, bcrypt, JWT verification, ownership checks). This file isolates the
// *concepts* so you can explain them.

import jwt from 'jsonwebtoken';
import { randomBytes, timingSafeEqual } from 'node:crypto';

const line = () => console.log('—'.repeat(78));

// 1) SQL INJECTION ------------------------------------------------------------------------
// Vulnerable: building SQL by string concatenation lets input change the query's meaning.
// Fixed: parameterized queries (placeholders) — the driver/ORM sends data separately from
// SQL, so it can never be parsed as code. Prisma does this for you; raw queries must use
// $queryRaw`...` tagged templates (NOT $queryRawUnsafe with concatenation).
function sqlInjection() {
  console.log('1) SQL injection');
  const userInput = "'; DROP TABLE users; --";

  const vulnerable = `SELECT * FROM users WHERE email = '${userInput}'`;
  console.log('   VULNERABLE query:', vulnerable);
  console.log('   → input was parsed as SQL: the DROP TABLE is now part of the statement.');

  // FIXED (conceptual): the value travels as a bound parameter, never as SQL text.
  const fixed = { sql: 'SELECT * FROM users WHERE email = $1', params: [userInput] };
  console.log('   FIXED query:    ', fixed.sql, 'with params', fixed.params);
  console.log('   → the input is data; it can never become a DROP TABLE command.');
  line();
}

// 2) JWT "alg: none" / weak verification --------------------------------------------------
// Vulnerable: verifying a token without pinning the algorithm lets an attacker present an
// UNSIGNED token (alg: "none"), or a token signed with a different scheme, and have it
// accepted. Fixed: pass an explicit `algorithms` allowlist.
function jwtPitfalls() {
  console.log('2) JWT verification');
  const secret = 'super-secret';
  // An attacker crafts an unsigned token claiming to be the admin.
  const forged = jwt.sign({ sub: 'attacker', role: 'ADMIN' }, '', { algorithm: 'none' });

  try {
    // VULNERABLE: no algorithms allowlist — many libs historically accepted "none".
    const decoded = jwt.verify(forged, secret, { algorithms: ['HS256', 'none' as jwt.Algorithm] });
    console.log('   VULNERABLE: forged token ACCEPTED as', JSON.stringify(decoded));
  } catch {
    console.log('   VULNERABLE path rejected it here (lib-dependent), but never allow "none".');
  }

  try {
    // FIXED: only accept HS256 tokens that match our secret.
    jwt.verify(forged, secret, { algorithms: ['HS256'] });
    console.log('   FIXED: unexpectedly accepted (should not happen)');
  } catch {
    console.log('   FIXED: forged "none" token REJECTED (algorithms: ["HS256"]).');
  }
  console.log('   Also: always set an expiry (expiresIn) and verify issuer/audience.');
  line();
}

// 3) MASS ASSIGNMENT / over-posting -------------------------------------------------------
// Vulnerable: spreading the whole request body into an update lets a user set fields they
// should not control (e.g. role: "ADMIN"). Fixed: only copy the fields you explicitly allow
// — in the real app this is what the Zod schema does.
function massAssignment() {
  console.log('3) Mass assignment');
  const dbUser = { id: 'u1', name: 'Alice', role: 'USER' };
  const requestBody = { name: 'Alice Cooper', role: 'ADMIN' }; // attacker added `role`

  const vulnerable = { ...dbUser, ...requestBody };
  console.log('   VULNERABLE result role:', vulnerable.role, '(privilege escalation!)');

  const allowed = (({ name }) => ({ name }))(requestBody); // pick only editable fields
  const fixed = { ...dbUser, ...allowed };
  console.log('   FIXED result role:     ', fixed.role, '(role cannot be set by the client).');
  line();
}

// 4) ReDoS (catastrophic backtracking) ----------------------------------------------------
// Vulnerable: a regex with nested quantifiers can take exponential time on crafted input,
// blocking the single-threaded event loop (a denial of service). Fixed: a linear-time regex
// (or validate length/shape with simpler rules).
function redos() {
  console.log('4) ReDoS');
  const evil = '(a+)+$'; // nested quantifier → catastrophic on "aaaa...!"
  const input = 'a'.repeat(24) + '!';

  let start = performance.now();
  new RegExp(evil).test(input);
  console.log(`   VULNERABLE regex /${evil}/ took ${(performance.now() - start).toFixed(1)}ms`);

  const safe = '^a+$';
  start = performance.now();
  new RegExp(safe).test(input);
  console.log(`   FIXED regex /${safe}/ took ${(performance.now() - start).toFixed(1)}ms`);
  line();
}

// 5) PROTOTYPE POLLUTION ------------------------------------------------------------------
// Vulnerable: a naive deep-merge of untrusted JSON can write to Object.prototype via a
// "__proto__" key, changing the behavior of EVERY object in the process. Fixed: skip
// dangerous keys (or use Object.create(null) / a vetted library / structuredClone).
function prototypePollution() {
  console.log('5) Prototype pollution');
  // JSON.parse keeps "__proto__" as a real own key, so untrusted JSON can carry the payload.
  const malicious = () => JSON.parse('{"__proto__": {"isAdmin": true}}');
  type Dict = Record<string, unknown>;

  // A naive RECURSIVE merge is the classic bug: recursing into target["__proto__"] reaches
  // Object.prototype, and the next assignment writes a property onto EVERY object.
  function unsafeMerge(target: Dict, source: Dict): Dict {
    for (const key in source) {
      const value = source[key];
      if (typeof value === 'object' && value !== null) {
        if (typeof target[key] !== 'object' || target[key] === null) target[key] = {};
        unsafeMerge(target[key] as Dict, value as Dict);
      } else {
        target[key] = value;
      }
    }
    return target;
  }
  unsafeMerge({}, malicious());
  console.log('   VULNERABLE: ({} as any).isAdmin =', ({} as Dict).isAdmin, '(polluted!)');
  delete (Object.prototype as Dict).isAdmin; // clean up the demo damage

  // Fixed: skip the dangerous keys before recursing.
  function safeMerge(target: Dict, source: Dict): Dict {
    for (const key in source) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
      const value = source[key];
      if (typeof value === 'object' && value !== null) {
        if (typeof target[key] !== 'object' || target[key] === null) target[key] = {};
        safeMerge(target[key] as Dict, value as Dict);
      } else {
        target[key] = value;
      }
    }
    return target;
  }
  safeMerge({}, malicious());
  console.log('   FIXED: ({} as any).isAdmin =', ({} as Dict).isAdmin, '(not polluted).');
  line();
}

// 6) TIMING-SAFE SECRET COMPARISON --------------------------------------------------------
// Vulnerable: comparing secrets/tokens with === leaks information via timing (it returns as
// soon as bytes differ). Fixed: crypto.timingSafeEqual, which always compares all bytes.
function timingSafe() {
  console.log('6) Timing-safe comparison');
  const real = randomBytes(32);
  const guess = randomBytes(32);

  const naive = real.toString('hex') === guess.toString('hex'); // timing varies with input
  console.log('   VULNERABLE: === comparison (timing leak), result:', naive);

  const safe = real.length === guess.length && timingSafeEqual(real, guess);
  console.log('   FIXED: timingSafeEqual, result:', safe);
  line();
}

// 7) LEAKING SENSITIVE DATA IN ERRORS -----------------------------------------------------
// Vulnerable: returning raw error messages/stack traces (or secrets) to clients helps
// attackers map your system. Fixed: log details server-side; return a generic message.
function errorLeakage() {
  console.log('7) Error/secret leakage');
  const err = new Error('connect ECONNREFUSED 10.0.0.5:5432 (password=hunter2)');

  console.log('   VULNERABLE response:', { error: err.message }); // leaks internals
  console.log('   FIXED response:     ', { error: 'Internal Server Error' });
  console.log('   (Log the real error with a correlation id; never ship it to the client.)');
  line();
}

console.log('Common Node.js vulnerabilities — vulnerable vs. fixed\n');
sqlInjection();
jwtPitfalls();
massAssignment();
redos();
prototypePollution();
timingSafe();
errorLeakage();
console.log('See docs/13-security-best-practices.md for the full checklist.');
