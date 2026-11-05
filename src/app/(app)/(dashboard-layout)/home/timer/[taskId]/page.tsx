import FocusTimer from "@/features/pomodoro/components/FocusTimer";

/**
 * `/home/timer/[taskId]` — the focus screen.
 *
 * The segment is passed down as the string it is. Nothing can be resolved here:
 * tasks live in IndexedDB on the reader's device, so the server has no way to
 * know whether this id exists, and `notFound()` would be a guess. The client
 * decides, and says so calmly if the task is not there.
 *
 * `taskId` may be the literal `free` for a session tied to no task —
 * `pomodoroDB.start` already accepts an undefined task id.
 */
export default async function TimerPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;

  return <FocusTimer taskId={taskId} />;
}
