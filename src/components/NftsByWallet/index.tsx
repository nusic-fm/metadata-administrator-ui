/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import {
  Button,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import axios from "axios";
import Close from "@mui/icons-material/Close";
import { getNftsMetadataByWallet } from "../../utils/zora";
import { IZoraData } from "../../models/IZora";
import { ethers } from "ethers";
import { Web3Storage } from "web3.storage";
import { createUrlFromCid } from "../../utils/helper";
import { LoadingButton } from "@mui/lab";

type Props = {
  onConnect: () => void;
  onInsert?: (nft: IZoraData) => void;
  onClose?: () => void;
  tokenId: string;
};

const fileNameForWeb3 = "nusic-pfp.png";

const NftsByWallet = ({ onConnect, onClose, tokenId }: Props) => {
  const { account, library } = useWeb3React();
  const [tokens, setTokens] = useState<IZoraData[]>([]);
  // const [previewNft, setPreviewNft] = useState<SelectedNftDetails>(); //TODO
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [insertUrl, setInsertUrl] = useState<string>();
  const [isTxLoading, setIsTxLoading] = useState(false);

  const onInsert = async (url: string) => {
    setIsPreviewLoading(true);
    const res = await axios.post(
      `${import.meta.env.VITE_IMAGE_CONVERSION}/overlay?url=${url}`,
      {},
      { responseType: "arraybuffer" }
    );
    // let base64ImageString = Buffer.from(res.data, "binary").toString("base64");
    // setSelectedBase64(base64ImageString);
    const blob = new Blob([res.data], { type: "image/png" });
    const file = new File([blob], fileNameForWeb3, { type: "image/png" });
    setSelectedFile(file);
    setInsertUrl(URL.createObjectURL(file));
    setIsPreviewLoading(false);
  };

  const fetchAllNfts = async () => {
    // "0xA0cb079D354b66188f533A919d1c58cd67aFe398"
    if (!account) return;
    const _tokens = await getNftsMetadataByWallet(
      account
      // "0x1f3aECdD7b1c376863d08C5340B1E48Da2961539"
      // "0x8e374C4C9aeDd9B6ED16acc7b5e613510fBBEC84"
    );
    setTokens(_tokens);
  };

  const onInject = async () => {
    const nftContract = new ethers.Contract(
      import.meta.env.VITE_ALIVE_ADDRESS as string,
      [
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_tokenId",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "_tokenURI",
              type: "string",
            },
          ],
          name: "setTokenURI",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      library.getSigner()
    );
    if (selectedFile) {
      setIsTxLoading(true);
      const client = new Web3Storage({
        token: import.meta.env.VITE_WEB3_STORAGE as string,
      });
      const imageCid = await client.put([selectedFile]);
      const jsonFileName = "file.json";
      const _file = new File(
        [
          JSON.stringify({
            name: "NUSIC Alive Pass",
            description:
              "Priority access to the NUSIC decentralized streaming protocol for 1,000 members. Valid from 6/21/2023-6/20/2026.",
            external_link: "https://nusic.fm/",
            image: `https://ipfs.io/ipfs/${imageCid}/${fileNameForWeb3}`,
          }),
        ],
        jsonFileName
      );
      const jsonCid = await client.put([_file]);
      const tx = await nftContract.setTokenURI(
        tokenId,
        `https://ipfs.io/ipfs/${jsonCid}/${jsonFileName}`
      );
      await tx.wait();
      alert("Successfully Injected");
      setIsTxLoading(false);
    } else {
      alert("Select a pfp to inject");
    }
  };

  useEffect(() => {
    if (account) {
      fetchAllNfts();
    }
  }, [account]);

  return (
    <Box sx={{ bgcolor: "#0f0f0f" }} height="100vh" p={2}>
      <Box
        px={1}
        m={1}
        // borderBottom="1px solid gray"
        display={"flex"}
        justifyContent="space-between"
        alignItems={"center"}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Inject your pfp
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>
      <Box
        display={"flex"}
        gap={1}
        sx={{ overflowX: "auto" }}
        width={{ xs: 350, md: 600 }}
        mt={1}
      >
        {tokens.length === 0 && (
          <Typography color={"gray"} align="center" width={"100%"} my={5}>
            No NFTs found in your wallet
          </Typography>
        )}
        {tokens.map((nft, i) => (
          <Stack
            key={i}
            width={180}
            p={2}
            gap={1}
            // borderTop="1px solid #474747"
          >
            <Box>
              <Tooltip title={nft.name} placement="bottom-start">
                <Typography
                  fontWeight={900}
                  noWrap
                  variant="subtitle2"
                  color={"rgba(255,255,255,0.8)"}
                >
                  {nft.collectionName}
                </Typography>
              </Tooltip>
              {/* <Tooltip
                    title={`Token ID: ${nft.tokenId}`}
                    placement="bottom-start"
                  >
                    <Typography variant="body1" noWrap>
                      #{nft.tokenId}
                    </Typography>
                  </Tooltip> */}
            </Box>
            <Box
              display={"flex"}
              alignItems="center"
              justifyContent={"center"}
              width="100%"
              height={"100%"}
            >
              <img
                src={createUrlFromCid(nft.image?.url)}
                alt=""
                width={150}
                height={150}
                style={{ borderRadius: "10px", objectFit: "cover" }}
              ></img>
            </Box>
            <Box
              id="isnft"
              width={"100%"}
              display="flex"
              justifyContent={"center"}
              alignItems="center"
              gap={4}
              // mt={4}
            >
              {/* <Typography>is it a Music NFT?</Typography> */}
              <Button
                disabled={isPreviewLoading}
                variant="outlined"
                color="info"
                size="small"
                onClick={() => {
                  if (nft.image?.url) {
                    onInsert(createUrlFromCid(nft.image?.url));
                  }
                }}
              >
                Insert
              </Button>
            </Box>
          </Stack>
        ))}
      </Box>
      <Stack
        sx={{ bgcolor: "black" }}
        gap={2}
        px={4}
        py={2}
        mt={1}
        borderRadius="6px"
      >
        <Typography variant="subtitle1">Preview</Typography>
        {isPreviewLoading && <LinearProgress />}
        <Box display={"flex"} justifyContent="center" position={"relative"}>
          <Box width={{ xs: "100%", md: "400px" }}>
            {insertUrl ? (
              <img src={insertUrl} alt="" width={"100%"} />
            ) : (
              <img src="/alive/new_card.png" alt="" width={"100%"} />
            )}
          </Box>
        </Box>
        <Box display={"flex"} justifyContent="center">
          <LoadingButton
            loading={isTxLoading}
            variant="contained"
            disabled={isPreviewLoading}
            onClick={onInject}
          >
            Inject
          </LoadingButton>
        </Box>
      </Stack>
    </Box>
  );
};

export default NftsByWallet;
