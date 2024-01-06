import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Skeleton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTonejs } from "./hooks/useToneService";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseIcon from "@mui/icons-material/Pause";
import { LoadingButton } from "@mui/lab";
// import Bubbles from "./Bubbles";
import BubbleUI from "react-bubble-ui";
import "react-bubble-ui/dist/index.css";
import { useDropzone } from "react-dropzone";

type Props = {};
const getColorsForGroup = (name: string) => {
  switch (name) {
    case "House":
    case "Ambient":
    case "Pluggnb":
      return "rgb(33, 206, 175)";
    case "The Raver":
    case "Mystical Orient":
    case "The Chase":
      return "rgb(58, 106, 231)";
    case "The Rocker":
    case "Future Bass":
    case "Indian":
    case "African":
      return "rgb(255, 130, 14)";
    default:
      return "rgb(208, 43, 250)";
  }
};
const genreNames = [
  "House",
  "Mystical Orient",
  "The Raver",
  "Future Bass",
  "Pluggnb",
  "Dubstepper",
  "Ambient",
  "The Chase",
  "In Da Club",
  "The Rocker",
];
const Snippets = (props: Props) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    noClick: true,
  });

  const {
    initializeTone,
    playAudio,
    pausePlayer,
    isTonePlaying,
    switchLoop,
    playPlayer,
    stopPlayer,
  } = useTonejs(
    () => {},
    () => {}
  );
  const [audioListObj, setAudioListObj] = useState<{
    [key: string]: { url: string; name: string; color: string };
  }>({
    0: { url: "", name: "", color: "" },
    1: { url: "", name: "", color: "" },
    2: { url: "", name: "", color: "" },
    3: { url: "", name: "", color: "" },
    4: { url: "", name: "", color: "" },
    5: { url: "", name: "", color: "" },
    6: { url: "", name: "", color: "" },
    7: { url: "", name: "", color: "" },
    8: { url: "", name: "", color: "" },
    9: { url: "", name: "", color: "" },
  });
  const [newAudio, setNewAudio] = useState<string>();

  const [loadingNo, setLoadingNo] = useState(-1);
  const [prevLoadingNo, setPrevLoadingNo] = useState(-1);
  const [playNo, setPlayNo] = useState<string>("");
  const [showBtn, setShowBtn] = useState(true);

  useEffect(() => {
    if (newAudio) {
      const name = genreNames[prevLoadingNo];
      setAudioListObj({
        ...audioListObj,
        [prevLoadingNo]: {
          url: newAudio,
          name: name,
          color: getColorsForGroup(name),
        },
      });
      if (prevLoadingNo === 3) {
        setPlayNo("3");
      }
      // setAudioList([...audioList, audio1]);
      // setPlayNo(1);
    }
  }, [newAudio]);

  const fetchAudio = async (prompt: string, duration: string) => {
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("duration", duration);
    const res = await axios.post(
      "http://127.0.0.1:8081/create-snippet",
      formData
    );

    const url = URL.createObjectURL(res.data);
  };

  useEffect(() => {
    if (audioListObj[playNo]?.url) {
      playAudio(audioListObj[playNo].url, true);
    }
  }, [playNo]);

  const onFetchAudio = async () => {
    initializeTone();
    setLoadingNo(3);
    // await fetchAudio("House", "1");
    await new Promise((res) => setTimeout(res, 4000));
    setPrevLoadingNo(3);
    setNewAudio(
      "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/shorts%2F3.wav?alt=media&token=7a5b4809-eec5-4985-82bd-ec396903ec84"
    );
    setLoadingNo(1);
    // await fetchAudio("Rock", "2");
    await new Promise((res) => setTimeout(res, 4000));
    setPrevLoadingNo(1);
    setNewAudio(
      "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/shorts%2F1.wav?alt=media&token=7a5b4809-eec5-4985-82bd-ec396903ec84"
    );
    setLoadingNo(0);
    await new Promise((res) => setTimeout(res, 4000));
    setPrevLoadingNo(0);
    setNewAudio(
      "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/shorts%2F0.wav?alt=media&token=7a5b4809-eec5-4985-82bd-ec396903ec84"
    );
    setLoadingNo(2);
    // await fetchAudio("Trance", "2");
    await new Promise((res) => setTimeout(res, 4000));
    setPrevLoadingNo(2);
    setNewAudio(
      "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/shorts%2F2.wav?alt=media&token=7a5b4809-eec5-4985-82bd-ec396903ec84"
    );
    setLoadingNo(5);
    // await fetchAudio("Indian", "2");
    await new Promise((res) => setTimeout(res, 4000));
    setPrevLoadingNo(5);
    setNewAudio(
      "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/shorts%2F5.wav?alt=media&token=7a5b4809-eec5-4985-82bd-ec396903ec84"
    );
    setLoadingNo(8);
    // await fetchAudio("Americana", "3");
    await new Promise((res) => setTimeout(res, 4000));
    setPrevLoadingNo(8);
    setNewAudio(
      "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/shorts%2F8.wav?alt=media&token=7a5b4809-eec5-4985-82bd-ec396903ec84"
    );
    setLoadingNo(4);
    // await fetchAudio("Americana", "3");
    await new Promise((res) => setTimeout(res, 4000));
    setPrevLoadingNo(4);
    setNewAudio(
      "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/shorts%2F4.wav?alt=media&token=7a5b4809-eec5-4985-82bd-ec396903ec84"
    );
    setLoadingNo(7);
    // await fetchAudio("Americana", "3");
    await new Promise((res) => setTimeout(res, 4000));
    setPrevLoadingNo(7);
    setNewAudio(
      "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/shorts%2F7.wav?alt=media&token=7a5b4809-eec5-4985-82bd-ec396903ec84"
    );
    setLoadingNo(6);
    // await fetchAudio("Americana", "3");
    await new Promise((res) => setTimeout(res, 4000));
    setPrevLoadingNo(6);
    setNewAudio(
      "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/shorts%2F6.wav?alt=media&token=7a5b4809-eec5-4985-82bd-ec396903ec84"
    );
    setLoadingNo(9);
    // await fetchAudio("Americana", "3");
    await new Promise((res) => setTimeout(res, 4000));
    setPrevLoadingNo(9);
    setNewAudio(
      "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/shorts%2F9.wav?alt=media&token=7a5b4809-eec5-4985-82bd-ec396903ec84"
    );
    // setLoadingNo(9);
    // // await fetchAudio("Americana", "3");
    // await new Promise((res) => setTimeout(res, 4000));
    // setNewAudio(
    //   "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/test_snippets%2F2.3.wav?alt=media&token=883dd5e3-de2f-4cf3-bf14-8842cfd2a96c"
    // );
    // setLoadingNo(10);
    // // await fetchAudio("Americana", "3");
    // await new Promise((res) => setTimeout(res, 4000));
    // setNewAudio(
    //   "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/test_snippets%2F2.3.wav?alt=media&token=883dd5e3-de2f-4cf3-bf14-8842cfd2a96c"
    // );
    setLoadingNo(-1);
  };

  return (
    <Box height={"90vh"} width={{ xs: "100vw", md: "unset" }}>
      <Box
        display={"flex"}
        flexDirection="column"
        justifyContent="center"
        alignItems={"center"}
        gap={2}
        width="100%"
        height={showBtn ? "100%" : "10%"}
        sx={{ transition: "height 1s" }}
      >
        <Box
          border={"1px dashed grey"}
          p={4}
          borderRadius="8px"
          onClick={() => {
            setShowBtn(false);
            onFetchAudio();
          }}
          display="flex"
          justifyContent={"center"}
        >
          {showBtn ? (
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              <Typography>
                Drop your Favorite Music to start NUMIXing
              </Typography>
            </div>
          ) : (
            <Button
              onClick={() => {
                setShowBtn(false);
                onFetchAudio();
              }}
              disabled={!showBtn}
              color="secondary"
              // size="small"
              sx={{ width: 300, textTransform: "none" }}
              variant="contained"
            >
              weezer_buddy.wav
            </Button>
          )}
        </Box>
        {/* <TextField label="Prompt"></TextField> */}

        {!showBtn && (
          <Box display={"flex"}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => {
                      switchLoop();
                    }}
                  />
                }
                label="Loop"
              />
            </FormGroup>
          </Box>
        )}
      </Box>
      {!showBtn && (
        <Box mt={4} width="100%" display={"flex"} justifyContent="center">
          <BubbleUI
            options={{
              size: 140,
              minSize: 20,
              gutter: 40,
              provideProps: true,
              numCols: 4,
              fringeWidth: 160,
              yRadius: 130,
              xRadius: 220,
              cornerRadius: 50,
              showGuides: false,
              compact: true,
              gravitation: 5,
            }}
            className="myBubbleUI"
          >
            {Object.keys(audioListObj).map((key) => (
              <Box
                className="childComponent"
                key={key}
                style={{
                  backgroundColor: audioListObj[key].color,
                }}
              >
                <Box
                  position={"absolute"}
                  height="100%"
                  width={"100%"}
                  borderRadius="50%"
                  sx={{
                    animation:
                      playNo === key ? "waves 2s linear infinite" : "unset",
                    animationDelay: "1s",
                    background: audioListObj[key].color,
                    transition: "5s ease",
                  }}
                ></Box>

                {audioListObj[key].url ? (
                  <Button
                    color="secondary"
                    sx={{ height: "100%", width: "100%", borderRadius: "50%" }}
                    onClick={() => {
                      if (playNo === key) {
                        stopPlayer();
                        playPlayer();
                      } else setPlayNo(key);
                    }}
                  >
                    {audioListObj[key].name}
                    {isTonePlaying && playNo === key ? (
                      <PauseIcon />
                    ) : (
                      <PlayArrowRoundedIcon />
                    )}
                  </Button>
                ) : // <Box height={'100%'} width='100%' >
                //   <Typography>{audioListObj[key].name}</Typography>
                //   <Fab color="info" onClick={() => setPlayNo(key)}>

                //   </Fab>
                // </Box>
                loadingNo === parseInt(key) ? (
                  <Skeleton
                    variant="circular"
                    width={64}
                    height={64}
                    animation="wave"
                  />
                ) : (
                  <Typography>.</Typography>
                )}
              </Box>
            ))}
          </BubbleUI>
          {/* <Bubbles
          onPlay={() => {
            setPlayNo(Math.floor(Math.random() * 4) + 1);
          }}
          onFirstClick={onFetchAudio}
        /> */}
        </Box>
      )}
    </Box>
  );
};

export default Snippets;
