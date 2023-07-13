import { Button, Popover, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { IZoraNftMetadata } from "../../models/IZora";
import { createUrlFromCid } from "../../utils/helper";
import { getNftMetadataByToken } from "../../utils/zora";

type Props = {
  addressProps: [string, (str: string) => void];
  tokenProps: [string, (str: string) => void];
  nftMetadata?: IZoraNftMetadata;
  onMetadatUpdate: (obj: IZoraNftMetadata) => void;
};

const NftInfoModule = ({
  addressProps,
  nftMetadata,
  tokenProps,
  onMetadatUpdate,
}: Props) => {
  const [nftAddress, setNftAddress] = addressProps;
  const [tokenId, setTokenId] = tokenProps;
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const fetchNftMetadata = async () => {
    if (nftAddress && tokenId) {
      const token = await getNftMetadataByToken(nftAddress, tokenId);
      if (token) {
        onMetadatUpdate(token);
      }
    }
  };

  useEffect(() => {
    fetchNftMetadata();
  }, [nftAddress, tokenId]);

  const open = Boolean(anchorEl);

  return (
    <Stack spacing={2} direction="row">
      <Stack spacing={2} flexBasis="40%">
        <TextField
          fullWidth
          label="NFT Address"
          size="small"
          value={nftAddress}
          onChange={(e) => setNftAddress(e.target.value)}
        />
        <Box>
          <TextField
            label="TokenId"
            size="small"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
          />
        </Box>
      </Stack>
      {nftMetadata && (
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
            {/* <Box>
              <audio controls>
                <source
                  src={createUrlFromCid(nftMetadata.content.url)}
                  type="audio/mpeg"
                />
                Your browser does not support the audio tag.
              </audio>
            </Box> */}
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
      )}
    </Stack>
  );
};

export default NftInfoModule;
