import { Web3Provider } from "@ethersproject/providers";
import { Box } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Injected, CoinbaseWallet } from "../../utils/connectors";
import { checkAndSwitchConnection } from "../../utils/helper";
import WalletConnectors from "../Modals/WalletConnector";

type Props = { children: any };

function WithTokenGate({ children }: Props) {
  const { account, library, activate } = useWeb3React();
  const [authLoading, setAuthLoading] = useState(true);
  const [showConnector, setShowConnector] = useState(false);
  const [showError, setShowError] = useState<boolean>();

  const checkAutoLogin = async () => {
    if (!(window as any).ethereum) return;
    const provider = new Web3Provider((window as any).ethereum);
    const accounts = await provider.listAccounts();
    if (accounts.length) {
      const eth = (window as any).ethereum;
      if (eth.isMetaMask) {
        onSignInUsingWallet(Injected);
      } else if (eth.isCoinbaseBrowser) {
        onSignInUsingWallet(CoinbaseWallet);
      }
    } else {
      setAuthLoading(false);
    }
  };

  const alivePassOwner = async (account: string) => {
    const nftContract = new ethers.Contract(
      import.meta.env.VITE_ALIVE_ADDRESS as string,
      [
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      library.getSigner()
    );
    const bn = await nftContract.balanceOf(account);
    if (Number(bn)) {
      setShowConnector(false);
      setAuthLoading(false);
      //   setAliveTokensBalance(Number(bn));
    } else {
      setShowError(true);
    }
  };

  const onSignInUsingWallet = async (
    connector: WalletConnectConnector | WalletLinkConnector | InjectedConnector
  ) => {
    await checkAndSwitchConnection();
    activate(connector, async (e) => {
      if (e.name === "t" || e.name === "UnsupportedChainIdError") {
        // setSnackbarMessage("Please switch to Ethereum Mainnet");
      } else {
        // setSnackbarMessage(e.message);
      }
      setAuthLoading(false);
      console.log(e.name, e.message);
    });
  };

  useEffect(() => {
    if (account) {
      alivePassOwner(account);
    } else {
      // setAuthLoading(true);
      setShowConnector(true);
      checkAutoLogin();
    }
  }, [account]);

  return (
    <Box>
      <WalletConnectors
        isLoading={authLoading}
        onClose={() => setShowConnector(false)}
        onSignInUsingWallet={onSignInUsingWallet}
        open={showConnector}
        showError={showError}
      />
      {account && children}
    </Box>
  );
}

export default WithTokenGate;
