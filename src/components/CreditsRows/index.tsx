import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  Chip,
  Tooltip,
  ButtonGroup,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

type Props = { rowsObj: any; setCredits: (o: any) => void };

const CreditsRows = ({ rowsObj, setCredits }: Props) => {
  const keysLength = Object.keys(rowsObj).length;
  const onDelete = (key: string) => {
    const obj = { ...rowsObj };
    delete obj[key];
    const newObject = {} as any;
    Object.values(obj).map((value, i) => (newObject[i] = value));
    setCredits(newObject);
  };

  return (
    <>
      {Object.keys(rowsObj).map((key, i) => (
        <Grid container item spacing={2} key={key}>
          <Grid item xs={6} md={4}>
            <Box>
              <Typography>Credits (Optional)</Typography>
              <TextField
                fullWidth
                size="small"
                value={rowsObj[key].credits || ""}
                onChange={(e) => {
                  const obj = { ...rowsObj };
                  obj[key].credits = e.target.value;
                  setCredits(obj);
                }}
              ></TextField>
            </Box>
          </Grid>
          <Grid item xs={6} md={4}>
            <Box>
              <Typography>Role</Typography>
              <Autocomplete
                multiple
                fullWidth
                options={[
                  "Singer",
                  "Composer",
                  "Producer",
                  "Musician",
                  "Session Musician",
                  "Recording Engineer",
                  "Mix Engineer",
                  "Mastering Engineer",
                  "Assistant Engineer",
                ]}
                value={rowsObj[key].role || []}
                onChange={(e, values: string[]) => {
                  const obj = { ...rowsObj };
                  obj[key].role = values;
                  setCredits(obj);
                }}
                // defaultValue={[top100Films[13].title]}
                freeSolo
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      size="small"
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    placeholder="Press Enter to add"
                    {...params}
                    // variant="filled"
                    // label="freeSolo"
                    // placeholder="Favorites"
                  />
                )}
                size="small"
              />
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography>Other Info</Typography>
            <Tooltip title="Instrument Played">
              <TextField
                fullWidth
                size="small"
                value={rowsObj[key].otherInfo || ""}
                onChange={(e) => {
                  const obj = { ...rowsObj };
                  obj[key].otherInfo = e.target.value;
                  setCredits(obj);
                }}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={6} md={2}>
            <Box>
              <Typography>
                <br />
              </Typography>
              {keysLength - 1 === i ? (
                <ButtonGroup variant="outlined">
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      setCredits({
                        ...rowsObj,
                        [keysLength + 1]: {},
                      });
                    }}
                  >
                    Add New Credits
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
};

export default CreditsRows;
