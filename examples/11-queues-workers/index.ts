// Background jobs with an in-memory queue + worker.
//
// Run it:  npx tsx examples/11-queues-workers/index.ts
//
// Why this exists: HTTP handlers must stay fast. Slow work — sending email, resizing images,
// calling a third-party API — should be handed to a *background worker* so the request can
// return immediately. See docs/14-queues-workers-redis.md.
//
// In production you would use a real queue backed by Redis (e.g. BullMQ) so jobs survive
// restarts and can be processed by many workers across machines. This file keeps the SAME
// shape (enqueue → worker pulls → process → retry on failure) but with a plain in-memory
// array, so you can run it with zero dependencies and watch the mechanics.

interface Job<T> {
  id: number;
  payload: T;
  attempts: number; // how many times we have tried to process it
}

type Processor<T> = (payload: T) => Promise<void>;

class InMemoryQueue<T> {
  private readonly jobs: Job<T>[] = [];
  private nextId = 1;

  // Producer side: add work to the queue. Returns immediately (the HTTP handler would too).
  enqueue(payload: T): void {
    this.jobs.push({ id: this.nextId++, payload, attempts: 0 });
  }

  get size(): number {
    return this.jobs.length;
  }

  // Consumer side: process jobs one at a time until the queue is empty.
  // `maxAttempts` shows the retry pattern: transient failures are retried with backoff,
  // and a job that keeps failing is moved to a "dead letter" log instead of looping forever.
  async run(processor: Processor<T>, maxAttempts = 3): Promise<void> {
    while (this.jobs.length > 0) {
      const job = this.jobs.shift()!;
      job.attempts += 1;
      try {
        await processor(job.payload);
        console.log(`✅ job ${job.id} done (attempt ${job.attempts})`);
      } catch (err) {
        const reason = err instanceof Error ? err.message : String(err);
        if (job.attempts < maxAttempts) {
          console.log(`↻ job ${job.id} failed (${reason}); retrying`);
          this.jobs.push(job); // re-enqueue to try again
        } else {
          // Dead-letter: give up and record it for a human to inspect.
          console.log(`💀 job ${job.id} dead-lettered after ${job.attempts} attempts: ${reason}`);
        }
      }
    }
  }
}

// --- Demo ---------------------------------------------------------------------------------

interface EmailJob {
  to: string;
  subject: string;
}

const emailQueue = new InMemoryQueue<EmailJob>();

// A flaky worker: the address "flaky@example.com" fails twice before succeeding, to show
// retries; "broken@example.com" always fails, to show dead-lettering.
const failures = new Map<string, number>();
const sendEmail: Processor<EmailJob> = async (job) => {
  await new Promise((resolve) => setTimeout(resolve, 50)); // simulate I/O latency

  if (job.to === 'broken@example.com') {
    throw new Error('mailbox does not exist');
  }
  if (job.to === 'flaky@example.com') {
    const seen = (failures.get(job.to) ?? 0) + 1;
    failures.set(job.to, seen);
    if (seen <= 2) throw new Error('temporary SMTP error');
  }
  console.log(`   → sent "${job.subject}" to ${job.to}`);
};

async function main(): Promise<void> {
  emailQueue.enqueue({ to: 'alice@example.com', subject: 'Welcome!' });
  emailQueue.enqueue({ to: 'flaky@example.com', subject: 'Receipt' });
  emailQueue.enqueue({ to: 'broken@example.com', subject: 'Newsletter' });

  console.log(`Enqueued ${emailQueue.size} jobs; starting worker...\n`);
  await emailQueue.run(sendEmail);
  console.log('\nWorker idle. Queue is empty.');
}

void main();
