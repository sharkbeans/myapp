import { ofetch } from "ofetch";
import type {
  CosmoSearchResult,
  CosmoUserProfile,
  CosmoObjektResponse,
  ValidArtist,
} from "./types";

const COSMO_API = "https://api.cosmo.fans";

const cosmoFetch = ofetch.create({
  baseURL: COSMO_API,
  retry: 2,
  retryDelay: 500,
  timeout: 10000,
});

function getAuthHeaders() {
  const token = process.env.COSMO_ACCESS_TOKEN;
  if (!token) throw new Error("COSMO_ACCESS_TOKEN not configured");
  return { Authorization: `Bearer ${token}` };
}

export async function searchUsers(query: string): Promise<CosmoSearchResult> {
  return cosmoFetch("/bff/v3/users/search", {
    params: { query },
    headers: getAuthHeaders(),
  });
}

export async function fetchUserProfile(
  cosmoId: number,
  artistId: ValidArtist
): Promise<CosmoUserProfile> {
  return cosmoFetch(`/bff/v3/user/${cosmoId}/profile`, {
    params: { artistId },
    headers: getAuthHeaders(),
  });
}

export async function fetchUserObjekts(
  address: string,
  page = 1,
  size = 30
): Promise<CosmoObjektResponse> {
  return cosmoFetch("/bff/v3/objekt-summaries", {
    params: {
      address,
      page: String(page),
      size: String(size),
      order: "newest",
    },
    headers: getAuthHeaders(),
  });
}
