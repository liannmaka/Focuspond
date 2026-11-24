/**
 * What to do when a write to IndexedDB fails.
 *
 * This matters more here than in most apps: FocusPond keeps everything on the
 * device and there is no server holding a second copy (docs/features/sync.md).
 * A failed write that nobody mentions does not degrade into a stale screen —
 * the UI goes on showing the result it assumed, and the work is simply gone at
 * the next reload, with no moment at which anyone was told.
 *
 * Storage really does refuse: a full disk or a tab over its origin quota
 * raises `QuotaExceededError`, a browser with site data blocked refuses to
 * open the database at all, and a transaction can abort under storage
 * pressure. None of these are exotic, and none of them throw anywhere a React
 * error boundary can see, because they happen inside a promise nobody awaited
 * for the purpose of rendering.
 *
 * The rule: **every write goes through `guardWrite`.** It never throws — a
 * failed delete should not take the screen down with it — and it never
 * swallows either: each failure is announced on the channel below, which the
 * app chrome turns into something the reader can read.
 */

/** What was being attempted, so the message can say which work is at risk. */
export type WriteOperation =
  | "task.add"
  | "task.update"
  | "task.delete"
  | "task.complete"
  | "task.frog"
  | "mood.add"
  | "session.start"
  | "session.end"
  | "reflection.save";

export type WriteFailure = {
  operation: WriteOperation;
  /** `true` when the device is out of room, which needs different advice. */
  outOfSpace: boolean;
  error: unknown;
};

type Listener = (failure: WriteFailure) => void;

const listeners = new Set<Listener>();

/**
 * Subscribes to write failures. Returns its own unsubscribe.
 *
 * A channel rather than a direct call to a toast library, so the database
 * layer stays free of UI: translations live in components, and a module that
 * writes rows has no business holding a message catalog.
 */
export function onWriteFailure(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Whether the browser is telling us it has run out of room.
 *
 * Checked by name rather than `instanceof DOMException`, because Dexie wraps
 * the original: the thrown object is a `Dexie.QuotaExceededError` whose `name`
 * is preserved, and an `instanceof` check against the DOM type misses it.
 */
function isQuotaError(error: unknown): boolean {
  const name =
    typeof error === "object" && error !== null && "name" in error
      ? String((error as { name: unknown }).name)
      : "";

  return name === "QuotaExceededError" || name.includes("Quota");
}

/**
 * Runs a write, reporting rather than throwing if it fails.
 *
 * Returns the write's value, or `undefined` when it failed — so a caller that
 * needs to know can check, and the many that do not are not forced to.
 */
export async function guardWrite<T>(
  operation: WriteOperation,
  run: () => Promise<T>
): Promise<T | undefined> {
  try {
    return await run();
  } catch (error) {
    const failure: WriteFailure = {
      operation,
      outOfSpace: isQuotaError(error),
      error,
    };

    for (const listener of listeners) listener(failure);

    // Still worth a console entry: the toast tells the reader what to do, and
    // this tells whoever is debugging what actually happened.
    console.error(`FocusPond: ${operation} failed`, error);

    return undefined;
  }
}
