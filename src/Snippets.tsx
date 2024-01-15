import {
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Switch,
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
import RefreshRounded from "@mui/icons-material/RefreshRounded";
// import { client } from "@gradio/client";
// import io from "socket.io-client";

type Props = {};
const getColorsForGroup = (name: string) => {
  switch (name) {
    case "House":
    case "Ambient":
    case "Pluggnb":
      return "rgb(33, 206, 175)";
    case "The Raver":
    case "Mystical":
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
  "Mystical",
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

const getColorNameFromRgb = (rgb: string) => {
  switch (rgb) {
    case "rgb(33, 206, 175)": // Green
      return "green";
    case "rgb(58, 106, 231)": // Blue
      return "blue";
    case "rgb(255, 130, 14)": // Orange
      return "orange";
    default: //"rgb(208, 43, 250)": Pink
      return "pink";
  }
};
const Snippets = (props: Props) => {
  const [melody, setMelody] = useState<File>();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setMelody(file);
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
    sonify,
  } = useTonejs(
    () => {},
    () => {}
  );
  const [audioListObj, setAudioListObj] = useState<{
    [key: string]: SnippetProp;
  }>({});
  const audioListObjRef = useRef<any>({});

  const [newAudio, setNewAudio] = useState<string>();

  // const [loadingNo, setLoadingNo] = useState(-1);
  const [prevLoadingNo, setPrevLoadingNo] = useState(-1);
  const [playPosition, setPlayPosition] = useState<number>(-1);
  const [durationArr, setDurationArr] = useState<number[]>([
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ]);
  const [positionArr, setPositionArr] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);
  const [reorderArr, setReorderArr] = useState<number[]>(() =>
    [...positionArr].sort(() => Math.random() - 0.5)
  );

  const [loadingStatus, setLoadingStatus] = useState(false);
  const [hfStatus, setHfStatus] = useState<string>();
  const [machineType, setMachineType] = useState<string>("");

  const refreshHfStatus = async () => {
    setLoadingStatus(true);
    const res = await axios.get(
      "https://huggingface.co/api/spaces/nusic/MusicGen"
    );
    setHfStatus(res.data?.runtime?.stage);
    setMachineType(
      res.data?.runtime?.hardware?.current ||
        res.data?.runtime?.hardware?.requested
    );
    setLoadingStatus(false);
  };

  const generateBatchMusic = async (
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
    const url = URL.createObjectURL(new Blob([res.data]));
    return url;
    // -----------
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
    // const renderOrder = [...positionArr].sort(() => Math.random() - 0.5);

    // setLoadingNo(renderOrder[0]);
    const renderOrder = [...reorderArr];
    console.log(renderOrder);
    renderOrder.map((no, i) => {
      const prompt = genreNames[i];
      // new Promise((res) => setTimeout(res, (i + 1) * 1000))
      generateBatchMusic(prompt, durationArr[i].toString()).then((url) => {
        // const url = testUrls(no - 1);
        if (url) {
          console.log(`no inside: ${no}`);
          audioListObjRef.current = {
            ...audioListObjRef.current,
            [no.toString()]: {
              url,
              name: prompt,
              color: getColorsForGroup(prompt),
              duration: durationArr[i],
            },
          };
        } else {
          console.error("Unable to fetch URL: ", no);
        }
        setPrevLoadingNo(no);
        setNewAudio(no.toString());
        const nextAudioToLoadNo = renderOrder[renderOrder.indexOf(no) + 1];
        console.log("Next Loading: ", nextAudioToLoadNo);
        // setLoadingNo(nextAudioToLoadNo);
      });
    });
  };

  useEffect(() => {
    if (newAudio) {
      // const name = genreNames[prevLoadingNo];
      setAudioListObj({
        ...audioListObjRef.current,
      });
      setPlayPosition(prevLoadingNo);
      // setAudioList([...audioList, audio1]);
      // setPlayNo(1);
    }
  }, [newAudio]);

  useEffect(() => {
    refreshHfStatus();
  }, []);

  return (
    <Box height={"90vh"} width={{ xs: "100vw", md: "unset" }}>
      <Box
        display={"flex"}
        flexDirection="column"
        // justifyContent="center"
        alignItems={"center"}
        gap={2}
        width="100%"
        height={!melody ? "100%" : "30%"}
        sx={{ transition: "height 1s" }}
        // mt={2}
      >
        <Box display={"flex"} alignItems="center" gap={4}>
          <FormControl sx={{ width: "250px" }}>
            <InputLabel id="demo-simple-select-label">Machine Type</InputLabel>
            <Select
              label="Machine Type"
              value={machineType}
              onChange={(e) => setMachineType(e.target.value)}
            >
              <MenuItem value={"t4-small"}>t4-small ($0.6)</MenuItem>
              <MenuItem value={"t4-medium"}>t4-medium ($0.9)</MenuItem>
              <MenuItem value={"a10g-small"}>a10g-small ($1.5)</MenuItem>
              <MenuItem value={"a10g-large"}>a10g-large ($3.15)</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            color="warning"
            onClick={async () => {
              setLoadingStatus(true);
              const formData = new FormData();
              formData.append("hardware", machineType);
              await axios.post(
                `${import.meta.env.VITE_GPU_REMIX_SERVER}/upgrade-space`,
                formData
              );
              await refreshHfStatus();
              setLoadingStatus(false);
            }}
          >
            Upgrade
          </Button>
        </Box>
        <Box display={"flex"} alignItems="center">
          <FormControlLabel
            sx={{
              display: "block",
            }}
            control={
              <Switch
                disabled={loadingStatus || hfStatus === "BUILDING"}
                checked={hfStatus === "RUNNING" || hfStatus === "BUILDING"}
                onChange={async (e, checked) => {
                  if (hfStatus === "RUNNING") {
                    setLoadingStatus(true);
                    await axios.post(
                      `${import.meta.env.VITE_GPU_REMIX_SERVER}/pause-space`
                    );
                    await refreshHfStatus();
                    setLoadingStatus(false);
                  } else {
                    setLoadingStatus(true);
                    await axios.post(
                      `${import.meta.env.VITE_GPU_REMIX_SERVER}/start-space`
                    );
                    await refreshHfStatus();
                    setLoadingStatus(false);
                  }
                }}
                name="loading"
                color={
                  hfStatus === "RUNNING" || hfStatus === "BUILDING"
                    ? "error"
                    : "warning"
                }
              />
            }
            label="VM"
          />
          <Chip
            label={hfStatus || "--"}
            color={hfStatus === "RUNNING" ? "error" : "warning"}
            size="small"
          ></Chip>
          <IconButton onClick={refreshHfStatus}>
            <RefreshRounded fontSize="small" />
          </IconButton>
          <Button
            variant="outlined"
            size="small"
            color="info"
            onClick={() => {
              // await
              // sonify();
            }}
          >
            1st request
          </Button>
        </Box>
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
              {melody?.name}
            </Button>
          )}
          {melody && (
            <IconButton
              onClick={() => {
                if (melody) playAudio(URL.createObjectURL(melody), true);
              }}
            >
              <PlayArrowRoundedIcon />
            </IconButton>
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
              // if (snippet) {
              return (
                <Box
                  className="childComponent"
                  key={pos}
                  height={snippet ? "140px" : "24px"}
                  width={snippet ? "140px" : "24px"}
                  style={{
                    backgroundColor: snippet?.color ?? "unset",
                    transition: "0.2s ease",
                  }}
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
                  {snippet ? (
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
                  ) : (
                    <Skeleton
                      variant="circular"
                      width={"100%"}
                      height={"100%"}
                      animation="wave"
                    />
                  )}
                </Box>
              );
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
