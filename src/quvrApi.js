const BASE_URL = process.env.QUVR_BASE_URL || "https://quvr.site";

async function getJson(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`QUVR API ${path} returned HTTP ${res.status}`);
  }
  return res.json();
}

export async function getTicker() {
  return getJson("/api/ticker");
}

export async function searchTokens(query = "") {
  const qs = query ? `?q=${encodeURIComponent(query)}` : "";
  return getJson(`/api/tokens${qs}`);
}

export async function listChains() {
  return getJson("/api/chains");
}
