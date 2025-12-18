import { moodDB } from "@/lib/config/indexedDB";
import { supabase } from "@/lib/config/supabaseClient";

export async function syncMoodsToSupabase(userId: string) {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return { success: false, error: "offline" };
  }

  // Get all unsynced moods from IndexedDB
  const unsyncedMoods = await moodDB.getUnsynced();

  if (unsyncedMoods.length === 0) {
    return { success: true, synced: 0 };
  }

  // Prepare payload for Supabase
  const payload = unsyncedMoods.map((mood) => ({
    user_id: userId,
    client_id: mood.id,
    level: mood.level,
    label: mood.label,
    energy_level: mood.energyLevel,
    note: mood.note,
    created_at: mood.createdAt?.toISOString(),
  }));

  // Send to Supabase
  const { error } = await supabase.from("moods").upsert(payload, {
    onConflict: "user_id,client_id",
  });

  if (error) {
    console.error("Mood sync failed:", error);
    return { success: false, error };
  }

  // Mark moods as synced (with error handling)
  const results = await Promise.allSettled(
    unsyncedMoods.map((mood) =>
      mood.id ? moodDB.markAsSynced(mood.id) : Promise.resolve()
    )
  );

  // Optional: Log failures
  const failures = results.filter((r) => r.status === "rejected");
  if (failures.length > 0) {
    console.error("Failed to mark some moods as synced:", failures);
  }

  return {
    success: true,
    synced: unsyncedMoods.length - failures.length,
    failed: failures.length,
  };
}
