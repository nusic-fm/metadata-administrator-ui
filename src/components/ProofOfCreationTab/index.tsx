import {
  Grid,
  Typography,
  Box,
  TextField,
  Skeleton,
  OutlinedInput,
  // InputAdornment,
  // IconButton,
  Tooltip,
  // Select,
  // MenuItem,
  // Autocomplete,
} from "@mui/material";
import MusicUploader from "../MusicUploader";
// import CachedIcon from "@mui/icons-material/Cached";
// import { useEffect } from "react";
// import axios from "axios";
// import { createUploadDoc } from "../../services/db/user.service";
// import { useWeb3React } from "@web3-react/core";

export type ProofOfCreationMetadataObj = {
  fullTrackFile?: File;
  fileUrl?: string;
  duration?: number;
  durationOfEachBarInSec?: number;
  startBeatOffsetMs: number;
  bpm?: number;
  timeSignature: string;
  noOfBeatsPerBar: number;
  noOfBars?: number;
  noOfBeats?: number;
};
type Props = {
  proofOfCreationMetadataObj: ProofOfCreationMetadataObj;
  setProofOfCreationMetadataObj: (obj: any) => void;
  onFetchStartBeatOffet: () => Promise<void>;
};

const ProofOfCreationTab = ({
  proofOfCreationMetadataObj,
  setProofOfCreationMetadataObj,
  onFetchStartBeatOffet,
}: Props) => {
  const {
    fullTrackFile,
    duration,
    startBeatOffsetMs,
    bpm,
    timeSignature,
    noOfBars,
    fileUrl,
  } = proofOfCreationMetadataObj;
  // const { account } = useWeb3React();

  const onPropertyChange = (key: string, value: any) => {
    setProofOfCreationMetadataObj({
      ...proofOfCreationMetadataObj,
      [key]: value,
    });
  };
  // TODO:
  // const getAnalysis = async () => {
  //   if (fileUrl && account) {
  //     const response = await fetch(fileUrl);
  //     const audioBlob = await response.blob();
  //     const formData = new FormData();
  //     formData.append("audio", audioBlob);

  //     const res = await axios.post("http://localhost:8000/upload", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  //     const id = res.data?.id;
  //     if (id) {
  //       await createUploadDoc(account, id);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   getAnalysis();
  // }, [fileUrl]);

  return (
    <Grid container mt={4} spacing={2}>
      {!fileUrl && (
        <Grid item xs={10} md={4}>
          <Typography>Audio</Typography>
          <MusicUploader
            fullTrackFile={fullTrackFile}
            onMultiplePropsChange={(obj: any) =>
              setProofOfCreationMetadataObj({
                ...proofOfCreationMetadataObj,
                ...obj,
              })
            }
          />
        </Grid>
      )}
      {/* <Grid item md={1} /> */}
      <Grid container item spacing={2}>
        <Grid item xs={10} md={4}>
          <Box>
            <Typography>
              Bpm{" "}
              <Typography component={"span"} color="error">
                *
              </Typography>
            </Typography>
            <TextField
              variant="outlined"
              type={"number"}
              value={bpm}
              onChange={(e: any) =>
                onPropertyChange("bpm", parseInt(e.target.value))
              }
              size="small"
              // fullWidth
            ></TextField>
          </Box>
        </Grid>
        <Grid item xs={10} md={4}>
          <Box>
            <Typography>
              Time Signature{" "}
              <Typography component={"span"} color="error">
                *
              </Typography>
            </Typography>
            {/* <Autocomplete
                freeSolo
                options={["2/4", "3/4", "4/4", "2/2", "6/8", "9/8", "12/8"]}
                value={timeSignature}
                onChange={(e: any, newValue) =>
                  onPropertyChange("timeSignature", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Press Enter to add"
                    // variant="filled"
                    // label="freeSolo"
                    // placeholder="Favorites"
                  />
                )}
                size="small"
                sx={{ width: { xs: "40%", md: "45%" } }}
              ></Autocomplete> */}
            <TextField
              required
              variant="outlined"
              value={timeSignature}
              onChange={(e: any) =>
                onPropertyChange("timeSignature", e.target.value)
              }
              size="small"
              // fullWidth
            ></TextField>
          </Box>
        </Grid>

        <Grid item xs={10} md={4}>
          <Box>
            <Typography>Start Beat offset(ms)</Typography>
            <OutlinedInput
              value={startBeatOffsetMs}
              onChange={(e) =>
                onPropertyChange(
                  "startBeatOffsetMs",
                  parseInt(e.target.value) || 0
                )
              }
              type="number"
              placeholder="Waveform Selection"
              size="small"
              // endAdornment={
              //   <Tooltip title="Fetch from the selected Position on the waveform">
              //     <InputAdornment position="end">
              //       <IconButton onClick={onFetchStartBeatOffet} edge="end">
              //         <CachedIcon />
              //       </IconButton>
              //     </InputAdornment>
              //   </Tooltip>
              // }
            />
          </Box>
        </Grid>
      </Grid>
      <Grid item xs={10} md={4}>
        <Box>
          <Typography>Duration</Typography>
          <Tooltip title="Automatically set from the Uploaded Track">
            {duration ? (
              <TextField
                variant="outlined"
                value={duration}
                size="small"
                disabled
              ></TextField>
            ) : (
              <Skeleton
                variant="text"
                width={"50%"}
                height="50px"
                animation={false}
              />
            )}
          </Tooltip>
        </Box>
      </Grid>
      <Grid item xs={10} md={3}>
        <Box>
          <Typography>No Of Measures</Typography>
          {noOfBars ? (
            <TextField
              variant="outlined"
              type="number"
              value={noOfBars}
              disabled
              size="small"
            ></TextField>
          ) : (
            <Skeleton
              variant="text"
              width={"50%"}
              height="50px"
              animation={false}
            />
          )}
          {/* <TextField
                    variant="outlined"
                    type="number"
                    value={noOfBars}
                    disabled
                  ></TextField> */}
        </Box>
      </Grid>
    </Grid>
  );
};

export default ProofOfCreationTab;
