// /* eslint-disable react-hooks/exhaustive-deps */

// import SpectrogramPlugin from "wavesurfer.js/dist/plugins/wavesurfer.js";
// import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.js";
// import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
// // import MakersPlugin from "wavesurfer.js/dist/plugin/wavesurfer.markers.min.js";
// import WaveSurfer from "wavesurfer.js";
// import {
//   Box,
//   Button,
//   Typography,
//   // Select,
//   // MenuItem,
//   IconButton,
//   Card,
//   TextField,
//   Skeleton,
//   Autocomplete,
//   Switch,
//   FormControlLabel,
//   ButtonGroup,
//   // TextField,
// } from "@mui/material";
// import colormap from "colormap";
// import { useEffect, useRef, useState } from "react";
// import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
// import Accordion from "@mui/material/Accordion";
// import AccordionSummary from "@mui/material/AccordionSummary";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// // import LoopRoundedIcon from "@mui/icons-material/LoopRounded";
// import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
// import PauseRounded from "@mui/icons-material/PauseRounded";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import ZoomInIcon from "@mui/icons-material/ZoomIn";
// import ZoomOutIcon from "@mui/icons-material/ZoomOut";
// // import FormControl from "@mui/material/FormControl";
// // import InputLabel from "@mui/material/InputLabel";

// const SectionNames = [
//   "Intro",
//   "Verse",
//   "Pre-Chorus",
//   "Chorus",
//   "Post-Chorus",
//   "Breakdown",
//   "Bridge",
//   "Hook",
//   "Outro",
// ];

// type Props = {
//     proofOfCreationMetadataObj: any;
//     sectionsObj: any;
//     setSectionsObj: any;
// }

// const WaveForm = ({
//   proofOfCreationMetadataObj,
//   sectionsObj,
//   setSectionsObj,
// }: Props) => {
//   const { fileUrl, durationOfEachBarInSec, noOfBars, startBeatOffsetMs, bpm } =
//     proofOfCreationMetadataObj;
//   const [isLoading, setIsLoading] = useState(true);
//   const wavesurferIns = useRef<WaveSurfer | null>(null);
//   const regionsWs = useRef(RegionsPlugin.create());

//   const [zoomValue, setZoomValue] = useState(30);
//   const [bars, setBars] = useState({});
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isMetronomePlaying, setIsMetronomePlaying] = useState(false);
//   const intervalRef = useRef<any>();

//   useEffect(() => {
//     if (isPlaying && isMetronomePlaying) {
//       const interval = (60 / bpm) * 1000;
//       intervalRef.current = setInterval(playTickSound, interval);
//     } else {
//       clearInterval(intervalRef.current);
//     }

//     return () => {
//       clearInterval(intervalRef.current);
//     };
//   }, [bpm, isPlaying, isMetronomePlaying]);

//   function playTickSound() {
//     const audio = new Audio("beep.wav");
//     audio.volume = 0.5;
//     audio.play();
//   }

//   useEffect(() => {
//     if (noOfBars && durationOfEachBarInSec && wavesurferIns.current) {
//       let start = startBeatOffsetMs / 1000;
//       let end;
//       const newBars: any = {};
//       regionsWs.current.clearRegions();
//       for (let i = 0; i < noOfBars; i++) {
//         end = start + durationOfEachBarInSec;
//         // const hue = (360 * i) / noOfBars
//         // wavesurferIns.current.addRegion({
//         //   start,
//         //   end,
//         //   color: `hsla(${hue}, 50%, 70%, 0.4)`,
//         //   resize: false
//         // });
//         const no = (i + 1).toString();
//         regionsWs.current.addRegion({
//           start,
//           color: "rgba(0,0,0,0.1)",
//           content: no,
//         });
//         newBars[no] = { start, end };
//         start = end;
//       }
//       setBars(newBars);
//     }
//   }, [durationOfEachBarInSec, noOfBars, startBeatOffsetMs]);

