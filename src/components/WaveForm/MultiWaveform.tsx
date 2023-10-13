import { Box, Button, Stack, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Regions, { RegionParams } from "wavesurfer.js/dist/plugins/regions.js";
import Multitrack, { MultitrackTracks } from "wavesurfer-multitrack";

const times = [
  { start: 0, end: 0, label: "-" },
  { start: 0, end: 5.5, label: "Intro" },
  { start: 5.5, end: 12, label: "Verse" },
  { start: 12, end: 20, label: "Chorus" },
];

const MultiWaveform = () => {
  const multitrackIns = useRef<null | Multitrack>();
  const trackRegionsWs = useRef<{ [key: string]: Regions }>({
    0: Regions.create(),
  });
  const [currentId, setCurrentId] = useState(0);
  const [tracks, setTracks] = useState<MultitrackTracks>([
    {
      id: 0,
      url: "/audio.mp3",
      startPosition: 0,
      options: { waveColor: "#573FC8" },
    },
  ]);

  const onAddSection = () => {
    const newId = currentId + 1;
    const _tracks = [...tracks];
    trackRegionsWs.current[newId] = Regions.create();
    _tracks.push({
      id: newId,
      startPosition: 0,
      url: "/audio.mp3",
      options: {
        waveColor: "#573FC8",
        progressColor: "hsl(46, 87%, 20%)",
        plugins: [trackRegionsWs.current[newId]],
      },
    });

    setTracks(_tracks);
    setCurrentId(newId);
    // multitrackIns.current?.addTrack({
    //   id: newId,
    //   startPosition: 0,
    //   url: "/lw.mp3",
    // });
  };
  const onAddRegion = () => {
    if (multitrackIns.current) {
      (multitrackIns.current as any).wavesurfers[currentId].registerPlugin(
        trackRegionsWs.current[currentId]
      );
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
      if (currentId) {
        trackRegionsWs.current[currentId].addRegion({
          id: "0",
          start: 0,
          end: times[currentId].start,
          color: "black",
          drag: false,
          resize: false,
        });
      }
      trackRegionsWs.current[currentId].addRegion({
        id: "0",
        start: times[currentId].start,
        end: times[currentId].end,
        color,
        drag: false,
        resize: false,
        content: "Intro",
      });
      trackRegionsWs.current[currentId].addRegion({
        id: "1",
        start: times[currentId].end,
        end: 156,
        color: "black",
        drag: false,
        resize: false,
      });
    }
  };

  useEffect(() => {
    if (tracks) {
      //   if (multitrackIns.current) {
      //     multitrackIns.current.destroy();
      //   }
      multitrackIns.current = Multitrack.create(tracks, {
        container: document.querySelector("#container") as HTMLElement, // required!
        minPxPerSec: 30, // zoom level
        rightButtonDrag: false, // set to true to drag with right mouse button
        cursorWidth: 2,
        cursorColor: "#D72F21",
        // trackBackground: "#2D2D2D",
        // trackBorderColor: "#7C7C7C",
        // dragBounds: true,
        // envelopeOptions: {
        //   lineColor: "rgba(255, 0, 0, 0.7)",
        //   lineWidth: "4",
        //   dragPointSize: 8,
        //   dragPointFill: "rgba(255, 255, 255, 0.8)",
        //   dragPointStroke: "rgba(255, 255, 255, 0.3)",
        // },
      });
      multitrackIns.current.once("canplay", async () => {
        if (multitrackIns.current) {
          tracks.map((t) => {
            const id = Number(t.id);
            if (id === 0) return;
            // (multitrackIns.current as any).wavesurfers[id].registerPlugin(
            //   trackRegionsWs.current[id]
            // );
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
            trackRegionsWs.current[id].addRegion({
              id: "0",
              start: 0,
              end: times[id].start,
              color: "black",
              drag: false,
              resize: false,
            });
            trackRegionsWs.current[id].addRegion({
              id: "0",
              start: times[id].start,
              end: times[id].end,
              color,
              drag: false,
              resize: false,
              content: times[id].label,
            });
            trackRegionsWs.current[id].addRegion({
              id: "1",
              start: times[id].end,
              end: 156,
              color: "black",
              drag: false,
              resize: false,
            });
          });
        }
      });
      //   if ((multitrackIns.current as any).wavesurfers.length) {
      //     debugger;
      //     (multitrackIns.current as any).wavesurfers[currentId].registerPlugin(
      //       trackRegionsWs.current[currentId]
      //     );
      //   }
    }
    return () => {
      multitrackIns.current?.destroy();
      multitrackIns.current = null;
    };
  }, [tracks]);

  return (
    <Box>
      <Box display={"flex"} gap={2} width="100%">
        <Stack width={"20%"} justifyContent="center">
          {tracks.map((t) =>
            t.id === 0 ? (
              <Box height={"128px"}></Box>
            ) : (
              <Stack height={"128px"} spacing={0.5} justifyContent="center">
                <TextField
                  label="Section Name"
                  size="small"
                  defaultValue={times[Number(t.id)].label}
                ></TextField>
                <Box display={"flex"}>
                  <TextField label="start bar" size="small"></TextField>
                  <TextField label="end bar" size="small"></TextField>
                </Box>
              </Stack>
            )
          )}
          <Stack height={"128px"} spacing={1}>
            <Button variant="contained" onClick={onAddSection}>
              Add New Section
            </Button>
          </Stack>
        </Stack>
        <div id="container" style={{ width: "80%", color: "white" }}></div>
      </Box>
    </Box>
  );
};

export default MultiWaveform;
