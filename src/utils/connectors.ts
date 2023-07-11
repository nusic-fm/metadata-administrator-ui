import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";

export const CoinbaseWallet = new WalletLinkConnector({
  url: import.meta.env.VITE_RPC,
  appName: "NUSIC",
  supportedChainIds: [Number(import.meta.env.VITE_CHAIN_ID)],
});

export const WalletConnect = new WalletConnectConnector({
  rpc: import.meta.env.VITE_RPC,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});

export const Injected = new InjectedConnector({
  supportedChainIds: [Number(import.meta.env.VITE_CHAIN_ID)],
});