//   const showWaveForm = () => {
//     const colors = colormap({
//       colormap: "hot",
//       nshades: 256,
//       format: "float",
//     });
//     var wavesurfer = WaveSurfer.create({
//     //   scrollParent: true,
//       fillParent: false,
//       // barGap: 50,
//       container: "#waveform",
//     //   backgroundColor: "white",
//       waveColor: "#573FC8",
//       cursorColor: "red",
//       backend: "MediaElement",
//       height: 200,
//       // barHeight: 1.5,
//       // barGap: 3,
//       plugins: [
//         TimelinePlugin.create({
//           container: "#wave-timeline",
//           primaryFontColor: "#000",
//           secondaryFontColor: "#000",
//         }),
//         RegionsPlugin.create({
//           dragSelection: false,
//           // dragSelection: {
//           //   slop: 5,
//           // },
//         }),
//         SpectrogramPlugin.create({
//           container: "#wave-spectrogram",
//           waveColor: "yellow",
//           colorMap: colors,
//         }),
//         MakersPlugin.create(),
//       ],
//     });
//     wavesurfer.on("ready", function () {
//       setIsLoading(false);
//       wavesurferIns.current.zoom(zoomValue);
//       // wavesurfer.backend()
//     });
//     // wavesurfer.on("region-update-end", function () {
//     //   // start, end, id,
//     //   setSegments(Object.values(wavesurferIns.current.regions.list).map(region => ({internalId: region.id, start: region.start, end: region.end, })))
//     //   // const updatedSegments = segments.map(segment => {
//     //   //   if (segment.id === region.id) {
//     //   //     return {}
//     //   //   }
//     //   //   return segment
//     //   // })
//     //   // setSegments()
//     // })
//     // wavesurfer.on("region-removed", function () {
//     //   // start, end, id,
//     //   setSegments(Object.values(wavesurferIns.current.regions.list).map(region => ({internalId: region.id, start: region.start, end: region.end, })))
//     //   // const updatedSegments = segments.map(segment => {
//     //   //   if (segment.id === region.id) {
//     //   //     return {}
//     //   //   }
//     //   //   return segment
//     //   // })
//     //   // setSegments()
//     // })
//     wavesurfer.load(fileUrl);
//     wavesurferIns.current = wavesurfer;
//     wavesurferIns.current.on("region-created", function (region) {
//       // const newSectionsObj = { ...sectionsObj };
//       // const id = Object.keys(newSectionsObj).length;
//       // region.id = id;
//       // var o = Math.round,
//       //   r = Math.random,
//       //   s = 255;
//       // const color =
//       //   "rgba(" +
//       //   o(r() * s) +
//       //   "," +
//       //   o(r() * s) +
//       //   "," +
//       //   o(r() * s) +
//       //   "," +
//       //   0.4 +
//       //   ")";
//       // region.id = id;
//       // region.color = color;
//       // newSectionsObj[id] = {
//       //   name: SectionNames[id],
//       //   start: region.start,
//       //   end: region.end,
//       // };
//       // setSectionsObj(newSectionsObj);
//     });
//   };

//   useEffect(() => {
//     if (fileUrl) {
//       showWaveForm();
//     }
//   }, [fileUrl]);

//   const callback = (region) => {
//     const id = region.id;
//     const newSectionsObj = { ...sectionsObj };
//     if (newSectionsObj[id]) {
//       // newSectionsObj[id].start = region.start;
//       const differenceToClosestBarEnd = Object.values(bars).filter(
//         (bar) => region.end >= bar.start && region.end < bar.end
//       );
//       const barsInSection =
//         Object.keys(bars).filter(
//           (barNo) =>
//             bars[barNo].start >= region.start && bars[barNo].end <= region.end
//         ).length + 1;
//       newSectionsObj[id].bars = barsInSection;
//       newSectionsObj[id].totalBars = id
//         ? newSectionsObj[id - 1].totalBars + barsInSection
//         : barsInSection;
//       if (differenceToClosestBarEnd.length) {
//         const newEnd = differenceToClosestBarEnd[0].end;
//         newSectionsObj[id].end = newEnd;
//         region.onResize(newEnd - region.end);
//       } else {
//         newSectionsObj[id].end = region.end;
//       }
//       setSectionsObj(newSectionsObj);
//       // if (
//       //   id &&
//       //   region.start !== wavesurferIns.current.regions.list[id - 1].end
//       // ) {
//       //   region.onResize(
//       //     wavesurferIns.current.regions.list[id - 1].end,
//       //     "start"
//       //   );
//       // }
//     }
//     // else {
//     //   newSectionsObj[id] = {
//     //     name: SectionNames[id],
//     //     start: region.start,
//     //     end: region.end,
//     //   };
//     //   setSectionsObj(newSectionsObj);
//     // }
//   };
//   useEffect(() => {
//     if (wavesurferIns.current && !isLoading) {
//       wavesurferIns.current.on("region-update-end", callback);
//     }
//     return () => {
//       wavesurferIns.current?.un("region-update-end", callback);
//     };
//   }, [isLoading, sectionsObj]);

