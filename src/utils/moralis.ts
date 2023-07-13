import axios from "axios";

export const getSpecificNftsByWallet = async (wallet: string) => {
  const chain = import.meta.env.VITE_CHAIN_ID == "80001" ? "mumbai" : "eth";
  const url = `https://deep-index.moralis.io/api/v2/${wallet}/nft?chain=${chain}&format=decimal&token_addresses%5B0%5D=${
    import.meta.env.VITE_ALIVE_ADDRESS
  }&media_items=false`;

  try {
    const res = await axios.get(url, {
      headers: {
        accept: "application/json",
        "X-API-KEY": import.meta.env.VITE_MORALIS_API,
      },
    });
    return res.data.result;
  } catch (e) {
    console.log(e);
    return [];
  }
};
