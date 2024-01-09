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
import React, { useCallback, useEffect, useRef, useState } from "react";
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

const testUrls = (idx: number) =>
  `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/shorts%2F${idx}.wav?alt=media`;
type SnippetProp = {
  url: string;
  name: string;
  color: string;
  position: number;
  duration: number;
};
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
    [key: string]: SnippetProp;
  }>({});
  const audioListObjRef = useRef<any>({});

  const [newAudio, setNewAudio] = useState<string>();

  const [loadingNo, setLoadingNo] = useState(-1);
  const [prevLoadingNo, setPrevLoadingNo] = useState(-1);
  const [playPosition, setPlayPosition] = useState<number>(-1);
  const [durationArr, setDurationArr] = useState<number[]>([
    3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
  ]);
  const [positionArr, setPositionArr] = useState<number[]>([
    10, 8, 2, 5, 1, 6, 3, 7, 9, 4,
  ]);

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
      `${import.meta.env.VITE_GPU_REMIX_SERVER}/create-snippet`,
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
    const url = audioListObj[playPosition]?.url;
    if (url) {
      playAudio(url, true);
    }
  }, [playPosition]);

  useEffect(() => {
    if (melody) {
      onFetchAudio();
    }
  }, [melody]);

  const onFetchAudio = async () => {
    // .sort(() => Math.random() - 0.5)

    // const renderOrder = positionArr.sort(() => Math.random() - 0.5);
    // [1, 2, 3, 4, 5, 6, 7, 8, 9].sort();
    // positionArr.sort(() => Math.random() - 0.5);
    const renderOrder = [...positionArr].sort();

    setLoadingNo(renderOrder[0]);
    renderOrder.map(async (no, i) => {
      const prompt = genreNames[i];
      // new Promise((res) => setTimeout(res, (i + 1) * 1000))
      fetchAudio(prompt, durationArr[i].toString()).then((url) => {
        audioListObjRef.current = {
          ...audioListObjRef.current,
          [no.toString()]: {
            url,
            // : testUrls(no - 1),
            name: prompt,
            color: getColorsForGroup(prompt),
            duration: durationArr[i],
          },
        };
        setPrevLoadingNo(no);
        setNewAudio(
          url
          // no.toString()
          // "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/shorts%2F3.wav?alt=media&token=7a5b4809-eec5-4985-82bd-ec396903ec84"
        );
        setLoadingNo(renderOrder[renderOrder.indexOf(no) + 1]);
      });
      // fetchAudio(prompt, durationArr[i].toString()).then((url) => {
      //   audioListObjRef.current = {
      //     ...audioListObjRef.current,
      //     [no.toString()]: {
      //       url: newAudio,
      //       name: prompt,
      //       color: getColorsForGroup(prompt),
      //     },
      //   };
      // setPrevLoadingNo(3);

      // });
    });
  };

  useEffect(() => {
    if (newAudio) {
      // const name = genreNames[prevLoadingNo];
      setAudioListObj({
        ...audioListObjRef.current,
      });
      // setPlayPosition(prevLoadingNo);
      // setAudioList([...audioList, audio1]);
      // setPlayNo(1);
    }
  }, [newAudio]);
  console.log(loadingNo);

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
            {positionArr.map((pos) => {
              const snippet = audioListObj[pos];

              // if (loadingNo === pos) {
              //   return (
              //     <Box className="childComponent" key={pos}>
              //       <Skeleton
              //         variant="circular"
              //         width={64}
              //         height={64}
              //         animation="wave"
              //       />
              //     </Box>
              //   );
              // }
              if (snippet || loadingNo === pos) {
                return (
                  <Box
                    className="childComponent"
                    key={pos}
                    style={{
                      backgroundColor: snippet?.color ?? "unset",
                      transition: "0.2s ease",
                    }}
                    height={loadingNo === pos ? "64px" : "140px"}
                    width={loadingNo === pos ? "64px" : "140px"}
                  >
                    {snippet && playPosition === pos && (
                      <Box
                        position={"absolute"}
                        height="100%"
                        width={"100%"}
                        borderRadius="50%"
                        sx={{
                          animation: "waves 2s linear infinite",
                          animationDelay: "1s",
                          background: snippet.color,
                          transition: "5s ease",
                        }}
                      ></Box>
                    )}
                    {loadingNo === pos ? (
                      <Skeleton
                        variant="circular"
                        width={64}
                        height={64}
                        animation="wave"
                      />
                    ) : (
                      <Button
                        color="secondary"
                        sx={{
                          height: "100%",
                          width: "100%",
                          borderRadius: "50%",
                        }}
                        onClick={() => {
                          if (playPosition === pos) {
                            stopPlayer();
                            playPlayer();
                          } else setPlayPosition(pos);
                        }}
                      >
                        {snippet.name}
                        {isTonePlaying && playPosition === pos ? (
                          <PauseIcon />
                        ) : (
                          <PlayArrowRoundedIcon />
                        )}
                      </Button>
                    )}

                    {/* 
                    {snippet?.url ? (
                      
                    ) : // <Box height={'100%'} width='100%' >
                    //   <Typography>{audioListObj[key].name}</Typography>
                    //   <Fab color="info" onClick={() => setPlayPosition(key)}>

                    //   </Fab>
                    // </Box>
                    loadingNo === pos ? (
                      <Skeleton
                        variant="circular"
                        width={24}
                        height={24}
                        animation="wave"
                      />
                    ) : (
                      <Typography>.</Typography>
                    )} */}
                  </Box>
                );
              }

              // if (!snippet) {
              return (
                <Box className="childComponent" key={pos}>
                  <Skeleton
                    variant="circular"
                    width={24}
                    height={24}
                    animation="wave"
                  />
                </Box>
              );
              // }
            })}
          </BubbleUI>
          {/* <Bubbles
          onPlay={() => {
            setPlayPosition(Math.floor(Math.random() * 4) + 1);
          }}
          onFirstClick={onFetchAudio}
        /> */}
        </Box>
      )}
    </Box>
  );
};

export default Snippets;
