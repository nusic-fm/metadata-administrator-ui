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
      <Route path="alive-pass" element={<AlivePass />} />
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
