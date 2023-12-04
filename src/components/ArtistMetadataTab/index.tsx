import {
  Grid,
  Box,
  Typography,
  TextField,
  Autocomplete,
  Chip,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import CompositionOwnerships from "../CompositionOwnerships";
import CreditsRows, { CreditsRow } from "../CreditsRows";
import MasterRecordingOwnerships from "../MasterRecordingOwnerships";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export type MasterOwnershipObj = {
  [key: string]: {
    name?: string;
    ownershipPercentage?: number;
  };
};

export type CompositionOwnershipObj = {
  [key: string]: {
    name?: string;
    ipi?: string;
    pro?: string;
    ownershipPercentage?: number;
  };
};

export type ArtistMetadataObj = {
  artist: string;
  featuredArtists: string[];
  credits: {
    [key: number]: CreditsRow;
  };
  masterOwnerships: MasterOwnershipObj;
  compositionOwnerships: CompositionOwnershipObj;
};
type Props = {
  artistMetadataObj: ArtistMetadataObj;
  setArtistMetadataObj: (obj: any) => void;
};

const ArtistMetadataTab = ({
  artistMetadataObj,
  setArtistMetadataObj,
}: Props) => {
  const {
    artist,
    compositionOwnerships,
    credits,
    featuredArtists,
    masterOwnerships,
  } = artistMetadataObj;

  return (
    <Box>
      <Grid container mt={4} spacing={2}>
        <Grid container item xs={12}>
          <Accordion
            sx={{
              width: "100%",
              bgcolor: "customPaper.main",
            }}
            defaultExpanded
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body1" fontWeight={700}>
                Artist Information
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container item xs={12} spacing={2}>
                <Grid item xs={10} md={4}>
                  <Box>
                    <Typography variant="body1">Artist</Typography>
                    <TextField
                      variant="outlined"
                      value={artist}
                      onChange={(e) => {
                        //   setArtist(e.target.value);
                        setArtistMetadataObj({
                          ...artistMetadataObj,
                          artist: e.target.value,
                        });
                      }}
                      fullWidth
                      size="small"
                    ></TextField>
                  </Box>
                </Grid>
                <Grid item xs={10} md={8}>
                  <Box>
                    <Typography>Featured Artists</Typography>
                    <Autocomplete
                      fullWidth
                      multiple
                      options={[]}
                      value={featuredArtists}
                      onChange={(e, values: string[]) => {
                        //   setFeaturedArtists(values);
                        setArtistMetadataObj({
                          ...artistMetadataObj,
                          featuredArtists: values,
                        });
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
                          {...params}
                          placeholder="Press Enter to add"
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
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid container item xs={12}>
          <CreditsRows
            rowsObj={credits}
            setCredits={(_credits: any) => {
              setArtistMetadataObj({ ...artistMetadataObj, credits: _credits });
            }}
          />
        </Grid>
        <Grid container item xs={12}>
          <MasterRecordingOwnerships
            rowsObj={masterOwnerships}
            setOwnerships={(_masterOwnerships: any) => {
              setArtistMetadataObj({
                ...artistMetadataObj,
                masterOwnerships: _masterOwnerships,
              });
            }}
          />
        </Grid>
        <Grid container item xs={12}>
          <CompositionOwnerships
            rowsObj={compositionOwnerships}
            setOwnerships={(_compositionOwnerships: any) => {
              setArtistMetadataObj({
                ...artistMetadataObj,
                compositionOwnerships: _compositionOwnerships,
              });
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ArtistMetadataTab;