//   const addSection = () => {
//     const newSectionsObj = { ...sectionsObj };
//     const id = Object.keys(newSectionsObj).length;
//     if (id === 0) {
//       newSectionsObj[id] = {
//         id,
//         name: SectionNames[id],
//         start: 0,
//         end: durationOfEachBarInSec,
//         bars: 1,
//         totalBars: 1,
//       };
//     } else {
//       const prevRegion = wavesurferIns.current.regions.list[id - 1];
//       newSectionsObj[id] = {
//         id,
//         name: SectionNames[id],
//         start: prevRegion.end,
//         end: prevRegion.end + durationOfEachBarInSec,
//         bars: 1,
//         totalBars: newSectionsObj[id - 1].totalBars + 1,
//       };
//     }
//     var o = Math.round,
//       r = Math.random,
//       s = 255;
//     const color =
//       "rgba(" +
//       o(r() * s) +
//       "," +
//       o(r() * s) +
//       "," +
//       o(r() * s) +
//       "," +
//       0.4 +
//       ")";
//     wavesurferIns.current.addRegion({
//       id,
//       start: newSectionsObj[id].start,
//       end: newSectionsObj[id].end,
//       color,
//       drag: false,
//     });
//     setSectionsObj(newSectionsObj);
//   };
//   const pauseOrPlay = () => {
//     wavesurferIns.current.playPause();
//   };

//   // const onZoom = (e) => {
//   //   setZoomValue(Number(e.target.value));
//   //   wavesurferIns.current.zoom(Number(e.target.value));
//   // };

//   const onPlay = () => {
//     setIsPlaying(true);
//   };
//   const onPause = () => {
//     setIsPlaying(false);
//   };
//   useEffect(() => {
//     wavesurferIns.current?.on("play", onPlay);
//     wavesurferIns.current?.on("pause", onPause);
//     return () => {
//       wavesurferIns.current?.on("play", onPlay);
//       wavesurferIns.current?.un("pause", onPause);
//     };
//   }, [isLoading, isPlaying]);

//   return (
//     <Box mt={5}>
//       <Typography variant="h6">Waveform Explorer</Typography>
//       <Box mt={4} display="flex" flexWrap="wrap" gap={2}>
//         <Button
//           variant="contained"
//           onClick={pauseOrPlay}
//           disabled={isLoading}
//           sx={{ px: 1 }}
//         >
//           {isPlaying ? <PauseRounded /> : <PlayArrowRounded />}
//           {/* {isPlaying ? "Pause" : "Play"} */}
//         </Button>
//         <ButtonGroup disabled={isLoading}>
//           <Button
//             onClick={(e) => {
//               const newZoomVal = zoomValue - 10;
//               wavesurferIns.current.zoom(newZoomVal);
//               setZoomValue(newZoomVal);
//             }}
//           >
//             <ZoomOutIcon />
//           </Button>
//           <Button
//             onClick={() => {
//               const newZoomVal = zoomValue + 10;
//               wavesurferIns.current.zoom(newZoomVal);
//               setZoomValue(newZoomVal);
//             }}
//           >
//             <ZoomInIcon />
//           </Button>
//         </ButtonGroup>
//         <FormControlLabel
//           label="Metronome"
//           control={
//             <Switch
//               checked={isMetronomePlaying}
//               onChange={() => setIsMetronomePlaying(!isMetronomePlaying)}
//               disabled={isLoading}
//             />
//           }
//         ></FormControlLabel>

