import styled from "@emotion/styled";
import { LoadingButton } from "@mui/lab";
import { Button, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
// import JSZip from "jszip";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDocFromId } from "./services/db/testSamples.service";

type Props = {};
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

const StemSeperation = (props: Props) => {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<Blob>();
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>();
  //   const [vocalsUrl, setVocalsUrl] = useState<string>();
  //   const [instrumentalUrl, setInstrumentalUrl] = useState<string>();
  const [loading, setLoading] = useState<boolean>();
  const [projectId, setProjectId] = useState<string>("");

  const onFilesUpload = async (e: any) => {
    const files = e.target.files;
    if (files.length === 0) {
      return;
    }
    const url = URL.createObjectURL(files[0]);
    setUploadedFileUrl(url);
    setUploadedFile(files[0]);
  };

  const onSubmit = async () => {
    if (!uploadedFile || !projectId) return;
    setLoading(true);
    await createDocFromId("projects", projectId, {
      id: projectId,
    });
    const formData = new FormData();
    formData.append("project_id", projectId);
    formData.append("file", uploadedFile);
    try {
      const res: any = await axios.post(
        `${import.meta.env.VITE_DEMUCS_SERVER}/two-stems`,
        // "http://localhost:8080/two-stems",
        formData
      );
      if (res.error) {
        alert(res.error);
      } else {
        alert("Successfully created");
        navigate("/numix");
      }

      //Fetch
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }

    // const zip = await JSZip.loadAsync(zipData);
    // Extract vocals.wav and instrumental.wav
    // const vocalsContent = await zip.file("vocals.wav")?.async("arraybuffer");
    // const instrumentalContent = await zip
    //   .file("instrumental.wav")
    //   ?.async("arraybuffer");
    // if (vocalsContent && instrumentalContent) {
    //   const vocalsBlob = new Blob([vocalsContent], { type: "audio/wav" });
    //   const instrumentalBlob = new Blob([instrumentalContent], {
    //     type: "audio/wav",
    //   });
    //   setVocalsUrl(URL.createObjectURL(vocalsBlob));
    //   setInstrumentalUrl(URL.createObjectURL(instrumentalBlob));
    // }
  };

  return (
    <Stack gap={2}>
      <Box display={"flex"} alignItems="center" gap={2}>
        <TextField
          color="info"
          size="small"
          label="Project Id"
          onChange={(e) => setProjectId(e.target.value)}
          value={projectId}
        />
        <Button component="label" variant="contained" onChange={onFilesUpload}>
          Upload Section
          <VisuallyHiddenInput type="file" />
        </Button>
        {uploadedFileUrl && (
          <audio controls>
            <source src={uploadedFileUrl} type="audio/wav"></source>
          </audio>
        )}
      </Box>
      <Box>
        <LoadingButton
          color="info"
          variant="outlined"
          onClick={onSubmit}
          loading={loading}
        >
          Submit
        </LoadingButton>
      </Box>
      {/* {vocalsUrl && instrumentalUrl && (
        <Box>
          <audio controls>
            <source src={vocalsUrl} type="audio/wav"></source>
          </audio>
          <audio controls>
            <source src={instrumentalUrl} type="audio/wav"></source>
          </audio>
        </Box>
      )} */}
    </Stack>
  );
};

export default StemSeperation;
