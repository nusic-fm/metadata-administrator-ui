import {
  CircularProgress,
  Divider,
  Fab,
  Grid,
  IconButton,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { IZoraData } from "../../models/IZora";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { createUrlFromCid } from "../../utils/helper";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useRef, useState } from "react";

type Props = {
  i: number;
  nft: IZoraData;
  togglePlayPause: () => void;
  setPlayIndex: (i: number) => void;
  loading: boolean;
  playIndex: number;
  playing: boolean;
};

const NftCard = ({
  i,
  nft,
  togglePlayPause,
  setPlayIndex,
  loading,
  playIndex,
  playing,
}: Props) => {
  const [showPopover, setShowPopover] = useState(false);

  const popoverAnchorEl = useRef(null);

  return (
    <Box
      // width={180}
      sx={{
        background: `url(${createUrlFromCid(nft.image?.url)})`,
        backgroundSize: "cover",
      }}
      borderRadius="15px"
      mb={1}
    >
      <Stack
        width={240}
        height={240}
        justifyContent="end"
        alignItems={"center"}
        position="relative"
        ref={popoverAnchorEl}
      >
        <Box position={"absolute"} top={0} right={0}>
          <IconButton size="small" onClick={() => setShowPopover(!showPopover)}>
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        {showPopover && (
          <Box
            position={"absolute"}
            top={0}
            borderRadius="6px"
            sx={{
              background:
                "linear-gradient(180deg, rgba(74, 74, 74, 0.85) 0%, rgba(39, 39, 39, 0.00) 100%)",
              backdropFilter: "blur(5.5px)",
            }}
            mx={2}
            mt={4}
            p={2}
          >
            <Grid container>
              <Grid item xs={12}>
                <Typography>Details</Typography>
              </Grid>
              <Grid item xs={12} my={0.5}>
                <Divider />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption">Address</Typography>
              </Grid>
              <Grid
                item
                xs={6}
                component={"a"}
                href={`https://etherscan.io/address/${nft.collectionAddress}`}
                target="_blank"
              >
                <Typography variant="caption">
                  {nft.collectionAddress.slice(0, 6)}...
                  {nft.collectionAddress.slice(
                    nft.collectionAddress.length - 4
                  )}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption">Token</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption">{nft.tokenId}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption">Format</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption">
                  {nft.content?.mimeType}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
        <Box
          display={"flex"}
          mb={0.5}
          p={0.2}
          px={1}
          sx={{ background: "rgba(0,0,0,0.2)", borderRadius: "6px" }}
          alignItems="center"
          justifyContent={"space-between"}
          gap={2}
          maxWidth="90%"
        >
          <Tooltip title={nft.collectionName}>
            <Typography
              variant="caption"
              noWrap
              fontWeight={900}
              width="80%"
              fontSize={"10px"}
            >
              {nft.collectionName}
            </Typography>
          </Tooltip>
          <Box>
            <Fab
              className="play"
              sx={{
                //   opacity: i === playIndex && playing ? 1 : 0,
                transition: "opacity 0.2s",
                maxWidth: 25,
                maxHeight: 25,
                minWidth: 25,
                minHeight: 25,
              }}
              // disabled={isPreviewLoading}
              // variant="outlined"
              color="primary"
              size="small"
              onClick={() => {
                if (i === playIndex) {
                  togglePlayPause();
                } else {
                  setPlayIndex(i);
                }
                //   if (nft.artworkUrl) {
                //     onInsert(nft);
                //   } else {
                //     onNftSelect(nft);
                //   }
              }}
            >
              {loading && playIndex === i ? (
                <CircularProgress color="secondary" size="15px" />
              ) : playing && playIndex === i ? (
                <PauseIcon sx={{ fontSize: "15px" }} />
              ) : (
                <PlayArrowIcon sx={{ fontSize: "15px" }} />
              )}
            </Fab>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default NftCard;
