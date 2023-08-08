import {
  Button,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Popover,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { IZoraNftMetadata } from "../../models/IZora";
import { createUrlFromCid } from "../../utils/helper";
import {
  getNftMetadataByCollectionAddress,
  getNftMetadataByCollectionAddressAndTokenIds,
  // getNftMetadataByToken,
} from "../../utils/zora";
import axios from "axios";
import { useState } from "react";
import { useRef } from "react";
import { updateUserDoc } from "../../services/db/user.service";
import { ArtistReleases, ReleaseSoundXyz } from "../../models/IUser";

type Props = {
  addressProps: [string, (str: string) => void];
  tokenProps: [string, (str: string) => void];
  nftMetadata?: IZoraNftMetadata;
  onMetadatUpdate: (
    obj: IZoraNftMetadata,
    credits?: {
      account: string;
      percentAllocation: number;
    }[]
  ) => void;
  setIsStartListening: (isStartListening: boolean) => void;
  walletAddress: string;
  releases?: ArtistReleases;
};

const NftInfoModule = ({
  addressProps,
  nftMetadata,
  tokenProps,
  onMetadatUpdate,
  setIsStartListening,
  walletAddress,
  releases,
}: Props) => {
  const [nftAddress, setNftAddress] = addressProps;
  const [tokenId, setTokenId] = tokenProps;
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [nfts, setNfts] = useState<IZoraNftMetadata[]>();
  const onlyOnceRef = useRef(false);
  const [artistNftsError, setArtistNftsError] = useState<string>();
  const [fetchChainType, setFetchChainType] = useState(0);
  const [collectionsWithCredits, setCollectionsWithCredits] =
    useState<ReleaseSoundXyz[]>();
  const [artistReleasesLocal, setArtistReleaseseLocal] =
    useState<ArtistReleases>();
  const [loadingNftReleases, setLoadingNftReleases] = useState(false);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const fetchNftMetadata = async () => {
    if (nftAddress) {
      const chain = fetchChainType ? "eth" : "optimism";
      setLoadingNftReleases(true);
      const token = await getNftMetadataByCollectionAddress(nftAddress, chain);
      if (token) {
        if (collectionsWithCredits) {
          const index = collectionsWithCredits.findIndex(
            (c) =>
              c.collectionAddress.toLowerCase() ===
              token.collectionAddress.toLowerCase()
          );
          const creditsInfo = collectionsWithCredits[index].credits;
          onMetadatUpdate(token, creditsInfo);
        } else {
          onMetadatUpdate(token);
        }
      }
      setLoadingNftReleases(false);
    }
  };

  const fetchDeployedNftsFromWallet = async (_wallet: string) => {
    try {
      // CATALOG Collections
      // await fetchCatalogNfts(_wallet)

      // Firestore
      // let creditsCollections = await getArtistReleases(_wallet);
      setLoadingNftReleases(true);
      const chain = fetchChainType ? "eth" : "optimism";
      let _artistRelease = releases;
      if (!releases) {
        const res = await axios.get(
          `${import.meta.env.VITE_WALLET_NFT_SERVER}/${chain}/${_wallet}`
        );
        _artistRelease = res.data as ArtistReleases;
        setArtistReleaseseLocal(_artistRelease);
        updateUserDoc(_wallet, { releases: _artistRelease });
      }

      // setCollectionsWithCredits(creditsCollections);

      let _nftsMetadata = [];

      // Fetch SoundXYZ metadata
      if (_artistRelease?.soundCollections.length) {
        const addresses = _artistRelease?.soundCollections.map(
          (c) => c.collectionAddress
        );
        const tokensPromises = addresses.map((address) =>
          getNftMetadataByCollectionAddress(address, chain)
        );
        const responses = await Promise.all(tokensPromises);
        const nftsWithMetadta = responses.filter(
          (response) => !!response
        ) as IZoraNftMetadata[];
        _nftsMetadata.push(...nftsWithMetadta);
        // onMetadatUpdate(data);
      }
      // Catalog SoundXYZ metadata
      if (_artistRelease?.catalogCollections) {
        const { collectionAddress, tokenIds } =
          _artistRelease?.catalogCollections;
        const tokens = tokenIds.map((tokenId) => ({
          address: collectionAddress,
          tokenId,
        }));
        const nodesOrNull = await getNftMetadataByCollectionAddressAndTokenIds(
          tokens
        );
        if (nodesOrNull) {
          _nftsMetadata.push(...nodesOrNull);
        }
      }
      if (!_nftsMetadata.length) {
        setArtistNftsError(
          "No NFT releases found from this wallet on sound.xyz"
        );
      } else {
        setArtistNftsError(undefined);
      }
      setNfts(_nftsMetadata);
    } catch (e) {
      setArtistNftsError(
        "Failed to retrieve your NFT releases from sound.xyz, kindly try again later"
      );
    } finally {
      setLoadingNftReleases(false);
    }
  };
  // const fetchCatalogNfts = async (_walletAddress: string) => {
  //   const ownersJson = catalogJson as {
  //     [key: string]: { tokenIds: string[]; collectionAddress: string };
  //   };
  //   const ownerInfo = ownersJson[_walletAddress];
  //   if (!!ownerInfo) {
  //     const { collectionAddress, tokenIds } = ownerInfo;
  //     const tokens = tokenIds.map((tokenId) => ({
  //       address: collectionAddress,
  //       tokenId,
  //     }));
  //     const nodesOrNull = await getNftMetadataByCollectionAddressAndTokenIds(
  //       tokens
  //     );
  //     if (nodesOrNull) {
  //       const nftsWithMetadta = nodesOrNull.filter(
  //         (node) => !!node
  //       ) as IZoraNftMetadata[];
  //       // onMetadatUpdate(data);
  //       setNfts(nftsWithMetadta);
  //     }
  //   }
  // };

  useEffect(() => {
    fetchNftMetadata();
    if (nftAddress) {
      setIsStartListening(true);
    }
  }, [nftAddress, tokenId]);

  useEffect(() => {
    if (walletAddress && onlyOnceRef.current) {
      fetchDeployedNftsFromWallet(walletAddress);
    } else {
      onlyOnceRef.current = true;
    }
  }, [walletAddress, fetchChainType]);

  const open = Boolean(anchorEl);

  return (
    <Stack
      spacing={2}
      // direction="row"
      // justifyContent={"space-between"}
      // alignItems="center"
    >
      <Stack
        spacing={2}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6" fontFamily={"Roboto"}>
          Select a Music collection to edit{" "}
        </Typography>
        <Stack direction={"row"} spacing={2}>
          <FormControl color="info" size="small">
            <InputLabel id="demo-simple-select-label">Chain</InputLabel>
            <Select
              value={fetchChainType}
              label="Chain"
              onChange={(e) => setFetchChainType(Number(e.target.value))}
            >
              <MenuItem value={0}>Optimism</MenuItem>
              <MenuItem value={1}>Ethereum</MenuItem>
            </Select>
          </FormControl>
          {/* <Stack spacing={2}> */}
          {/* <Typography variant="body2" fontWeight={900}>
            Don't find your releases here? Provide the address
          </Typography> */}
          <TextField
            label="Enter NFT Address"
            size="small"
            color="info"
            value={nftAddress}
            // variant="outlined"
            onChange={(e) => {
              setNftAddress(e.target.value);
              setArtistNftsError(undefined);
            }}
            helperText="Don't find your releases?"
          />
        </Stack>
        {/* </Stack> */}
      </Stack>
      {loadingNftReleases && <LinearProgress />}
      <Stack
        direction={"row"}
        spacing={2}
        alignItems="center"
        // flexWrap={"wrap"}
        sx={{ overflowX: "auto" }}
      >
        {nftMetadata ? (
          <Stack direction={"row"} spacing={2}>
            <Box>
              <img
                src={createUrlFromCid(nftMetadata.image?.url)}
                alt=""
                width={100}
                style={{ borderRadius: "6px" }}
              />
            </Box>
            <Stack spacing={1} justifyContent="space-around">
              <Box>
                <Typography>{nftMetadata.collectionName}</Typography>
              </Box>
              <Box>
                <Button
                  onClick={handlePopoverOpen}
                  variant="outlined"
                  color="info"
                  size="small"
                >
                  View Metadata
                </Button>
                <Popover
                  id="mouse-over-popover"
                  // sx={{
                  //   pointerEvents: "none",
                  // }}
                  open={open}
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  // transformOrigin={{
                  //   vertical: "bottom",
                  //   horizontal: "center",
                  // }}
                  onClose={handlePopoverClose}
                >
                  <Box
                    width={600}
                    height={600}
                    sx={{ overflow: "auto" }}
                    m={2}
                    p={2}
                  >
                    <Typography component={"pre"} variant="caption">
                      {JSON.stringify(nftMetadata.metadata, undefined, 2)}
                    </Typography>
                  </Box>
                </Popover>
              </Box>
            </Stack>
          </Stack>
        ) : (
          nfts?.map((nft) => (
            <Stack
              key={nft.collectionAddress}
              spacing={1}
              mb={1}
              // sx={{ cursor: "pointer" }}
            >
              <Stack width={200} height={200} position="relative">
                <Box>
                  <img
                    src={createUrlFromCid(nft.image?.url)}
                    alt=""
                    width={"100%"}
                    style={{ borderRadius: "6px" }}
                  />
                </Box>
                <Box
                  mt={0}
                  position={"absolute"}
                  top={0}
                  left={0}
                  zIndex={9}
                  width="100%"
                  height={"100%"}
                  display="flex"
                  alignItems={"end"}
                  sx={{ background: "rgba(0,0,0,0.5)" }}
                >
                  <Typography align="center" fontWeight={"900"} width="100%">
                    {nft.name}
                  </Typography>
                </Box>
              </Stack>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  if (collectionsWithCredits) {
                    const index = collectionsWithCredits.findIndex(
                      (c) =>
                        c.collectionAddress.toLowerCase() ===
                        nft.collectionAddress.toLowerCase()
                    );
                    const creditsInfo = collectionsWithCredits[index].credits;
                    onMetadatUpdate(nft, creditsInfo);
                  } else {
                    onMetadatUpdate(nft);
                  }
                }}
              >
                Edit Metadata
              </Button>
            </Stack>
          ))
        )}
        {artistNftsError && (
          <Typography color={"error"}>{artistNftsError}</Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default NftInfoModule;
