import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  ButtonGroup,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { CompositionOwnershipObj } from "../ArtistMetadataTab";

type Props = {
  rowsObj: CompositionOwnershipObj;
  setOwnerships: (o: any) => void;
};

function CompositionOwnerships({ rowsObj, setOwnerships }: Props) {
  const keysLength = Object.keys(rowsObj).length;
  const totalOwnership = Object.values(rowsObj)
    .map((r) => r.ownershipPercentage)
    .reduce((a, b) => (a || 0) + (b || 0));

  const onDelete = (key: string) => {
    const obj = { ...rowsObj };
    delete obj[key];
    const newObject = {} as any;
    Object.values(obj).map((value, i) => (newObject[i] = value));
    setOwnerships(newObject);
  };

  return (
    <>
      {Object.keys(rowsObj).map((key, i) => (
        <Grid container item key={key} spacing={2}>
          <Grid item xs={6} md={4}>
            <Box>
              <Typography>Name</Typography>
              <TextField
                fullWidth
                size="small"
                value={rowsObj[key].name || ""}
                onChange={(e) => {
                  const obj = { ...rowsObj };
                  obj[key].name = e.target.value;
                  setOwnerships(obj);
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Box>
              <Typography>IPI</Typography>
              <TextField
                size="small"
                value={rowsObj[key].ipi || ""}
                onChange={(e) => {
                  const obj = { ...rowsObj };
                  obj[key].ipi = e.target.value;
                  setOwnerships(obj);
                }}
                fullWidth
              ></TextField>
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Box>
              <Typography>PRO</Typography>
              <Select
                size="small"
                value={rowsObj[key].pro || ""}
                fullWidth
                onChange={(e) => {
                  const obj = { ...rowsObj };
                  obj[key].pro = e.target.value;
                  setOwnerships(obj);
                }}
              >
                {[
                  "ASCAP",
                  "BMI",
                  "SESAC",
                  "GMR",
                  "SoundExchange",
                  "PRS for Music",
                  "PPL",
                  "MCPS",
                  "SACEM",
                  "SABAM",
                  "GEMA",
                  "SUISA",
                  "STIM",
                  "SACM",
                  "APRA",
                  "AMCOS",
                  "JASRAC",
                  "KOMCA",
                  "CASH",
                  "COMPASS",
                  "AKM",
                  "ZAIKOS",
                  "BUMA",
                  "SIAE",
                  "SPA",
                  "SACD",
                  "SGAE",
                  "SAYCO",
                  "ACAM",
                  "ACAM-DRM",
                  "ACINPRO",
                  "SAYCE",
                  "AIE",
                  "SAYCE/ACINPO",
                  "SOKOJ",
                  "BUMA/STEMRA",
                  "KODA",
                  "TEOSTO",
                  "SPADEM",
                  "BPRS",
                  "HDS",
                  "OSA",
                  "ZAIKOS-Autorzy",
                  "ZAIKOS-PRO",
                  "UCMR-ADA",
                  "AKKA/LAA",
                  "SOKAN",
                  "COTT",
                  "APDAYC",
                  "AGADU",
                  "SADAIC",
                  "SCD",
                  "ACEMLA",
                ].map((p) => (
                  <MenuItem value={p} key={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Box>
              <Typography noWrap>% of ownership</Typography>
              <TextField
                fullWidth
                error={(totalOwnership || 0) > 100}
                helperText={
                  !!totalOwnership &&
                  i === keysLength - 1 &&
                  `Total: ${totalOwnership || 0}%`
                }
                size="small"
                type={"number"}
                value={rowsObj[key].ownershipPercentage || ""}
                onChange={(e) => {
                  const obj = { ...rowsObj };
                  obj[key].ownershipPercentage = Number(e.target.value) || 0;
                  setOwnerships(obj);
                }}
              ></TextField>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box>
              <Typography>
                <br />
              </Typography>
              {keysLength - 1 === i ? (
                <ButtonGroup variant="outlined">
                  <Button
                    variant="contained"
                    disabled={keysLength === 8}
                    onClick={() => {
                      setOwnerships({
                        ...rowsObj,
                        [keysLength + 1]: {},
                      });
                    }}
                  >
                    Add New Owner
                  </Button>
                  {keysLength > 1 && (
                    <Button onClick={() => onDelete(key)}>
                      <DeleteOutlineOutlinedIcon />
                    </Button>
                  )}
                </ButtonGroup>
              ) : (
                <Button variant="outlined" onClick={() => onDelete(key)}>
                  <DeleteOutlineOutlinedIcon />
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      ))}
    </>
  );
}

export default CompositionOwnerships;
