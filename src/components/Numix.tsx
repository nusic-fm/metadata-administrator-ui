import styled from "@emotion/styled";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Chip,
  // Dialog,
  // DialogContent,
  // DialogTitle,
  // Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import axios from "axios";
// import JSZip from "jszip";

import { useEffect, useState } from "react";
import TestRemixesList from "./TestRemixesList";
import {
  // createDocId,
  createRemixDoc,
  // setDocById,
} from "../services/db/testSamples.service";
// import { uploadAudioFromFile } from "../services/storage/testSamples.service";
import { createFileFromUrl, getAudioDuration } from "../utils/helper";

type Props = { projectId: string };

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Numix = ({ projectId }: Props) => {
  const [duration, setDuration] = useState<number>();
  const [prompt, setPrompt] = useState<string>("BPM: , Time Signature: ");
  const [uploadedInstrumentFile, setUploadedInstrumentFile] = useState<File>();
  const [uploadedVocalsFile, setUploadedVocalsFile] = useState<File>();
  const [uploadedInstrumentUrl, setUploadedInstrumentUrl] = useState<string>(
    `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/test_remixer%2F${projectId}%2Finstrument.wav?alt=media`
  );
  const [uploadedVocalsUrl, setUploadedVocalsUrl] = useState<string>(
    `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/test_remixer%2F${projectId}%2Fvocals.wav?alt=media`
  );
  const [vmStatus, setVmStatus] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (uploadedInstrumentUrl) {
      (async () => {
        const duration = await getAudioDuration(uploadedInstrumentUrl);
        setDuration(parseFloat(duration.toFixed(3)));
        const insFile = await createFileFromUrl(
          "instrument.wav",
          uploadedInstrumentUrl
        );
        const vocalsFile = await createFileFromUrl(
          "vocals.wav",
          uploadedVocalsUrl
        );
        setUploadedInstrumentFile(insFile);
        setUploadedVocalsFile(vocalsFile);
      })();
    }
  }, [uploadedInstrumentUrl]);

  const onInstumentUpload = async (e: any) => {
    const files = e.target.files;
    if (files.length === 0) {
      return;
    }
    const url = URL.createObjectURL(files[0]);

    setUploadedInstrumentUrl(url);
    setUploadedInstrumentFile(files[0]);
  };
  const onVocalsUpload = async (e: any) => {
    const files = e.target.files;
    if (files.length === 0) {
      return;
    }
    const url = URL.createObjectURL(files[0]);
    setUploadedVocalsUrl(url);
    setUploadedVocalsFile(files[0]);
  };

  const onSubmit = async () => {
    if (!prompt || !uploadedInstrumentFile || !uploadedVocalsFile) {
      alert("Prompt or File missing");
      return;
    }
    setLoading(true);
    debugger;
    // const docId = createDocId();
    // if (true) {
    //   const formData = new FormData();
    //   formData.append("file", uploadedFile);
    //   const res = await axios.post(
    //     "https://demucs-ynfarb57wa-uc.a.run.app/two-stems",
    //     formData
    //   );
    //   const zipData = res.data;
    //   const zip = await JSZip.loadAsync(zipData);
    //   // Extract vocals.wav and instrumental.wav
    //   const vocalsContent = await zip.file("vocals.wav")?.async("arraybuffer");
    //   const instrumentalContent = await zip
    //     .file("instrumental.wav")
    //     ?.async("arraybuffer");
    //   if (vocalsContent && instrumentalContent) {
    //     await uploadAudioFromFile(docId, vocalsContent, "vocals.wav");
    //     await uploadAudioFromFile(
    //       docId,
    //       instrumentalContent,
    //       "intrumental.wav"
    //     );
    //   } else {
    //     alert("Stem is missing");
    //   }
    // }
    // ----
    // await uploadAudioFromFile(docId, uploadedInstrumentFile, "original.wav");
    const docId = await createRemixDoc({
      prompt,
      duration,
      project_id: projectId,
      remove: false,
      sycn_like: false,
      non_sycn_like: false,
      sync_dis_like: false,
      non_sync_dis_like: false,
    });
    // Start
    const formData = new FormData();
    formData.append("instrumental", uploadedInstrumentFile);
    formData.append("prompt", prompt);
    formData.append("vocals", uploadedVocalsFile);
    formData.append("project_id", docId);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_GPU_REMIX_SERVER}/remixer`,
        formData
      );
      if (res.data.error) {
        alert(res.data.error);
      } else {
        alert("Successfully created a remix");
      }
    } catch (e) {
      alert("Error");
    } finally {
      setLoading(false);
    }
  };

  const getVmStatus = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://compute.googleapis.com/compute/v1/projects/singular-carver-238608/zones/us-central1-a/instances/numix-pipeline-gpu",
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_GCP_ACCESS_TOKEN}`,
          },
        }
      );
      const status = res.data.status;
      setVmStatus(status);
      // if (status === "TERMINATED") {
      //   setVmOff(true);
      // } else {
      //   setVmOff(false);
      // }
    } catch (e) {
      setVmStatus("Error");
    } finally {
      setLoading(false);
    }
  };

  const switchVm = async (start?: boolean) => {
    setLoading(true);
    if (start) {
      const res = await axios.post(
        "https://compute.googleapis.com/compute/v1/projects/singular-carver-238608/zones/us-central1-a/instances/numix-pipeline-gpu/start",
        {},
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_GCP_ACCESS_TOKEN}`,
          },
        }
      );
      const status = res.data.status;
      setVmStatus(status);
    } else {
      const res = await axios.post(
        "https://compute.googleapis.com/compute/v1/projects/singular-carver-238608/zones/us-central1-a/instances/numix-pipeline-gpu/stop",
        {},
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_GCP_ACCESS_TOKEN}`,
          },
        }
      );
      const status = res.data.status;
      setVmStatus(status);
    }
    setLoading(false);
  };

  // useEffect(() => {
  //   // getVmStatus();
  // }, []);

  return (
    <Grid container px={2}>
      <Grid item xs={6}>
        <Stack alignItems={"start"} gap={2} width="100%">
          <Box display={"flex"} alignItems="center">
            <FormControlLabel
              sx={{
                display: "block",
              }}
              control={
                <Switch
                  disabled={loading}
                  checked={vmStatus === "RUNNING"}
                  onChange={() => {
                    if (vmStatus === "RUNNING") {
                      switchVm(false);
                    } else {
                      switchVm(true);
                    }
                  }}
                  name="loading"
                  color="primary"
                />
              }
              label="VM"
            />
            <Chip
              label={vmStatus || "--"}
              color={vmStatus === "RUNNING" ? "error" : "warning"}
              size="small"
            ></Chip>
            <IconButton onClick={getVmStatus}>
              <RefreshRounded fontSize="small" />
            </IconButton>
          </Box>
          <Box
            display={"flex"}
            gap={2}
            alignItems="center"
            width={"100%"}
            justifyContent={"space-between"}
          >
            <Button
              component="label"
              variant="contained"
              onChange={onInstumentUpload}
            >
              Upload Instrument Section
              <VisuallyHiddenInput type="file" />
            </Button>
            {uploadedInstrumentUrl && (
              <audio controls>
                (
                <source src={uploadedInstrumentUrl} type="audio/wav" />)
              </audio>
            )}
          </Box>
          <Box
            display={"flex"}
            gap={2}
            alignItems="center"
            width={"100%"}
            justifyContent={"space-between"}
          >
            <Button
              component="label"
              variant="contained"
              onChange={onVocalsUpload}
            >
              Upload Vocals Section
              <VisuallyHiddenInput type="file" />
            </Button>
            {uploadedVocalsUrl && (
              <audio controls>
                (
                <source src={uploadedVocalsUrl} type="audio/wav" />)
              </audio>
            )}
          </Box>
          <Box width={200} display="flex" gap={1} alignItems="center">
            <Typography>Duration</Typography>
            <TextField
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              type="number"
              size="small"
            />
          </Box>
          <Box width={"100%"}>
            <TextField
              label="Prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              multiline
              minRows={4}
              fullWidth
            />
          </Box>
          <Box display="flex" justifyContent="center">
            <LoadingButton
              loading={loading}
              variant="contained"
              onClick={onSubmit}
            >
              Submit
            </LoadingButton>
          </Box>
        </Stack>
      </Grid>
      {/* <Divider orientation="vertical" flexItem /> */}
      <Grid item xs={6}>
        <TestRemixesList projectId={projectId} />
      </Grid>
    </Grid>
  );
  // return (
  //   <Box>
  //     {trackId ? (
  //       <Box></Box>
  //     ) : (
  //       <Box
  //         m={4}
  //         height={200}
  //         width={200}
  //         display="flex"
  //         alignItems={"center"}
  //         justifyContent="center"
  //         border="0.5px solid #fff"
  //         borderRadius={8}
  //         onClick={() => setShowMyMusic(true)}
  //       >
  //         {/* <Stack alignItems={"center"} gap={2}>
  //       <AddIcon color="secondary" /> */}
  //         <Typography align="center">Create Project</Typography>
  //         {/* </Stack> */}
  //       </Box>
  //     )}
  //     <Dialog open={showMyMusic} onClose={() => setShowMyMusic(false)}>
  //       <DialogTitle>Choose your Music</DialogTitle>
  //       <DialogContent>
  //         <Box
  //           m={4}
  //           height={100}
  //           width={100}
  //           display="flex"
  //           alignItems={"center"}
  //           justifyContent="center"
  //           border="0.5px solid grey"
  //           borderRadius={4}
  //           onClick={() => setTrackId("something")}
  //         >
  //           {/* <Stack alignItems={"center"} gap={2}>
  //       <AddIcon color="secondary" /> */}
  //           <Typography align="center">Goddess</Typography>
  //           {/* </Stack> */}
  //         </Box>
  //       </DialogContent>
  //     </Dialog>
  //   </Box>
  // );
};

export default Numix;
