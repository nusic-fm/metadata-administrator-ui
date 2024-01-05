import { Button, Skeleton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import BubbleUI from "react-bubble-ui";
import "react-bubble-ui/dist/index.css";

const getColorsForGroup = (name) => {
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
const Bubbles = (props) => {
  const [data, setData] = useState([
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
  ]);
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
                setData([d, "load"]);
                setTimeout(() => {
                  setData([d, "Instument 1", "load"]);
                  setTimeout(() => {
                    setData([d, "Instument 1", "Instument 2", "load"]);
                    setTimeout(() => {
                      setData([d, "Instument 1", "Instument 2", "Instument 3"]);
                    }, 4000);
                  }, 4000);
                }, 4000);
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
