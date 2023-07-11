import {
  Button,
  CircularProgress,
  Fab,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { IZoraData } from "../../models/IZora";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { createUrlFromCid } from "../../utils/helper";

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
  return (
    <Box
      width={180}
      sx={{
        background: `url(${createUrlFromCid(nft.image?.url)})`,
        backgroundSize: "cover",
      }}
      borderRadius="15px"
    >
      <Stack
        width={180}
        height={180}
        justifyContent="end"
        alignItems={"center"}
        position="relative"
      >
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
