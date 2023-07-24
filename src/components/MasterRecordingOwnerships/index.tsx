import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  ButtonGroup,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import { MasterOwnershipObj } from "../ArtistMetadataTab";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type Props = { rowsObj: MasterOwnershipObj; setOwnerships: (o: any) => void };

const MasterRecordingOwnerships = ({ rowsObj, setOwnerships }: Props) => {
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
    <Accordion
      sx={{
        width: "100%",
        bgcolor: "customPaper.main",
      }}
      defaultExpanded
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          borderBottom: "2px solid",
          borderBottomColor: "customPaper.border",
        }}
      >
        <Typography variant="body1" fontWeight={700}>
          Master Recording Ownership
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {Object.keys(rowsObj).map((key, i) => (
          <Grid container item spacing={2} key={key}>
            <Grid item xs={6} md={4}>
              <Box>
                <Typography>Name</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={rowsObj[key].name}
                  onChange={(e) => {
                    const obj = { ...rowsObj };
                    obj[key].name = e.target.value;
                    setOwnerships(obj);
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={4} md={2}>
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
                  value={rowsObj[key].ownershipPercentage}
                  onChange={(e) => {
                    const obj = { ...rowsObj };
                    obj[key].ownershipPercentage = Number(e.target.value) || 0;
                    setOwnerships(obj);
                  }}
                ></TextField>
              </Box>
            </Grid>
            <Grid item xs={12} md={2} ml={{ md: "auto" }}>
              <Box>
                <Typography>
                  <br />
                </Typography>
                {keysLength - 1 === i ? (
                  <ButtonGroup variant="outlined">
                    <Button
                      variant="contained"
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
      </AccordionDetails>
    </Accordion>
  );
};

export default MasterRecordingOwnerships;
