import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import NavBar from "../NavBar";

type Props = { children: any };

const WithNavbar = ({ children }: Props) => {
  return (
    <Box display={"flex"} gap={2}>
      <NavBar />
      <Box
        height={"calc(100vh - 100px)"}
        width="100%"
        sx={{ overflowY: "auto" }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default WithNavbar;
