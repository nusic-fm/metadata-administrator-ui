import { Web3Provider } from "@ethersproject/providers";
// import { ethers } from "ethers";
import JSZip from "jszip";

export const checkAndSwitchConnection = async () => {
  const provider = new Web3Provider((window as any).ethereum);
  const accounts = await provider.listAccounts();
  if (accounts.length) {
    if (
      (window as any).ethereum?.networkVersion !== import.meta.env.VITE_CHAIN_ID
    ) {
      try {
        await (window as any).ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: `0x13881`, //TODO
            },
          ],
        });
      } catch (err: any) {
        if (err.code === 4902) {
          try {
            await (window as any).ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x13881", //TODO
                  chainName: "Mumbai",
                  rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
                  nativeCurrency: {
                    name: "Mumbai Matic",
                    symbol: "MATIC",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
                },
              ],
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
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

export const fetchAndConvertToBlob = (url: string): Promise<File> => {
  return new Promise((res, rej) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => res(new File([blob], "music")));
  });
};

export const getAudioDuration = async (url: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.src = url;
    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration);
    });
    audio.addEventListener("error", () => {
      reject(0);
    });
  });
};

export const unzipAndProcess = async (zipData: any) => {
  const zip = await JSZip.loadAsync(zipData);

  // Extract files
  const vocals = await zip.file("vocals.wav")?.async("arraybuffer");
  const instrumental = await zip.file("instrumental.wav")?.async("arraybuffer");

  return [vocals, instrumental];
};
export const createFileFromUrl = async (name: string, url: string) => {
  let response = await fetch(url);
  let data = await response.blob();
  let metadata = {
    type: "image/jpeg",
  };
  return new File([data], name, metadata);
  // ... do something with the file or return it
};
