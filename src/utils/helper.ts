import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";

export const checkAndSwitchConnection = async () => {
  const provider = new Web3Provider((window as any).ethereum);
  const accounts = await provider.listAccounts();
  if (accounts.length) {
    if (
      (window as any).ethereum?.networkVersion !==
      import.meta.env.NEXT_PUBLIC_CHAIN_ID
    ) {
      try {
        await (window as any).ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: ethers.hexlify(
                ethers.toUtf8Bytes(
                  import.meta.env.NEXT_PUBLIC_CHAIN_ID as string
                )
              ),
            },
          ],
        });
      } catch (err) {}
    }
  }
};
export const createUrlFromCid = (tokenUri: string | null | undefined) => {
  if (!tokenUri) {
    return "";
  } else if (tokenUri.includes("https")) {
    return tokenUri;
  } else if (tokenUri.startsWith("ipfs")) {
    const cid = tokenUri.split("ipfs://")[1];
    return `https://ipfs.io/ipfs/${cid}`;
  } else if (tokenUri.startsWith("ar")) {
    const addressWithTokenId = tokenUri.split("ar://")[1];
    return `https://arweave.net/${addressWithTokenId}`;
  } else {
    return "";
  }
};
export const convertSecondsToHHMMSS = (totalSeconds: number) => {
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;

  var hhmmss = "";

  if (hours > 0) {
    hhmmss += hours + ":";
  }

  hhmmss += ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);

  return hhmmss;
};
