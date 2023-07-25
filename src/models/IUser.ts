export interface IUserDoc {
  id: string;
  email: string;
  name?: null | string;
  providerPhotoUrl?: null | string;
  phoneNumber?: null | string;
  profileComplete?: null | string;
  bio?: string;
  avatarUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  twitterUrl?: string;
  discordUrl?: string;
  spotifyUrl?: string;
  websiteUrl?: string;
}

export type IAliveUserDoc = {
  userName?: string;
  walletAddress: string;
  bio?: string;
  pfp?: string;
  artistContract?: string;
};

export type ReleaseSoundXyz = {
  credits: { account: string; percentAllocation: number }[];
  collectionAddress: string;
};
