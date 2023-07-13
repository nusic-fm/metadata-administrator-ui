import { Box, Button, Chip, Tooltip } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { Outlet, useNavigate } from "react-router-dom";
import WithNavbar from "../WithNavBar";

type Props = {};

const Header = (props: Props) => {
  const { account, deactivate } = useWeb3React();
  const navigate = useNavigate();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" p={2}>
        <img
          src="/nusic_white.png"
          alt="nusic"
          width={"100px"}
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        />
        {account ? (
          <Tooltip title={account}>
            <Chip
              onClick={() => deactivate()}
              clickable
              label={`${account.slice(0, 8)}...${account.slice(
                account.length - 4
              )}`}
            />
          </Tooltip>
        ) : (
          <Button variant="contained" onClick={() => {}}>
            Connect Wallet
          </Button>
        )}
      </Box>
      <WithNavbar>
        <Outlet />
      </WithNavbar>
    </Box>
  );
};

export default Header;
