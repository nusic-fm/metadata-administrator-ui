import { Button, Fab, Skeleton, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTonejs } from "./hooks/useToneService";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseIcon from "@mui/icons-material/Pause";
import { LoadingButton } from "@mui/lab";
import Bubbles from "./Bubbles";

type Props = {};

const Snippets = (props: Props) => {
  const { initializeTone, playAudio } = useTonejs(
    () => {},
    () => {}
  );
  const [audioList, setAudioList] = useState<string[]>([]);
  const [audio1, setAudio1] = useState<string>();
  const [audio2, setAudio2] = useState<string>();
  const [audio3, setAudio3] = useState<string>();
  const [audio4, setAudio4] = useState<string>();
  const [audio5, setAudio5] = useState<string>();

  const [loadingNo, setLoadingNo] = useState(-1);
  const [playNo, setPlayNo] = useState(0);

  useEffect(() => {
    if (audio1 && audioList.length === 0) {
      setAudioList([...audioList, audio1]);
      setPlayNo(1);
    }
    if (audio2 && audioList.length === 1) {
      setAudioList([...audioList, audio2]);
    }
    if (audio3 && audioList.length === 2) {
      setAudioList([...audioList, audio3]);
    }
    if (audio4 && audioList.length === 3) {
      setAudioList([...audioList, audio4]);
    }
    if (audio5 && audioList.length === 4) {
      setAudioList([...audioList, audio5]);
    }
  }, [audio1, audio2, audio3, audio4, audio5]);

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
    if (playNo && audioList[playNo - 1]) {
      playAudio(audioList[playNo - 1], true);
    }
  }, [playNo]);

  const onFetchAudio = async () => {
    initializeTone();
    setLoadingNo(1);
    // await fetchAudio("House", "1");
    await new Promise((res) => setTimeout(res, 4000));
    setAudio1(
      "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/test_snippets%2F2.wav?alt=media&token=883dd5e3-de2f-4cf3-bf14-8842cfd2a96c"
    );
    setLoadingNo(2);
    // await fetchAudio("Rock", "2");
    await new Promise((res) => setTimeout(res, 4000));
    setAudio2(
      "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/test_snippets%2F3.wav?alt=media&token=883dd5e3-de2f-4cf3-bf14-8842cfd2a96c"
    );
    setLoadingNo(3);
    // await fetchAudio("Trance", "2");
    await new Promise((res) => setTimeout(res, 4000));
    setAudio3(
      "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/test_snippets%2F2.2.wav?alt=media&token=883dd5e3-de2f-4cf3-bf14-8842cfd2a96c"
    );
    setLoadingNo(4);
    // await fetchAudio("Indian", "2");
    await new Promise((res) => setTimeout(res, 4000));
    setAudio4(
      "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/test_snippets%2F5.wav?alt=media&token=883dd5e3-de2f-4cf3-bf14-8842cfd2a96c"
    );
    setLoadingNo(5);
    // await fetchAudio("Americana", "3");
    await new Promise((res) => setTimeout(res, 4000));
    setAudio5(
      "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/test_snippets%2F2.3.wav?alt=media&token=883dd5e3-de2f-4cf3-bf14-8842cfd2a96c"
    );
    setLoadingNo(-1);
  };
  return (
    <Box height={"90vh"} width={{ xs: "100vw", md: "unset" }}>
      {/* <Box position={"absolute"} left={"40%"} top={"35%"}>
        {audio1 ? (
          <Fab color="info" onClick={() => setPlayNo(1)}>
            {playNo === 1 ? <PauseIcon /> : <PlayArrowRoundedIcon />}
          </Fab>
        ) : loadingNo === 1 ? (
          <Skeleton
            variant="circular"
            width={64}
            height={64}
            animation="wave"
          />
        ) : (
          <Box></Box>
        )}
      </Box>
      <Box position={"absolute"} left={"40%"} top={"65%"}>
        {audio2 ? (
          <Fab color="info" onClick={() => setPlayNo(2)}>
            {playNo === 2 ? <PauseIcon /> : <PlayArrowRoundedIcon />}
          </Fab>
        ) : loadingNo === 2 ? (
          <Skeleton
            variant="circular"
            width={64}
            height={64}
            animation="wave"
          />
        ) : (
          <Box></Box>
        )}
      </Box>
      <Box position={"absolute"} left={"60%"} top={"35%"}>
        {audio3 ? (
          <Fab color="info" onClick={() => setPlayNo(3)}>
            {playNo === 3 ? <PauseIcon /> : <PlayArrowRoundedIcon />}
          </Fab>
        ) : loadingNo === 3 ? (
          <Skeleton
            variant="circular"
            width={64}
            height={64}
            animation="wave"
          />
        ) : (
          <Box></Box>
        )}
      </Box>
      <Box position={"absolute"} left={"60%"} top={"65%"}>
        {audio4 ? (
          <Fab color="info" onClick={() => setPlayNo(4)}>
            {playNo === 4 ? <PauseIcon /> : <PlayArrowRoundedIcon />}
          </Fab>
        ) : loadingNo === 4 ? (
          <Skeleton
            variant="circular"
            width={64}
            height={64}
            animation="wave"
          />
        ) : (
          <Box></Box>
        )}
      </Box> */}
      <Box
        display={"flex"}
        justifyContent="center"
        alignItems={"center"}
        gap={2}
        width="100%"
      >
        <TextField label="Prompt"></TextField>
        <Button
          onClick={() => onFetchAudio()}
          color="secondary"
          size="small"
          variant="contained"
        >
          Make Music
        </Button>
      </Box>
      <Box mt={4} width="100%" display={"flex"} justifyContent="center">
        <Bubbles />
      </Box>
    </Box>
  );
};

export default Snippets;
