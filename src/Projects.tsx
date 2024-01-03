import { Chip, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { collection } from "firebase/firestore";
import { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Numix from "./components/Numix";
import { db } from "./services/firebase.service";

type Props = {};

const Projects = (props: Props) => {
  const [values, loading, error] = useCollectionData(
    collection(db, "projects")
  );
  const [selectedProjectId, setSelectedProjectId] = useState();

  if (selectedProjectId) {
    return <Numix projectId={selectedProjectId} />;
  }
  return (
    <Stack gap={2} px={4}>
      <Typography>Annotations</Typography>
      <Box display={"flex"} gap={2}>
        {values?.map((v) => (
          <Chip
            sx={{ p: 4 }}
            label={v.id}
            key={v.id}
            clickable
            onClick={() => setSelectedProjectId(v.id)}
          />
          //   <Box key={v.id} p={6} border="1px solid gray" borderRadius={8}>
          //     <Typography>{v.id}</Typography>
          //   </Box>
        ))}
      </Box>
    </Stack>
  );
};

export default Projects;
