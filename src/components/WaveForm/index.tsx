import { SectionsObj } from "../../Metadata";
import { ProofOfCreationMetadataObj } from "../ProofOfCreationTab";
import Timeline from "wavesurfer.js/dist/plugins/timeline.js";
import Regions, { RegionParams } from "wavesurfer.js/dist/plugins/regions.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { useWavesurfer } from "../../hooks/useWavesurfer";
import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Card,
  FormControlLabel,
  IconButton,
  Skeleton,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import ZoomOut from "@mui/icons-material/ZoomOut";
import ZoomIn from "@mui/icons-material/ZoomIn";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { WaveSurferOptions } from "wavesurfer.js";
import { convertSecondsToHHMMSS } from "../../utils/helper";

const SectionNames = [
  "Intro",
  "Verse",
  "Pre-Chorus",
  "Chorus",
  "Post-Chorus",
  "Breakdown",
  "Bridge",
  "Hook",
  "Outro",
];

type Props = {
  proofOfCreationMetadataObj: ProofOfCreationMetadataObj;
  sectionsObj: SectionsObj;
  setSectionsObj: React.Dispatch<React.SetStateAction<SectionsObj>>;
  onDurationUpdate: (duration: number) => void;
};

const WaveSurferPlayer = ({
  proofOfCreationMetadataObj,
  sectionsObj,
  setSectionsObj,
  onDurationUpdate,
}: Props) => {
  const { fileUrl, durationOfEachBarInSec, noOfBars, startBeatOffsetMs, bpm } =
    proofOfCreationMetadataObj;

  const containerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bars, setBars] = useState<{
    [key: string]: { start: number; end: number };
  }>({});
  const [currentTime, setCurrentTime] = useState(0);
  const timelineOptions = useRef({
    height: 15,
    timeInterval: 0.2,
    primaryLabelInterval: 1,
    style: {
      fontSize: "10px",
      color: "#fff",
    },
  });
  const timelineWs = useRef(Timeline.create(timelineOptions.current));
  const regionsWs = useRef(Regions.create());
  const options = useRef<WaveSurferOptions>({
    fillParent: true,
    waveColor: "#573FC8",
    cursorColor: "red",
    height: 200,
    plugins: [timelineWs.current, regionsWs.current],
    url: fileUrl,
    container: "", // Will be overrided
    minPxPerSec: 50,
  });
  const wavesurfer = useWavesurfer(containerRef, options.current);
  const [isWaveformReady, setIsWaveformReady] = useState(true);
  const [isMetronomePlaying, setIsMetronomePlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  const playTickSound = () => {
    const audio = new Audio("beep.wav");
    audio.volume = 0.5;
    audio.play();
  };

  useEffect(() => {
    if (noOfBars && durationOfEachBarInSec) {
      let start = startBeatOffsetMs / 1000;
      let end;
      const newBars: any = {};
      regionsWs.current.clearRegions();
      for (let i = 0; i < noOfBars; i++) {
        end = start + durationOfEachBarInSec;
        // const hue = (360 * i) / noOfBars
        // wavesurferIns.current.addRegion({
        //   start,
        //   end,
        //   color: `hsla(${hue}, 50%, 70%, 0.4)`,
        //   resize: false
        // });
        const no = (i + 1).toString();
        const content = document.createElement("p");
        content.innerText = no;
        content.style.color = "rgba(255,255,255,0.4)";
        content.style.paddingLeft = "4px";
        regionsWs.current.addRegion({
          start,
          color: "rgba(255,255,255,0.2)",
          content: content,
          drag: false,
          resize: false,
        });
        newBars[no] = { start, end };
        start = end;
      }
      setBars(newBars);
    }
  }, [durationOfEachBarInSec, noOfBars, startBeatOffsetMs]);

  const callback = (region: RegionParams) => {
    const id = region.id;
    const newSectionsObj = { ...sectionsObj };
    if (id && newSectionsObj[id]) {
      // newSectionsObj[id].start = region.start;
      const regionEnd = region.end as number;
      const differenceToClosestBarEnd = Object.values(bars).filter(
        (bar) => regionEnd >= bar.start && regionEnd < bar.end
      );
      const barsInSection =
        Object.keys(bars).filter(
          (barNo) =>
            bars[barNo].start >= region.start && bars[barNo].end <= regionEnd
        ).length + 1;
      newSectionsObj[id].bars = barsInSection;
      newSectionsObj[id].totalBars = Number(id)
        ? newSectionsObj[Number(id) - 1].totalBars + barsInSection
        : barsInSection;
      if (differenceToClosestBarEnd.length) {
        const newEnd = differenceToClosestBarEnd[0].end;
        newSectionsObj[id].end = newEnd;
        (region as any).setOptions({ end: newEnd });
        // region.end = newEnd;
        // .onResize(newEnd - regionEnd);
      } else {
        newSectionsObj[Number(id)].end = Number(region.end);
      }
      setSectionsObj(newSectionsObj);
    }
  };

  useEffect(() => {
    if (isPlaying && isMetronomePlaying && bpm) {
      const interval = (60 / bpm) * 1000;
      intervalRef.current = setInterval(playTickSound, interval);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [bpm, isPlaying, isMetronomePlaying]);

  const addSection = () => {
    const newSectionsObj = { ...sectionsObj };
    const id = Object.keys(newSectionsObj).length;
    if (id === 0) {
      const start = 0 + startBeatOffsetMs / 1000;
      newSectionsObj[id] = {
        id,
        name: SectionNames[id],
        start,
        end: start + (durationOfEachBarInSec || 0),
        bars: 1,
        totalBars: 1,
      };
    } else {
      //   const prevRegion = regionsWs.current.getRegions()[id - 1];
      const prevRegion = regionsWs.current
        .getRegions()
        .filter((r) => r.id === (id - 1).toString())[0];
      newSectionsObj[id] = {
        id,
        name: SectionNames[id],
        start: prevRegion.end,
        end: prevRegion.end + (durationOfEachBarInSec as number),
        bars: 1,
        totalBars: newSectionsObj[id - 1].totalBars + 1,
      };
    }
    var o = Math.round,
      r = Math.random,
      s = 255;
    const color =
      "rgba(" +
      o(r() * s) +
      "," +
      o(r() * s) +
      "," +
      o(r() * s) +
      "," +
      0.4 +
      ")";
    const start = newSectionsObj[id].start;
    const end = newSectionsObj[id].end;

    regionsWs.current.addRegion({
      id: id.toString(),
      start,
      end,
      color,
      drag: false,
      resize: true,
    });
    setSectionsObj(newSectionsObj);
  };

  // On play button click
  const pauseOrPlay = useCallback(() => {
    wavesurfer?.isPlaying() ? wavesurfer?.pause() : wavesurfer?.play();
  }, [wavesurfer]);

  const onPlay = () => {
    setIsPlaying(true);
  };
  const onPause = () => {
    setIsPlaying(false);
  };
  const onReady = () => {
    console.log("working");
    setIsWaveformReady(false);
    if (wavesurfer) {
      const duration = wavesurfer.getDuration();
      onDurationUpdate(duration);
    }
  };

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!wavesurfer) return;
    console.log("1");

    setCurrentTime(0);
    setIsPlaying(false);

    const subscriptions = [
      wavesurfer.on("ready", onReady),
      wavesurfer.on("play", onPlay),
      wavesurfer.on("pause", onPause),
      wavesurfer.on("timeupdate", (currentTime) => setCurrentTime(currentTime)),
    ];

    return () => {
      subscriptions.forEach((unsub) => unsub());
    };
  }, [wavesurfer]);
  useEffect(() => {
    if (!wavesurfer) return;
    const subscriptions = [regionsWs.current.on("region-updated", callback)];

    return () => {
      subscriptions.forEach((unsub) => unsub());
    };
  }, [wavesurfer, sectionsObj]);

  return (
    <Box mt={5}>
      <Typography variant="h6">Waveform Explorer</Typography>
      <Box
        mt={4}
        display="flex"
        alignItems={"center"}
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
      >
        <Box display="flex" alignItems={"center"} gap={2} flexWrap="wrap">
          <Button
            variant="contained"
            onClick={pauseOrPlay}
            disabled={isWaveformReady}
            sx={{ px: 1 }}
          >
            {isPlaying ? <PauseRounded /> : <PlayArrowRounded />}
            {/* {isPlaying ? "Pause" : "Play"} */}
          </Button>
          <Button
            onClick={addSection}
            color="info"
            variant="outlined"
            disabled={isWaveformReady || !noOfBars}
          >
            Add Section
          </Button>
          <Typography color={"gray"}>
            {convertSecondsToHHMMSS(Math.floor(currentTime))}
          </Typography>
        </Box>
        <Box display="flex" alignItems={"center"} gap={2} flexWrap="wrap">
          <FormControlLabel
            label="Metronome"
            control={
              <Switch
                checked={isMetronomePlaying}
                onChange={() => setIsMetronomePlaying(!isMetronomePlaying)}
                disabled={isWaveformReady}
              />
            }
          />
          <Stack spacing={2} direction="row" alignItems="center" width={200}>
            <ZoomOut color="secondary" />
            <Slider
              min={10}
              max={100}
              // value={100}
              defaultValue={50}
              onChange={(e, val) => {
                wavesurfer?.zoom(val as number);
              }}
            />
            <ZoomIn color="secondary" />
          </Stack>
        </Box>
      </Box>
      <Box mt={4}>
        {isWaveformReady && (
          <Skeleton
            variant="rounded"
            width={"100%"}
            height={150}
            sx={{ mb: 4 }}
            animation={false}
          ></Skeleton>
        )}
        <div
          ref={containerRef}
          style={{ width: "100%" }}
          //   tabIndex="0"
          //   sx={{ ":focus": { outline: "none" } }}
          onKeyDown={(e: any) => {
            if (e.keyCode === 32) {
              e.preventDefault();
              e.stopPropagation();
              pauseOrPlay();
            }
          }}
        ></div>
      </Box>
      {/* <div ref={containerRef} style={{ minHeight: "120px" }} /> */}
      <Box mt={2}>
        <Typography variant="h6">Sections Information</Typography>
        <Box mt={2}>
          <Box>
            {/* <Typography>No of Sections</Typography>
            <TextField
              type="number"
              onChange={(e) => {
                // const noOfSections = parseInt(e.target.value);
                // if (noOfSections > sectionsObj.length) {
                //   const newNoSections = noOfSections - sectionsObj.length;
                //   const newSections = [...sectionsObj];
                //   for (let i = 0; i < newNoSections; i++) {
                //     newSections.push({
                //       internalId: newSections + i,
                //       name: SectionNames[i] || "",
                //       start: 0,
                //       end: 0,
                //     });
                //   }
                //   setSectionsObj(newSections);
                // }
              }}
            /> */}
          </Box>
        </Box>
        <Box display="flex" gap={3} flexWrap="wrap" mt={2}>
          {Object.values(sectionsObj).map((section, i) => (
            <Card key={i}>
              <Box p={2}>
                <Box mb={1}>
                  {/* <Typography>Section Name</Typography> */}
                  <Autocomplete
                    freeSolo
                    options={[
                      "Intro",
                      "Verse",
                      "Pre-Chorus",
                      "Chorus",
                      "Post-Chorus",
                      "Breakdown",
                      "Bridge",
                      "Hook",
                      "Outro",
                    ]}
                    value={section.name}
                    onChange={(e, newValue) => {
                      if (!newValue) return;
                      const newSectionsObj = { ...sectionsObj };
                      const id = Object.keys(newSectionsObj).filter(
                        (key) => key === section.id.toString()
                      )[0];
                      newSectionsObj[id].name = newValue;
                      // e.target.value;
                      setSectionsObj(newSectionsObj);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Section Name" />
                    )}
                  ></Autocomplete>
                  {/* <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Section Name
                    </InputLabel>
                    <Select
                      size="small"
                      label="Section Name"
                      value={section.name}
                      onChange={(e) => {
                        const newSectionsObj = { ...sectionsObj };
                        const id = Object.keys(newSectionsObj).filter(
                          (key) => key === section.id.toString()
                        )[0];
                        newSectionsObj[id].name = e.target.value;
                        setSectionsObj(newSectionsObj);
                      }}
                    >
                      <MenuItem value={"Intro"}>Intro</MenuItem>
                      <MenuItem value={"Verse"}>Verse</MenuItem>
                      <MenuItem value={"Pre-Chorus"}>Pre-Chorus</MenuItem>
                      <MenuItem value={"Chorus"}>Chorus</MenuItem>
                      <MenuItem value={"Post-Chorus"}>Post-Chorus</MenuItem>
                      <MenuItem value={"Breakdown"}>Breakdown</MenuItem>
                      <MenuItem value={"Bridge"}>Bridge</MenuItem>
                      <MenuItem value={"Hook"}>Hook</MenuItem>
                      <MenuItem value={"Outro"}>Outro</MenuItem>
                    </Select>
                  </FormControl> */}
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography>End Measure</Typography>
                  <TextField
                    type="number"
                    size="small"
                    sx={{ width: "70px" }}
                    value={section.totalBars}
                    onChange={(e) => {
                      // const [startBar, endBar] = e.target.value.split(",");
                      const enteredBarNo = Number(e.target.value);
                      const newSections = { ...sectionsObj };
                      const sectionIdx = section.id;
                      let totalBars;
                      let noOfBarsInSection = enteredBarNo;
                      if (sectionIdx > 0) {
                        const prevTotalBars =
                          newSections[sectionIdx - 1].totalBars;
                        if (enteredBarNo < prevTotalBars + 1) {
                          return;
                        }
                        noOfBarsInSection -= prevTotalBars;
                        totalBars = prevTotalBars + noOfBarsInSection;
                      } else {
                        totalBars = noOfBarsInSection;
                      }
                      newSections[sectionIdx].bars = noOfBarsInSection;
                      newSections[sectionIdx].totalBars = totalBars;
                      // newSections[idx].start = bars[startBar].start;
                      newSections[sectionIdx].end = bars[totalBars].end;
                      //   const _regions = regionsWs.current.getRegions();

                      const _region = regionsWs.current
                        .getRegions()
                        .filter((r) => r.id === section.id.toString())[0];
                      if (_region) {
                        // wavesurferIns.current.regions.list[i].onResize(
                        //   bars[startBar].start,
                        //   "start"
                        // );
                        // const currentStartTime =
                        // _region.start;
                        // const currentEndTime =
                        // _region.end;
                        // TODO
                        // const reducableTimeDiff =
                        //   currentEndTime - currentStartTime;
                        (_region as any).setOptions({
                          end: bars[totalBars].end,
                        });
                        // _region.end = bars[totalBars].end;
                        // wavesurferIns.current.regions.list[i].onResize(
                        //   -reducableTimeDiff
                        // );
                        // const addableDiff =
                        //   sectionIdx > 0
                        //     ? newSections[sectionIdx].end -
                        //       newSections[sectionIdx - 1].end
                        //     : newSections[sectionIdx].end;
                        // const addableDiff =
                        //   newSections[sectionIdx].end -
                        //   newSections[sectionIdx].start;
                        // wavesurferIns.current.regions.list[i].onResize(
                        //   addableDiff
                        // );
                      } else {
                        // var o = Math.round,
                        //   r = Math.random,
                        //   s = 255;
                        // const color =
                        //   "rgba(" +
                        //   o(r() * s) +
                        //   "," +
                        //   o(r() * s) +
                        //   "," +
                        //   o(r() * s) +
                        //   "," +
                        //   0.4 +
                        //   ")";
                        // newSections[idx].color = color;
                        // wavesurferIns.current.addRegion({
                        //   start: bars[startBar].start,
                        //   end: bars[endBar].end,
                        //   color: newSections[idx].color,
                        //   resize: false,
                        //   drag: false,
                        //   id: i,
                        // });
                      }
                      setSectionsObj(newSections);
                    }}
                  />
                </Box>
                {/* <Box>
                  <Typography>Measures</Typography>
                  <TextField
                    size="small"
                    style={{ width: "100px" }}
                    onChange={(e) => {
                      // const [startBar, endBar] = e.target.value.split(",");
                      // if (parseInt(startBar) && parseInt(endBar)) {
                      //   const newSections = [...sectionsObj];
                      //   const idx = newSections.findIndex(
                      //     (sec) => sec.internalId === section.internalId
                      //   );
                      //   newSections[idx].start = bars[startBar].start;
                      //   newSections[idx].end = bars[endBar].end;
                      //   var o = Math.round,
                      //     r = Math.random,
                      //     s = 255;
                      //   const color =
                      //     "rgba(" +
                      //     o(r() * s) +
                      //     "," +
                      //     o(r() * s) +
                      //     "," +
                      //     o(r() * s) +
                      //     "," +
                      //     0.4 +
                      //     ")";
                      //   if (wavesurferIns.current.regions.list[i]) {
                      //     wavesurferIns.current.regions.list[i].onResize(
                      //       bars[startBar].start,
                      //       "start"
                      //     );
                      //     wavesurferIns.current.regions.list[i].onResize(
                      //       bars[startBar].start,
                      //       "end"
                      //     );
                      //   } else {
                      //     newSections[idx].color = color;
                      //     wavesurferIns.current.addRegion({
                      //       start: bars[startBar].start,
                      //       end: bars[endBar].end,
                      //       color: newSections[idx].color,
                      //       resize: false,
                      //       drag: false,
                      //       id: i,
                      //     });
                      //   }
                      //   setSectionsObj(newSections);
                      // }
                    }}
                  ></TextField>
                </Box> */}
                {section.end > 0 && (
                  <Box mt={2}>
                    <Box display="flex" alignItems="center">
                      <Typography>
                        {section.start.toFixed(2)}s - {section.end.toFixed(2)}s
                      </Typography>
                      <IconButton
                        onClick={() => {
                          regionsWs.current
                            .getRegions()
                            .filter((r) => r.id === section.id.toString())[0]
                            .play();
                        }}
                      >
                        <PlayCircleFilledWhiteOutlinedIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          const newObj = { ...sectionsObj };
                          delete newObj[i];
                          setSectionsObj(newObj);
                          regionsWs.current
                            .getRegions()
                            .filter((r) => r.id === section.id.toString())[0]
                            .remove();
                        }}
                        disabled={i !== Object.keys(sectionsObj).length - 1}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                      {/* <IconButton
                        onClick={() => {
                          wavesurferIns.current.regions.list[i].playLoop();
                        }}
                      >
                        <LoopRoundedIcon />
                      </IconButton> */}
                    </Box>
                    {/* <Typography>End: {section.end.toFixed(2)}s</Typography> */}
                  </Box>
                )}
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default WaveSurferPlayer;
