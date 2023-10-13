import { Split } from "@geoffcox/react-splitter";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useMemo, useState } from "react";

type Props = {};

const sectionNames = [
  "Intro",
  "Verse",
  "Pre-Chorus",
  "Chorus",
  "Post-Chorus",
  "Bridge",
  "Outro",
];

type Elem = {
  pk: string;
  sk: string;
  options: { name: string; width: number };
};

const Splitter = ({}: Props) => {
  const [state, setState] = useState<{ [key: string]: any }>({
    "1": { options: { name: "Add Section" } },
  });

  const getStateById = (id: string) => {
    return state[id] || {};
  };

  const onSplit = (id: string) => {
    const newNode = {
      id,
      primaryId: Math.round(Math.random() * 10),
      secondaryId: Math.round(Math.random() * 10),
      name: "Intro",
    };
    const _mNode = { ...state[id], ...newNode };
    setState({ ...state, [id]: _mNode });
  };

  console.log(state);

  return (
    <DynamicSplitter
      onSplit={onSplit}
      getStateById={getStateById}
      id="1"
      state={state}
    ></DynamicSplitter>
  );
};

const DynamicSplitter = (props: any) => {
  const { id, onSplit, getStateById, state } = props;

  return (
    <Split>
      <Box
        sx={{ backgroundColor: "#292929" }}
        p={1}
        borderRadius="6px"
        onDoubleClick={() => onSplit(id)}
      >
        {id && <Typography>{state[id]?.name}</Typography>}
      </Box>
      {state[id]?.primaryId && (
        <DynamicSplitter
          id={state[id].primaryId}
          onSplit={onSplit}
          getStateById={getStateById}
          state={state}
        ></DynamicSplitter>
      )}
      {state[id]?.secondaryId && (
        <DynamicSplitter
          id={state[id].secondaryId}
          onSplit={onSplit}
          getStateById={getStateById}
          state={state}
        ></DynamicSplitter>
      )}
    </Split>
  );
};

export default Splitter;
