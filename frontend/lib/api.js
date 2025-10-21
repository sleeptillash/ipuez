const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.5:5000";

export async function getSubjects(branch, sem) {
  const res = await fetch(
    `${API_URL}/subjects?branch=${encodeURIComponent(branch)}&semester=${encodeURIComponent(sem)}`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    return [];
  }
  return await res.json();
}
