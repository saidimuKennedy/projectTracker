
export async function logActivity(softwareId: string, actionType: "added" | "removed" | "updated", description?: string) {
  console.log(softwareId, actionType, description)
    try {
    const res = await fetch("/api/activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ softwareId, actionType, description }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Unknown error");
    }

    return data;
  } catch (error) {
    console.error("Client Error - logActivity:", error);
    throw error;
  }
}
