import {
  Grid,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
  Button,
  Checkbox,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  genrePrimaryOptions,
  genreSecondaryOptions,
  subGenreOptions,
  songMoodsOptions,
  musicKeys,
} from "../../utils";
import { Dayjs } from "dayjs";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export type SongMetadataObj = {
  title: string;
  album: string;
  projectType: string;
  genrePrimary: never[];
  genreSecondary: never[];
  subGenre: never[];
  songMoods: never[];
  songType: string;
  key: string;
  isrcCode: string;
  upcCode: string;
  recordLabel: string;
  distributor: string;
  dateCreated?: Dayjs;
  additionalCreationRow: boolean;
  lyrics: string;
  language: string;
  explicitLyrics: boolean;
  locationOfCreation: {
    [key: number]: {
      studioName?: string;
      city?: string;
      state?: string;
      country?: string;
    };
  };
  license?: "Creative Commons" | "All Rights Reserved";
};

type Props = {
  songMetadataObj: SongMetadataObj;
  setSongMetadataObj: (obj: SongMetadataObj) => void;
};

const SongMetadataTab = ({ songMetadataObj, setSongMetadataObj }: Props) => {
  const {
    additionalCreationRow,
    album,
    dateCreated,
    distributor,
    explicitLyrics,
    genrePrimary,
    genreSecondary,
    isrcCode,
    key,
    language,
    lyrics,
    projectType,
    recordLabel,
    songMoods,
    songType,
    subGenre,
    title,
    upcCode,
    locationOfCreation,
  } = songMetadataObj;

  const onPropertyChange = (key: string, value: any) => {
    setSongMetadataObj({ ...songMetadataObj, [key]: value });
  };

  return (
    <Grid container mt={4} spacing={2}>
      <Grid container item spacing={2}>
        <Grid item xs={8} md={4}>
          <Box>
            <Typography>Track Title</Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e: any) => onPropertyChange("title", e.target.value)}
              size="small"
            ></TextField>
          </Box>
        </Grid>
        <Grid item xs={4} md={2}>
          <Box>
            <Typography>Song Type</Typography>
            <Select
              fullWidth
              size="small"
              value={songType}
              onChange={(e) =>
                onPropertyChange("songType", e.target.value as string)
              }
            >
              <MenuItem value={"Original"}>Original</MenuItem>
              <MenuItem value={"Remix"}>Remix</MenuItem>
              <MenuItem value={"Accapella"}>Accapella</MenuItem>
              <MenuItem value="Acoustic">Acoustic</MenuItem>
              <MenuItem value="Cover">Cover</MenuItem>
              <MenuItem value="Live Recording">Live Recording</MenuItem>
              <MenuItem value="Instrumental">Instrumental</MenuItem>
            </Select>
          </Box>
        </Grid>
      </Grid>
      <Grid container item spacing={2}>
        <Grid item xs={8} md={4}>
          <Box>
            <Typography>Album Name</Typography>
            <TextField
              variant="outlined"
              value={album}
              onChange={(e: any) => onPropertyChange("album", e.target.value)}
              fullWidth
              size="small"
            ></TextField>
          </Box>
        </Grid>
        {/* <Grid item md={1}></Grid> */}
        <Grid item xs={4} md={2}>
          <Box>
            <Typography>Project Type</Typography>
            <Select
              value={projectType}
              onChange={(e: any) =>
                onPropertyChange("projectType", e.target.value)
              }
              // onChange={(e) => setProjectType(e.target.value as string)}
              fullWidth
              size="small"
            >
              <MenuItem value="SINGLE">SINGLE</MenuItem>
              <MenuItem value="EP">EP</MenuItem>
              <MenuItem value="ALBUM">ALBUM</MenuItem>
              <MenuItem value="COMPILATION">COMPILATION</MenuItem>
            </Select>
          </Box>
        </Grid>
      </Grid>
      <Grid container item spacing={2}>
        <Grid item xs={10} md={4}>
          <Box>
            <Typography>Main Genre (max 2)</Typography>
            <Autocomplete
              multiple
              options={genrePrimaryOptions}
              // defaultValue={[top100Films[13].title]}
              freeSolo
              value={genrePrimary}
              onChange={(e, values: string[]) => {
                if (values.length <= 2)
                  onPropertyChange("genrePrimary", values);
              }}
              // onChange={(e, values: string[]) => setGenrePrimary(values)}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip
                    variant="outlined"
                    size="small"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
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
        <Grid item xs={10} md={4}>
          <Box>
            <Typography>Secondary Genre (max 2)</Typography>
            <Autocomplete
              multiple
              options={genreSecondaryOptions}
              // defaultValue={[top100Films[13].title]}
              freeSolo
              value={genreSecondary}
              onChange={(e, values: string[]) => {
                if (values.length <= 2)
                  onPropertyChange("genreSecondary", values);
              }}
              // onChange={(e, values: string[]) => setGenreSecondary(values)}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip
                    variant="outlined"
                    size="small"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
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
        <Grid item xs={10} md={4}>
          <Box>
            <Typography>Sub Genre (max 2)</Typography>
            <Autocomplete
              multiple
              options={subGenreOptions}
              // defaultValue={[top100Films[13].title]}
              freeSolo
              value={subGenre}
              onChange={(e, values: string[]) => {
                if (values.length <= 2) onPropertyChange("subGenre", values);
              }}
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
      </Grid>
      <Grid container item spacing={2}>
        <Grid item xs={10} md={4}>
          <Box>
            <Typography>Song Key</Typography>
            <Select
              fullWidth
              variant="outlined"
              value={key}
              onChange={(e: any) => onPropertyChange("key", e.target.value)}
              size="small"
            >
              {musicKeys.map(({ key, id }) => {
                return (
                  <MenuItem value={id} key={id}>
                    {key.toUpperCase()}
                  </MenuItem>
                );
              })}
            </Select>
          </Box>
        </Grid>
        <Grid item xs={10} md={4}>
          <Box>
            <Typography>Song Mood (Up to 3 - Optional Field)</Typography>
            <Autocomplete
              multiple
              options={songMoodsOptions}
              // defaultValue={[top100Films[13].title]}
              freeSolo
              value={songMoods}
              onChange={(e, values: string[]) => {
                if (values.length <= 3) onPropertyChange("songMoods", values);
              }}
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
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    maxLength: 3,
                  }}

                  // variant="filled"
                  // label="freeSolo"
                  // placeholder="Favorites"
                />
              )}
              size="small"
            />
          </Box>
        </Grid>
        <Grid item xs={8} md={4}>
          <Box>
            <Typography>Language</Typography>
            <TextField
              fullWidth
              size="small"
              value={language}
              onChange={(e) => onPropertyChange("language", e.target.value)}
            ></TextField>
          </Box>
        </Grid>
      </Grid>
      <Grid container item spacing={2}>
        <Grid item xs={6} md={4}>
          <Box>
            <Typography>ISRC Code</Typography>
            <TextField
              fullWidth
              size="small"
              value={isrcCode}
              onChange={(e) => onPropertyChange("isrcCode", e.target.value)}
            ></TextField>
          </Box>
        </Grid>
        <Grid item xs={6} md={4}>
          <Box>
            <Typography>UPC Code</Typography>
            <TextField
              fullWidth
              size="small"
              value={upcCode}
              onChange={(e) => onPropertyChange("upcCode", e.target.value)}
            ></TextField>
          </Box>
        </Grid>
      </Grid>
      <Grid container item spacing={2}>
        <Grid item xs={10} md={4}>
          <Box>
            <Typography>Record Label</Typography>
            <TextField
              fullWidth
              size="small"
              value={recordLabel}
              onChange={(e) => onPropertyChange("recordLabel", e.target.value)}
            ></TextField>
          </Box>
        </Grid>
        <Grid item xs={10} md={4}>
          <Box>
            <Typography>Distributor</Typography>
            <TextField
              fullWidth
              size="small"
              value={distributor}
              onChange={(e) => onPropertyChange("distributor", e.target.value)}
            ></TextField>
          </Box>
        </Grid>
      </Grid>
      <Grid container item>
        <Grid item xs={10} md={4}>
          <Box>
            <Typography>License</Typography>
            <Select
              size="small"
              value={songMetadataObj.license}
              onChange={(e) => onPropertyChange("license", e.target.value)}
              defaultValue={"Creative Commons"}
            >
              <MenuItem value={"Creative Commons"}>Creative Commons </MenuItem>
              <MenuItem value={"All Rights Reserved"}>
                All Rights Reserved
              </MenuItem>
            </Select>
          </Box>
        </Grid>
      </Grid>
      <Grid item xs={10} md={4}>
        <Box>
          <Typography>Date Created</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={dateCreated}
              onChange={(value) => {
                onPropertyChange("dateCreated", value);
              }}
            />
          </LocalizationProvider>
        </Box>
      </Grid>
      <Grid item md={8}></Grid>

      <Grid item xs={12}>
        <Typography variant="body1" fontWeight={700}>
          Location of Creation (max 2)
        </Typography>
      </Grid>
      <Grid container item spacing={2}>
        <Grid item xs={10} md={4}>
          <Box>
            <Typography>Studio Name</Typography>
            <TextField
              fullWidth
              size="small"
              value={locationOfCreation[1].studioName}
              onChange={(e) => {
                const rowsObj = { ...locationOfCreation };
                rowsObj[1].studioName = e.target.value;
                setSongMetadataObj({
                  ...songMetadataObj,
                  locationOfCreation: rowsObj,
                });
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={10} md={2}>
          <Box>
            <Typography>City</Typography>
            <TextField
              fullWidth
              size="small"
              value={locationOfCreation[1].city}
              onChange={(e) => {
                const rowsObj = { ...locationOfCreation };
                rowsObj[1].city = e.target.value;
                setSongMetadataObj({
                  ...songMetadataObj,
                  locationOfCreation: rowsObj,
                });
              }}
            ></TextField>
          </Box>
        </Grid>
        <Grid item xs={6} md={2}>
          <Box>
            <Typography>State</Typography>
            <TextField
              fullWidth
              size="small"
              value={locationOfCreation[1].state}
              onChange={(e) => {
                const rowsObj = { ...locationOfCreation };
                rowsObj[1].state = e.target.value;
                setSongMetadataObj({
                  ...songMetadataObj,
                  locationOfCreation: rowsObj,
                });
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={6} md={2}>
          <Box>
            <Typography>Country</Typography>
            <TextField
              fullWidth
              size="small"
              value={locationOfCreation[1].country}
              onChange={(e) => {
                const rowsObj = { ...locationOfCreation };
                rowsObj[1].country = e.target.value;
                setSongMetadataObj({
                  ...songMetadataObj,
                  locationOfCreation: rowsObj,
                });
              }}
            ></TextField>
          </Box>
        </Grid>
        <Grid item xs={6} md={2}>
          <Box>
            <Typography>
              <br />
            </Typography>
            <Button
              variant="contained"
              disabled={additionalCreationRow}
              onClick={() => onPropertyChange("additionalCreationRow", true)}
              // sx={{ minWidth: "auto", whiteSpace: "nowrap" }}
            >
              Add New Location
            </Button>
          </Box>
        </Grid>
      </Grid>
      {additionalCreationRow && (
        <Grid container item spacing={2}>
          <Grid item xs={10} md={4}>
            <Box>
              <Typography>Studio Name</Typography>
              <TextField
                fullWidth
                size="small"
                value={locationOfCreation[2].studioName}
                onChange={(e) => {
                  const rowsObj = { ...locationOfCreation };
                  rowsObj[2].studioName = e.target.value;
                  setSongMetadataObj({
                    ...songMetadataObj,
                    locationOfCreation: rowsObj,
                  });
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={10} md={2}>
            <Box>
              <Typography>City</Typography>
              <TextField
                fullWidth
                size="small"
                value={locationOfCreation[2].city}
                onChange={(e) => {
                  const rowsObj = { ...locationOfCreation };
                  rowsObj[2].city = e.target.value;
                  setSongMetadataObj({
                    ...songMetadataObj,
                    locationOfCreation: rowsObj,
                  });
                }}
              ></TextField>
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Box>
              <Typography>State</Typography>
              <TextField
                fullWidth
                size="small"
                value={locationOfCreation[2].state}
                onChange={(e) => {
                  const rowsObj = { ...locationOfCreation };
                  rowsObj[2].state = e.target.value;
                  setSongMetadataObj({
                    ...songMetadataObj,
                    locationOfCreation: rowsObj,
                  });
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <Box>
              <Typography>Country</Typography>
              <TextField
                fullWidth
                size="small"
                value={locationOfCreation[2].country}
                onChange={(e) => {
                  const rowsObj = { ...locationOfCreation };
                  rowsObj[2].country = e.target.value;
                  setSongMetadataObj({
                    ...songMetadataObj,
                    locationOfCreation: rowsObj,
                  });
                }}
              ></TextField>
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Box>
              <Typography>
                <br />
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  const rowsObj = { ...locationOfCreation };
                  rowsObj[2] = {};
                  setSongMetadataObj({
                    ...songMetadataObj,
                    additionalCreationRow: false,
                    locationOfCreation: rowsObj,
                  });
                }}
              >
                <DeleteOutlineOutlinedIcon />
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
      <Grid item xs={12}>
        <Box>
          <Typography>Lyrics</Typography>
          <TextField
            multiline
            minRows={4}
            maxRows={10}
            fullWidth
            sx={{ mt: 0.5 }}
            value={lyrics}
            onChange={(e) => onPropertyChange("lyrics", e.target.value)}
          ></TextField>
        </Box>
      </Grid>
      <Grid item xs={2} md={2}>
        <Box>
          <Typography>Explicit Lyrics</Typography>
          <Checkbox
            checked={explicitLyrics}
            onChange={(e, checked) => {
              onPropertyChange("explicitLyrics", checked);
            }}
          ></Checkbox>
        </Box>
      </Grid>
      {/* <Grid item xs={10} md={4}>
                <Box>
                  <Typography>Encrypt Assets</Typography>
                  <Checkbox
                    value={isEncryptFiles}
                    onChange={(e) => setIsEncryptFiles(e.target.checked)}
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                  />
                </Box>
              </Grid> */}
    </Grid>
  );
};

export default SongMetadataTab;
