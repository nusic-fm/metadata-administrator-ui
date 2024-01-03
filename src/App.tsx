import AlivePass from "./AlivePass";
import { Box } from "@mui/material";
import Header from "./components/Header";
import Metadata from "./Metadata";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import StemSeperation from "./StemSeperation";
import Projects from "./Projects";
// import WithTokenGate from "./components/WithTokenGate";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        // <WithTokenGate>
        <Header />
        // </WithTokenGate>
      }
    >
      <Route index element={<Metadata />} />
      <Route path="projects" element={<Projects />} />
      <Route path="alive-pass" element={<AlivePass />} />
      <Route path="stem-separation" element={<StemSeperation />} />
    </Route>
  )
);

const App = () => {
  return (
    <Box sx={{ bgcolor: "background.paper", minHeight: "100vh" }}>
      <RouterProvider router={router} />
    </Box>
  );
};

export default App;
