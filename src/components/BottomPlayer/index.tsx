/* eslint-disable @next/next/no-img-element */
import VolumeDownRounded from "@mui/icons-material/VolumeDownRounded";
import VolumeUpRounded from "@mui/icons-material/VolumeUpRounded";
import FastRewindOutlined from "@mui/icons-material/FastRewindOutlined";
import PauseIcon from "@mui/icons-material/Pause";
import {
  Box,
  CircularProgress,
  Fab,
  IconButton,
  Slider,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import { useTheme } from "@mui/material/styles";
import SeekBar from "../Seekbar";
import { IZoraData } from "../../models/IZora";
import FastForwardOutlinedIcon from "@mui/icons-material/FastForwardOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { convertSecondsToHHMMSS, createUrlFromCid } from "../../utils/helper";
import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";
import RepeatOneRoundedIcon from "@mui/icons-material/RepeatOneRounded";

type Props = {
  songs: IZoraData[];
  songIndexProps: [number, (val: number) => void];
};

const Player = ({ songs, songIndexProps }: Props) => {
  const [songIndex, setSongIndex] = songIndexProps;
  const theme = useTheme();
  const [localPosition, setLocalPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const frameRef = useRef<NodeJS.Timer>();

  const {
    looping,
    loop,
    playing,
    togglePlayPause,
    volume,
    load,
    isReady,
    getPosition,
    duration,
    seek,
    setVolume,
    error,
  } = useGlobalAudioPlayer();
  // const { duration, seek, position } = useAudioPosition();

  useEffect(() => {
    const animate = () => {
      if (!isDragging) setLocalPosition(getPosition());
      // frameRef.current = requestAnimationFrame(animate);
    };

    // frameRef.current = window.requestAnimationFrame(animate);
    frameRef.current = setInterval(animate, 1000);

    return () => {
      if (frameRef.current) {
        clearInterval(frameRef.current);
        // cancelAnimationFrame(frameRef.current);
      }
    };
  }, [getPosition, localPosition, isDragging]);

  // useEffect(() => {
  //   if (!isDragging) setLocalPosition(getPosition());
  // }, [getPosition, isDragging]);

  const isMobile = useMediaQuery(() => theme.breakpoints.down("md"));

  useEffect(() => {
    // const src = `${import.meta.env.NEXT_PUBLIC_STREAMING}/stream/${songs[songIndex].tokenAddress}/${songs[songIndex].tokenId}`;
    if (songIndex !== -1) {
      const src = createUrlFromCid(songs[songIndex].content?.url);
      if (!src) return;

      load(src, {
        html5: true,
        autoplay: true,
        format: "mp3",
        onend: () => {
          if (songs.length - 1 !== songIndex) {
            setSongIndex(songIndex + 1);
          }
        },
      });
    }
    // onPlayIndexChange(songs[songIndex].idx);
  }, [songIndex]);

  // useEffect(() => {
  //   if (playing) onAudioPlay({ id: songs[songIndex].id });
  //   else onAudioPause();
  // }, [playing]);

  if (isMobile) {
    return (
      <Box
        border={"2px solid #212121"}
        borderRadius="8px"
        sx={{ bgcolor: "black" }}
        p={2}
        px={{ md: 6 }}
        display="flex"
        alignItems={"center"}
        gap={2}
        justifyContent="space-between"
      >
        <Box
          display="flex"
          alignItems={"center"}
          // width={{ xs: "75%", md: "60%" }}
          gap={2}
          width="60%"
        >
          <img
            src={createUrlFromCid(songs[songIndex].image?.url)}
            alt=""
            width={isMobile ? "40px" : "80px"}
            height={isMobile ? "40px" : "80px"}
            style={{ borderRadius: "10px" }}
          />
          <Box
            display="flex"
            justifyContent={"center"}
            flexDirection="column"
            // width={"calc(100% - 40px)"}
            width={"90%"}
          >
            <Typography
              noWrap
              fontSize={"italic"}
              fontWeight={900}
              // letterSpacing={1}
            >
              {songs[songIndex].name}
            </Typography>
          </Box>
        </Box>
        <Box display={"flex"} alignItems="center" gap={2}>
          <Fab
            size="small"
            color="primary"
            onClick={() => {
              togglePlayPause();
            }}
          >
            {!isReady ? (
              <CircularProgress color="secondary" size="15px" />
            ) : playing ? (
              <PauseIcon color="secondary" />
            ) : (
              <PlayArrowIcon color="secondary" />
            )}
          </Fab>
          <IconButton
            size="small"
            disabled={songIndex === songs.length - 1}
            onClick={() => setSongIndex(songIndex + 1)}
          >
            <FastForwardOutlinedIcon />
          </IconButton>
          {/* )} */}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      border={"2px solid #212121"}
      borderRadius="8px"
      sx={{ bgcolor: "black" }}
      p={2}
      px={{ md: 6 }}
      display="flex"
      alignItems={"center"}
      gap={2}
      justifyContent="space-between"
    >
      <Box
        display="flex"
        alignItems={"center"}
        // width={{ xs: "75%", md: "60%" }}
        gap={2}
        flexBasis="30%"
      >
        <img
          src={createUrlFromCid(songs[songIndex].image?.url)}
          alt=""
          width={"80px"}
          height="80px"
          style={{ borderRadius: "10px", border: "2px solid #A3A3A3" }}
        />
        <Box display="flex" justifyContent={"center"} flexDirection="column">
          <Typography
            noWrap
            fontSize={"italic"}
            fontWeight={900}
            letterSpacing={1}
            width="100%"
          >
            {songs[songIndex].name}
          </Typography>
        </Box>
      </Box>
      <Stack flexBasis={"40%"} alignItems="center">
        <SeekBar
          value={localPosition}
          max={duration}
          marks={[
            {
              value: 0,
              label: convertSecondsToHHMMSS(Math.floor(localPosition)),
            },
            {
              value: duration,
              label: convertSecondsToHHMMSS(Math.floor(duration)),
            },
          ]}
          onChange={(e, newPosition) => {
            setIsDragging(true);
            setLocalPosition(newPosition as number);
          }}
          onChangeCommitted={(e, val) => {
            setIsDragging(false);
            seek(val as number);
          }}
        />
        <Box display={"flex"} alignItems="center" gap={2}>
          <IconButton
            size="small"
            disabled={songIndex === 0}
            onClick={() => setSongIndex(songIndex - 1)}
          >
            <FastRewindOutlined />
          </IconButton>
          <Fab
            size="small"
            color="primary"
            onClick={() => {
              togglePlayPause();
            }}
          >
            {isReady === false ? (
              <CircularProgress color="secondary" size="15px" />
            ) : playing ? (
              <PauseIcon color="secondary" />
            ) : (
              <PlayArrowIcon color="secondary" />
            )}
          </Fab>
          <IconButton
            size="small"
            disabled={songIndex === songs.length - 1}
            onClick={() => setSongIndex(songIndex + 1)}
          >
            <FastForwardOutlinedIcon />
          </IconButton>
        </Box>
      </Stack>
      <Box display={"flex"} alignItems="center" gap={2} flexBasis={"20%"}>
        <Box sx={{ bgcolor: "#262626" }} borderRadius={"10px"}>
          <IconButton
            onClick={() => loop(!looping)}
            sx={{ borderRadius: "10px" }}
            size="small"
          >
            {looping ? (
              <RepeatOneRoundedIcon sx={{ opacity: "0.8" }} fontSize="small" />
            ) : (
              <RepeatRoundedIcon sx={{ opacity: "0.8" }} fontSize="small" />
            )}
          </IconButton>
        </Box>
        <Stack spacing={2} direction="row" alignItems="center">
          <VolumeDownRounded htmlColor={"rgba(255,255,255,0.4)"} />
          <Slider
            aria-label="Volume"
            min={0}
            defaultValue={1}
            step={0.01}
            max={1}
            // value={volume()}
            onChange={(e, newVal) => setVolume(newVal as number)}
            sx={{
              opacity: "0.7",
              width: "100px",
              color:
                theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.87)",
              "& .MuiSlider-track": {
                border: "none",
              },
              "& .MuiSlider-thumb": {
                width: 12,
                height: 12,
                backgroundColor: "#fff",
                "&:before": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
                },
                "&:hover, &.Mui-focusVisible, &.Mui-active": {
                  boxShadow: "none",
                },
              },
            }}
          />
          <VolumeUpRounded htmlColor={"rgba(255,255,255,0.4)"} />
        </Stack>
      </Box>
    </Box>
  );
};

export default Player;
