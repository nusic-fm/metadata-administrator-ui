/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { ArtistMetadataObj } from "../components/ArtistMetadataTab";
import { SongMetadataObj } from "../components/SongMetadataTab";

const useSaveChanges = (
  props: {
    nftAddress: string;
    tokenId: string;
    artistMetadataObj: ArtistMetadataObj;
    songMetadataObj: SongMetadataObj;
  },
  isStartListening: boolean,
  setIsLoading: (value: boolean) => void
) => {
  const { nftAddress, tokenId, artistMetadataObj, songMetadataObj } = props;

  useEffect(() => {
    if (isStartListening) {
      storeInLocalStorage();
    }
  }, [nftAddress, tokenId, artistMetadataObj, songMetadataObj]);

  const storeInLocalStorage = () => {
    setIsLoading(true);
    window.localStorage.setItem("nusic_props", JSON.stringify(props));
    setIsLoading(false);
  };

  const getFromLocalStorage = ():
    | undefined
    | {
        nftAddress: string;
        tokenId: string;
        artistMetadataObj: ArtistMetadataObj;
        songMetadataObj: SongMetadataObj;
      } => {
    const str = window.localStorage.getItem("nusic_props");
    if (str) {
      return JSON.parse(str);
    }
  };

  return { getFromLocalStorage };
};

export default useSaveChanges;
