import { PlayArrowRounded } from "@mui/icons-material";
import { Button, Skeleton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import BubbleUI from "react-bubble-ui";
import "react-bubble-ui/dist/index.css";

const getColorsForGroup = (name: string) => {
  switch (name) {
    case "House":
    case "Ambient":
    case "Pluggnb":
    case "Future Bass":
      return "rgb(33, 206, 175)";
    case "The Raver":
    case "Dubstepper":
    case "Mystical Orient":
    case "The Chase":
      return "rgb(58, 106, 231)";
    case "Egypt":
    case "Latin":
    case "Indian":
    case "African":
      return "rgb(255, 130, 14)";
    default:
      return "rgb(208, 43, 250)";
  }
};
const source = [
  "House",
  "Ambient",
  "Pluggnb",
  "Future Bass",
  "The Raver",
  "Dubstepper",
  "Mystical Orient",
  "The Chase",
  "Egypt",
  "Latin",
  "Indian",
  "African",
];
const Bubbles = ({ onPlay, onFirstClick }: any) => {
  const [data, setData] = useState(source);
  const [promptIdx, setPromptIdx] = useState(-1);
  const [counter, setCounter] = useState(0);
  // const [bubbleSelected, setBubbleSelected] = useState(false);

  const options = {
    size: 160,
    minSize: 70,
    gutter: 10,
    provideProps: true,
    numCols: 4,
    fringeWidth: 100,
    yRadius: 60,
    xRadius: 120,
    cornerRadius: 100,
    showGuides: false,
    compact: true,
    gravitation: 9,
  };

  useEffect(() => {
    if (promptIdx >= 0 && counter < 5) {
      console.log("before: ", data);
      setTimeout(() => {
        setCounter(counter + 1);
        setBubbleEvent(source[promptIdx], promptIdx + counter + 1);
      }, 4000);
    }
  }, [promptIdx, data, counter]);

  const setBubbleEvent = (name: string, nextIdx: number) => {
    const newDataSet = data.map((d, i) => {
      if (d === name) {
        return name;
      } else if (d.startsWith("Instrument")) {
        return d;
      } else if (d === "load") {
        return "Instrument " + Math.round(Math.random() + Math.random() * 100);
      } else if (nextIdx === i + 1) {
        return "load";
      } else {
        return i.toString();
      }
    });
    console.log("New Dataset: ", newDataSet);
    setData(newDataSet);
  };
  const onBubbleClick = (name: string) => {
    setCounter(0);
    const idx = data.indexOf(name);
    const newDataSet = data.map((d, i) => {
      if (d === name) {
        return name;
      } else if (d.startsWith("Instrument")) {
        return d;
      } else if (idx === i + 1) {
        return "load";
      } else {
        return i.toString();
      }
    });
    setData(newDataSet);
    setPromptIdx(idx);
  };

  return (
    <BubbleUI options={options} className="myBubbleUI">
      {data.map((d, i) => {
        if (d.endsWith("load")) {
          return (
            <Box className="childComponent" key={d}>
              <Skeleton
                variant="circular"
                sx={{ height: "100%", width: "100%" }}
                animation="wave"
              />
            </Box>
          );
        } else if (d.startsWith("Instrument")) {
          return (
            <Box className="childComponent" key={d}>
              <Button
                color="secondary"
                sx={{ height: "50%", width: "50%", borderRadius: "50%" }}
                onClick={onPlay}
                variant="outlined"
              >
                <PlayArrowRounded fontSize="large" />
              </Button>
            </Box>
          );
        } else if (!source.includes(d)) {
          return (
            <Box className="childComponent" key={d}>
              <Button
                color="secondary"
                sx={{ height: "50%", width: "50%", borderRadius: "50%" }}
                onClick={() => {
                  setPromptIdx(-1);
                  setData(source);
                }}
              >
                .
              </Button>
            </Box>
          );
        }
        return (
          <Box
            className="childComponent"
            key={d}
            style={{
              backgroundColor: getColorsForGroup(d),
            }}
          >
            <Button
              color="secondary"
              sx={{ height: "100%", width: "100%", borderRadius: "50%" }}
              onClick={() => {
                if (promptIdx === -1) {
                  onBubbleClick(d);
                  onFirstClick();
                }
              }}
            >
              {d}
            </Button>
          </Box>
        );
      })}
    </BubbleUI>
  );
};

export default Bubbles;