//         <Button
//           onClick={addSection}
//           variant="outlined"
//           disabled={isLoading || !noOfBars}
//         >
//           Add Section
//         </Button>
//       </Box>
//       <Box mt={4}>
//         {isLoading && (
//           <Skeleton
//             variant="rounded"
//             width={"100%"}
//             height={150}
//             sx={{ mb: 4 }}
//             animation={false}
//           ></Skeleton>
//         )}
//         <Box
//           id="waveform"
//           style={{ width: "100%" }}
//           tabIndex="0"
//           sx={{ ":focus": { outline: "none" } }}
//           onKeyDown={(e) => {
//             if (e.keyCode === 32) {
//               e.preventDefault();
//               e.stopPropagation();
//               pauseOrPlay();
//             }
//           }}
//         ></Box>
//         <Box id="wave-timeline"></Box>
//       </Box>
//       {/* <Box display="flex" justifyContent="end" mt={{ xs: 4, md: 0 }}>
//         {url && (
//           <Stack
//             spacing={2}
//             direction="row"
//             sx={{ mb: 1 }}
//             alignItems="center"
//             width={300}
//           >
//             <IconButton
//               onClick={() => {
//                 const newZoomVal = zoomValue - 10;
//                 wavesurferIns.current.zoom(newZoomVal);
//                 setZoomValue(newZoomVal);
//               }}
//             >
//               <ZoomOutIcon color="primary" />
//             </IconButton>
//             <IconButton
//               onClick={() => {
//                 const newZoomVal = zoomValue + 10;
//                 wavesurferIns.current.zoom(newZoomVal);
//                 setZoomValue(newZoomVal);
//               }}
//             >
//               <ZoomInIcon color="primary" />
//             </IconButton>
//             <Slider
//               aria-label="Volume"
//               value={zoomValue}
//               onChange={onZoom}
//               step={10}
//               min={10}
//               max={100}
//             />
//           </Stack>
//         )}
//       </Box> */}
//       <Accordion mt={4} width="100%" color="primary">
//         <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//           <Typography variant="h6">Audio Fingerprint</Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           <Box mt={2} id="wave-spectrogram" width="100%"></Box>
//         </AccordionDetails>
//       </Accordion>
//       {/* <Box mt={4} width="100%">
//         <Typography variant="h6">Audio Fingerprint</Typography>
//         <Box mt={2} id="wave-spectrogram" width="100%"></Box>
//       </Box> */}
//       <Box mt={2}>
//         <Typography variant="h6">Sections Information</Typography>
//         <Box mt={2}>
//           <Box>
//             {/* <Typography>No of Sections</Typography>
//             <TextField
//               type="number"
//               onChange={(e) => {
//                 // const noOfSections = parseInt(e.target.value);
//                 // if (noOfSections > sectionsObj.length) {
//                 //   const newNoSections = noOfSections - sectionsObj.length;
//                 //   const newSections = [...sectionsObj];
//                 //   for (let i = 0; i < newNoSections; i++) {
//                 //     newSections.push({
//                 //       internalId: newSections + i,
//                 //       name: SectionNames[i] || "",
//                 //       start: 0,
//                 //       end: 0,
//                 //     });
//                 //   }
//                 //   setSectionsObj(newSections);
//                 // }
//               }}
//             /> */}
//           </Box>
//         </Box>
//         <Box display="flex" gap={3} flexWrap="wrap" mt={2}>
//           {Object.values(sectionsObj).map((section, i) => (
//             <Card key={i}>
//               <Box p={2}>
//                 <Box mb={1}>
//                   {/* <Typography>Section Name</Typography> */}
//                   <Autocomplete
//                     freeSolo
//                     options={[
//                       "Intro",
//                       "Verse",
//                       "Pre-Chorus",
//                       "Chorus",
//                       "Post-Chorus",
//                       "Breakdown",
//                       "Bridge",
//                       "Hook",
//                       "Outro",
//                     ]}
//                     value={section.name}
//                     onChange={(e, newValue) => {
//                       const newSectionsObj = { ...sectionsObj };
//                       const id = Object.keys(newSectionsObj).filter(
//                         (key) => key === section.id.toString()
//                       )[0];
//                       newSectionsObj[id].name = newValue;
//                       // e.target.value;
//                       setSectionsObj(newSectionsObj);
//                     }}
//                     renderInput={(params) => (
//                       <TextField {...params} label="Section Name" />
//                     )}
//                   ></Autocomplete>
//                   {/* <FormControl fullWidth>
//                     <InputLabel id="demo-simple-select-label">
//                       Section Name
//                     </InputLabel>
//                     <Select
//                       size="small"
//                       label="Section Name"
//                       value={section.name}
//                       onChange={(e) => {
//                         const newSectionsObj = { ...sectionsObj };
//                         const id = Object.keys(newSectionsObj).filter(
//                           (key) => key === section.id.toString()
//                         )[0];
//                         newSectionsObj[id].name = e.target.value;
//                         setSectionsObj(newSectionsObj);
//                       }}
//                     >
//                       <MenuItem value={"Intro"}>Intro</MenuItem>
//                       <MenuItem value={"Verse"}>Verse</MenuItem>
//                       <MenuItem value={"Pre-Chorus"}>Pre-Chorus</MenuItem>
//                       <MenuItem value={"Chorus"}>Chorus</MenuItem>
//                       <MenuItem value={"Post-Chorus"}>Post-Chorus</MenuItem>
//                       <MenuItem value={"Breakdown"}>Breakdown</MenuItem>
//                       <MenuItem value={"Bridge"}>Bridge</MenuItem>
//                       <MenuItem value={"Hook"}>Hook</MenuItem>
//                       <MenuItem value={"Outro"}>Outro</MenuItem>
//                     </Select>
//                   </FormControl> */}
//                 </Box>
//                 <Box display="flex" alignItems="center" gap={1}>
//                   <Typography>End Measure</Typography>
//                   <TextField
//                     type="number"
//                     size="small"
//                     sx={{ width: "70px" }}
//                     value={section.totalBars}
//                     onChange={(e) => {
//                       // const [startBar, endBar] = e.target.value.split(",");
//                       const enteredBarNo = Number(e.target.value);
//                       const newSections = { ...sectionsObj };
//                       const sectionIdx = section.id;
//                       let totalBars;
//                       let noOfBarsInSection = enteredBarNo;
//                       if (sectionIdx > 0) {
//                         const prevTotalBars =
//                           newSections[sectionIdx - 1].totalBars;
//                         if (enteredBarNo < prevTotalBars + 1) {
//                           return;
//                         }
//                         noOfBarsInSection -= prevTotalBars;
//                         totalBars = prevTotalBars + noOfBarsInSection;
//                       } else {
//                         totalBars = noOfBarsInSection;
//                       }
//                       newSections[sectionIdx].bars = noOfBarsInSection;
//                       newSections[sectionIdx].totalBars = totalBars;
//                       // newSections[idx].start = bars[startBar].start;
//                       newSections[sectionIdx].end = bars[totalBars].end;
//                       if (wavesurferIns.current.regions.list[i]) {
//                         // wavesurferIns.current.regions.list[i].onResize(
//                         //   bars[startBar].start,
//                         //   "start"
//                         // );
//                         const currentStartTime =
//                           wavesurferIns.current.regions.list[i].start;
//                         const currentEndTime =
//                           wavesurferIns.current.regions.list[i].end;
//                         const reducableTimeDiff =
//                           currentEndTime - currentStartTime;
//                         wavesurferIns.current.regions.list[i].onResize(
//                           -reducableTimeDiff
//                         );
//                         // const addableDiff =
//                         //   sectionIdx > 0
//                         //     ? newSections[sectionIdx].end -
//                         //       newSections[sectionIdx - 1].end
//                         //     : newSections[sectionIdx].end;
//                         const addableDiff =
//                           newSections[sectionIdx].end -
//                           newSections[sectionIdx].start;
//                         wavesurferIns.current.regions.list[i].onResize(
//                           addableDiff
//                         );
//                       } else {
//                         // var o = Math.round,
//                         //   r = Math.random,
//                         //   s = 255;
//                         // const color =
//                         //   "rgba(" +
//                         //   o(r() * s) +
//                         //   "," +
//                         //   o(r() * s) +
//                         //   "," +
//                         //   o(r() * s) +
//                         //   "," +
//                         //   0.4 +
//                         //   ")";
//                         // newSections[idx].color = color;
//                         // wavesurferIns.current.addRegion({
//                         //   start: bars[startBar].start,
//                         //   end: bars[endBar].end,
//                         //   color: newSections[idx].color,
//                         //   resize: false,
//                         //   drag: false,
//                         //   id: i,
//                         // });
//                       }
//                       setSectionsObj(newSections);
//                     }}
//                   />
//                 </Box>
//                 {/* <Box>
//                   <Typography>Measures</Typography>
//                   <TextField
//                     size="small"
//                     style={{ width: "100px" }}
//                     onChange={(e) => {
//                       // const [startBar, endBar] = e.target.value.split(",");
//                       // if (parseInt(startBar) && parseInt(endBar)) {
//                       //   const newSections = [...sectionsObj];
//                       //   const idx = newSections.findIndex(
//                       //     (sec) => sec.internalId === section.internalId
//                       //   );
//                       //   newSections[idx].start = bars[startBar].start;
//                       //   newSections[idx].end = bars[endBar].end;
//                       //   var o = Math.round,
//                       //     r = Math.random,
//                       //     s = 255;
//                       //   const color =
//                       //     "rgba(" +
//                       //     o(r() * s) +
//                       //     "," +
//                       //     o(r() * s) +
//                       //     "," +
//                       //     o(r() * s) +
//                       //     "," +
//                       //     0.4 +
//                       //     ")";
//                       //   if (wavesurferIns.current.regions.list[i]) {
//                       //     wavesurferIns.current.regions.list[i].onResize(
//                       //       bars[startBar].start,
//                       //       "start"
//                       //     );
//                       //     wavesurferIns.current.regions.list[i].onResize(
//                       //       bars[startBar].start,
//                       //       "end"
//                       //     );
//                       //   } else {
//                       //     newSections[idx].color = color;
//                       //     wavesurferIns.current.addRegion({
//                       //       start: bars[startBar].start,
//                       //       end: bars[endBar].end,
//                       //       color: newSections[idx].color,
//                       //       resize: false,
//                       //       drag: false,
//                       //       id: i,
//                       //     });
//                       //   }
//                       //   setSectionsObj(newSections);
//                       // }
//                     }}
//                   ></TextField>
//                 </Box> */}
//                 {section.end > 0 && (
//                   <Box mt={2}>
//                     <Box display="flex" alignItems="center">
//                       <Typography>
//                         {section.start.toFixed(2)}s - {section.end.toFixed(2)}s
//                       </Typography>
//                       <IconButton
//                         onClick={() => {
//                           wavesurferIns.current.regions.list[
//                             section.id
//                           ].playLoop();
//                         }}
//                       >
//                         <PlayCircleFilledWhiteOutlinedIcon />
//                       </IconButton>
//                       <IconButton
//                         onClick={() => {
//                           const newObj = { ...sectionsObj };
//                           delete newObj[i];
//                           setSectionsObj(newObj);
//                           wavesurferIns.current.regions.list[
//                             section.id
//                           ].remove();
//                         }}
//                         disabled={i !== Object.keys(sectionsObj).length - 1}
//                       >
//                         <DeleteOutlineIcon />
//                       </IconButton>
//                       {/* <IconButton
//                         onClick={() => {
//                           wavesurferIns.current.regions.list[i].playLoop();
//                         }}
//                       >
//                         <LoopRoundedIcon />
//                       </IconButton> */}
//                     </Box>
//                     {/* <Typography>End: {section.end.toFixed(2)}s</Typography> */}
//                   </Box>
//                 )}
//               </Box>
//             </Card>
//           ))}
//         </Box>
//       </Box>
//     </Box>
//   );
// };

export default {};
