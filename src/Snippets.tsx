import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useTonejs } from "./hooks/useToneService";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseIcon from "@mui/icons-material/Pause";
import { LoadingButton } from "@mui/lab";
// import Bubbles from "./Bubbles";
import BubbleUI from "react-bubble-ui";
import "react-bubble-ui/dist/index.css";
import { useDropzone } from "react-dropzone";
// import { client } from "@gradio/client";

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
  const [melody, setMelody] = useState<File>();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setMelody(acceptedFiles[0]);
  }, []);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: { "audio/mpeg": [".mp3"], "audio/wav": [".wav"] },
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
  const [durationArr, setDurationArr] = useState<number[]>([
    3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
  ]);

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
      setPlayNo(prevLoadingNo.toString());
      // setAudioList([...audioList, audio1]);
      // setPlayNo(1);
    }
  }, [newAudio]);

  const fetchAudio = async (
    prompt: string,
    duration: string
  ): Promise<string> => {
    if (!melody) {
      alert("melody missing");
      return "";
    }
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("duration", duration);
    formData.append("audio", melody);
    const res = await axios.post(
      // "http://127.0.0.1:8081/create-snippet",
      `${process.env.VITE_GPU_REMIX_SERVER}/create-snippet`,
      formData,
      { responseType: "blob" }
    );
    // const app = await client("nusic/MusicGen", {});
    // try {
    // const melodyBlob = await new Promise((res) => {
    //   const reader = new FileReader();
    //   reader.onload = function (event: any) {
    //     const blob = event.target.result;
    //     res(blob);
    //   };
    //   reader.readAsArrayBuffer(melody);
    // });
    // const response = await fetch(
    //   "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/shorts%2F2.wav?alt=media&token=d8da6d2a-65c1-4029-b9c9-a6ec3e760a2e"
    // );
    // const melodyBlob = await response.blob();
    // const result = await app.predict("/predict", [melodyBlob]);
    // const app_info = await app.view_api();

    // console.log(app_info);
    // const result = await app.predict(3, [
    //   "Howdy!", // string  in 'parameter_28' Dataset component
    // ]);
    // const submitData = app.submit(0, ["House", melody]);
    // await new Promise((res) =>
    //   submitData.on("data", async (event) => {
    //     if (event.data.length) {
    //       debugger;
    //       res("");
    //     }
    //     //     console.log("HF data processing");
    //   })
    // );
    // const result = await app.predict(3, [
    //   ["Howdy!"], // string  in 'parameter_28' Dataset component
    // ]);
    // debugger;
    // const result = await app.predict(1, [
    //   "melody",
    //   "House",
    //   melodyBlob,
    //   3,
    //   250,
    //   0,
    //   1,
    //   3,
    // ]);
    // const submitRes = await app.submit("/predict", [melody]);
    // await new Promise((res) =>
    //   submitRes.on("data", (data) => {
    //     debugger;
    //     res("");
    //   })
    // );
    // } catch (e) {
    //   debugger;
    // }
    const url = URL.createObjectURL(new Blob([res.data]));
    return url;
  };

  useEffect(() => {
    if (audioListObj[playNo]?.url) {
      playAudio(audioListObj[playNo].url, true);
    }
  }, [playNo]);

  useEffect(() => {
    if (melody) {
      onFetchAudio();
    }
  }, [melody]);

  const onFetchAudio = async () => {
    setLoadingNo(3);
    let url1 = await fetchAudio("House", durationArr[0].toString());
    // await new Promise((res) => setTimeout(res, 4000));
    setPrevLoadingNo(3);
    setNewAudio(
      url1
      // "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/shorts%2F3.wav?alt=media&token=7a5b4809-eec5-4985-82bd-ec396903ec84"
    );
    setLoadingNo(1);
    // await new Promise((res) => setTimeout(res, 4000));
    url1 = await fetchAudio("Dubstep", durationArr[1].toString());
    setPrevLoadingNo(1);
    setNewAudio(
      url1
      // "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/shorts%2F1.wav?alt=media&token=7a5b4809-eec5-4985-82bd-ec396903ec84"
    );
    setLoadingNo(0);
    // await new Promise((res) => setTimeout(res, 4000));
    url1 = await fetchAudio("Rock", durationArr[2].toString());
    setPrevLoadingNo(0);
    setNewAudio(
      url1
      // "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/shorts%2F0.wav?alt=media&token=7a5b4809-eec5-4985-82bd-ec396903ec84"
    );
    setLoadingNo(2);
    url1 = await fetchAudio("Trance", durationArr[3].toString());
    // await new Promise((res) => setTimeout(res, 4000));
    setPrevLoadingNo(2);
    setNewAudio(
      url1
      // "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/shorts%2F2.wav?alt=media&token=7a5b4809-eec5-4985-82bd-ec396903ec84"
    );
    setLoadingNo(5);
    url1 = await fetchAudio("Indian", durationArr[4].toString());
    // await new Promise((res) => setTimeout(res, 4000));
    setPrevLoadingNo(5);
    setNewAudio(
      url1
      // "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/shorts%2F5.wav?alt=media&token=7a5b4809-eec5-4985-82bd-ec396903ec84"
    );
    setLoadingNo(8);
    url1 = await fetchAudio("Americana", durationArr[5].toString());
    // await new Promise((res) => setTimeout(res, 4000));
    setPrevLoadingNo(8);
    setNewAudio(
      url1
      // "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/shorts%2F8.wav?alt=media&token=7a5b4809-eec5-4985-82bd-ec396903ec84"
    );
    setLoadingNo(4);
    url1 = await fetchAudio("Americana", durationArr[6].toString());
    // await new Promise((res) => setTimeout(res, 4000));
    setPrevLoadingNo(4);
    setNewAudio(
      url1
      // "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/shorts%2F4.wav?alt=media&token=7a5b4809-eec5-4985-82bd-ec396903ec84"
    );
    setLoadingNo(7);
    url1 = await fetchAudio("Americana", durationArr[7].toString());
    // await new Promise((res) => setTimeout(res, 4000));
    setPrevLoadingNo(7);
    setNewAudio(
      url1
      // "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/shorts%2F7.wav?alt=media&token=7a5b4809-eec5-4985-82bd-ec396903ec84"
    );
    setLoadingNo(6);
    url1 = await fetchAudio("Americana", durationArr[8].toString());
    // await new Promise((res) => setTimeout(res, 4000));
    setPrevLoadingNo(6);
    setNewAudio(
      url1
      // "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/shorts%2F6.wav?alt=media&token=7a5b4809-eec5-4985-82bd-ec396903ec84"
    );
    setLoadingNo(9);
    url1 = await fetchAudio("Americana", durationArr[9].toString());
    // await new Promise((res) => setTimeout(res, 4000));
    setPrevLoadingNo(9);
    setNewAudio(
      url1
      // "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/shorts%2F9.wav?alt=media&token=7a5b4809-eec5-4985-82bd-ec396903ec84"
    );

    // ---------------
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
    <Box height={"90vh"} width={{ xs: "100vw", md: "unset" }} pt={2}>
      <Box
        display={"flex"}
        flexDirection="column"
        justifyContent="center"
        alignItems={"center"}
        gap={2}
        width="100%"
        height={!melody ? "100%" : "10%"}
        sx={{ transition: "height 1s" }}
      >
        <Box display={"flex"} alignItems="center">
          <TextField
            disabled={!!melody}
            defaultValue={durationArr.join(",")}
            onChange={(e) =>
              setDurationArr(
                e.target.value
                  .split(",")
                  .map((x) => parseInt(x))
                  .filter((x) => !!x)
              )
            }
          />{" "}
          <Typography>({durationArr.length})</Typography>
        </Box>
        <Box
          border={"1px dashed grey"}
          borderRadius="8px"
          onClick={() => {
            initializeTone();
            // onFetchAudio();
          }}
          display="flex"
          justifyContent={"center"}
        >
          {!melody ? (
            <div
              {...getRootProps({ className: "dropzone" })}
              style={{ cursor: "default", padding: "24px" }}
            >
              <input {...getInputProps()} />
              <Typography>
                Drop your Favorite Music to start NUMIXing
              </Typography>
            </div>
          ) : (
            <Button
              disabled={!!melody}
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

        {melody && (
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
      {melody && (
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
