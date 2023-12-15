import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";

import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

type Props = {};

const Numix = (props: Props) => {
  //TODO: Fetch existing Projects
  const [showMyMusic, setShowMyMusic] = useState(false);
  return (
    <Box>
      <Box
        m={4}
        height={200}
        width={200}
        display="flex"
        alignItems={"center"}
        justifyContent="center"
        border="0.5px solid #fff"
        borderRadius={8}
        onClick={() => setShowMyMusic(true)}
      >
        {/* <Stack alignItems={"center"} gap={2}>
        <AddIcon color="secondary" /> */}
        <Typography align="center">Create Project</Typography>
        {/* </Stack> */}
      </Box>
      <Dialog open={showMyMusic} onClose={() => setShowMyMusic(false)}>
        <DialogTitle>Choose your Music</DialogTitle>
        <DialogContent>
          <Box
            m={4}
            height={100}
            width={100}
            display="flex"
            alignItems={"center"}
            justifyContent="center"
            border="0.5px solid grey"
            borderRadius={4}
          >
            {/* <Stack alignItems={"center"} gap={2}>
        <AddIcon color="secondary" /> */}
            <Typography align="center">Goddess</Typography>
            {/* </Stack> */}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Numix;
