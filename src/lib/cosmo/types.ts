export type ValidArtist = "artms" | "tripleS" | "idntt";

export interface CosmoPublicUser {
  id: number;
  nickname: string;
  address: string;
  profileImageUrl?: string;
}

export interface CosmoSearchResult {
  results: CosmoPublicUser[];
}

export interface CosmoUserProfile {
  nickname: string;
  address: string;
  profileImageUrl?: string;
  statusMessage?: string;
}

export interface CosmoObjekt {
  collectionId: string;
  season: string;
  member: string;
  collectionNo: string;
  class: string;
  artists: ValidArtist[];
  thumbnailImage: string;
  frontImage: string;
  backImage: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  comoAmount: number;
  transferablebyDefault: boolean;
  tokenId: string;
  tokenAddress: string;
  objektNo: number;
  transferable: boolean;
  status: "minted" | "pending";
  nonTransferableReason?: string;
}

export interface CosmoObjektResponse {
  objekts: CosmoObjekt[];
  hasNext: boolean;
  total: number;
}
