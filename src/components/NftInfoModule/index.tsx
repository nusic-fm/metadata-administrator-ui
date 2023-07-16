import {
  Button,
  FormControl,
  InputLabel,
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
  // getNftMetadataByToken,
} from "../../utils/zora";
import axios from "axios";
import { useState } from "react";
import { useRef } from "react";

type Props = {
  addressProps: [string, (str: string) => void];
  tokenProps: [string, (str: string) => void];
  nftMetadata?: IZoraNftMetadata;
  onMetadatUpdate: (obj: IZoraNftMetadata) => void;
  setIsStartListening: (isStartListening: boolean) => void;
  walletAddress: string;
};

const NftInfoModule = ({
  addressProps,
  nftMetadata,
  tokenProps,
  onMetadatUpdate,
  setIsStartListening,
  walletAddress,
}: Props) => {
  const [nftAddress, setNftAddress] = addressProps;
  const [tokenId, setTokenId] = tokenProps;
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [nfts, setNfts] = useState<IZoraNftMetadata[]>();
  const onlyOnceRef = useRef(false);
  const [artistNftsError, setArtistNftsError] = useState<string>();
  const [fetchChainType, setFetchChainType] = useState(0);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const fetchNftMetadata = async () => {
    if (nftAddress) {
      const token = await getNftMetadataByCollectionAddress(nftAddress);
      if (token) {
        onMetadatUpdate(token);
      }
    }
  };

  const fetchDeployedNftsFromWallet = async (_wallet: string) => {
    try {
      const chainEndpoint = fetchChainType ? "eth" : "optimism";
      const res = await axios.get(
        `${import.meta.env.VITE_WALLET_NFT_SERVER}/${chainEndpoint}/${_wallet}`
      );
      const collectionAddresses = res.data.collectionAddresses as string[];
      if (collectionAddresses.length === 0) {
        setArtistNftsError(
          "No NFT releases found from this wallet on sound.xyz"
        );
      }
      const tokensPromises = collectionAddresses.map((address) =>
        getNftMetadataByCollectionAddress(address)
      );
      const responses = await Promise.all(tokensPromises);
      const data = responses.filter(
        (response) => !!response
      ) as IZoraNftMetadata[];
      // onMetadatUpdate(data);
      setNfts(data);
    } catch (e) {
      setArtistNftsError(
        "Failed to retrieve your NFT releases from sound.xyz, kindly try again later"
      );
    }
  };

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
      direction="row"
      justifyContent={"space-between"}
      alignItems="center"
    >
      <Stack
        direction={"row"}
        spacing={2}
        alignItems="center"
        flexWrap={"wrap"}
      >
        <FormControl color="info" size="small">
          <InputLabel id="demo-simple-select-label">Chain</InputLabel>
          <Select
            value={0}
            label="Chain"
            onChange={(e) => setFetchChainType(Number(e.target.value))}
          >
            <MenuItem value={0}>Optimism</MenuItem>
            <MenuItem value={1}>Ethereum</MenuItem>
          </Select>
        </FormControl>
        {nftMetadata ? (
          <Stack direction={"row"} spacing={2}>
            <Box>
              <img
                src={createUrlFromCid(nftMetadata.image.url)}
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
              spacing={2}
              sx={{ cursor: "pointer" }}
              onClick={() => onMetadatUpdate(nft)}
            >
              <Box>
                <img
                  src={createUrlFromCid(nft.image.url)}
                  alt=""
                  width={150}
                  style={{ borderRadius: "6px" }}
                />
              </Box>
              <Typography align="center">{nft.collectionName}</Typography>
            </Stack>
          ))
        )}
        {artistNftsError && (
          <Typography color={"error"}>{artistNftsError}</Typography>
        )}
      </Stack>

      <Stack ml={4} spacing={2} justifyContent="center">
        <Typography variant="body2" fontWeight={900}>
          Don't find your collection here? Provide the address
        </Typography>
        <TextField
          fullWidth
          label="NFT Address"
          size="small"
          value={nftAddress}
          onChange={(e) => {
            setNftAddress(e.target.value);
            setArtistNftsError(undefined);
          }}
        />
      </Stack>
    </Stack>
  );
};

export default NftInfoModule;
