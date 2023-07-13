// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @next/next/no-img-element */
import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { createUrlFromCid } from "./utils/helper";
import { getNftsMetadataByWallet } from "./utils/zora";
import { IZoraData } from "./models/IZora";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import { IAliveUserDoc } from "./models/IUser";
import {
  getOrCreateUserDoc,
  updateUserDoc,
} from "../src/services/db/user.service";
import NftsByWallet from "./components/NftsByWallet";
import { LoadingButton } from "@mui/lab";
import NftMusicCard from "../src/components/NftMusicCard";
import BottomPlayer from "./components/BottomPlayer";
import CloseIcon from "@mui/icons-material/Close";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { getSpecificNftsByWallet } from "./utils/moralis";

type Props = {};

const AlivePass = (props: Props) => {
  const { account, activate, library } = useWeb3React();
  //   const [tokens, setTokens] = useState<MoralisNftData[]>([]);

  const [musicNfts, setMusicNfts] = useState<IZoraData[]>([]);
  const [nfts, setNfts] = useState<IZoraData[]>([]);
  const { playing, togglePlayPause, isReady } = useGlobalAudioPlayer();
  const [playIndex, setPlayIndex] = useState<number>(-1);
  const [userDoc, setUserDoc] = useState<IAliveUserDoc>();
  const [changedName, setChangedName] = useState<string>();
  const [changedBio, setChangedBio] = useState<string>();
  const [changedPfp, setChangedPfp] = useState<string>();
  const [updating, setUpdating] = useState<boolean>();
  const [tokenId, setTokenId] = useState<string>("");
  const [isEditProfile, setIsEditProfile] = useState(false);

  const [aliveTokensBalance, setAliveTokensBalance] = useState<number>(0);

  const [showSetPfp, setShowSetPfp] = useState(false);

  const [showNftsDrawer, setShowNftsDrawer] = useState<boolean>();
  const [ownedTokenIds, setOwnedTokenIds] = useState<string[]>([]);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    if (showNftsDrawer) {
      document.getElementsByTagName("html")[0].style.overflow = "scroll";
    } else {
      document.getElementsByTagName("html")[0].style.overflow = "auto";
    }
  }, [showNftsDrawer]);

  // useEffect(() => {
  //   if (playIndex !== -1) {
  //     load({
  //       src: musicNfts[playIndex].content?.mediaEncoding?.large,
  //       html5: true,
  //       autoplay: true,
  //       format: ["mp3"],
  //     });
  //   } else {
  //     pause();
  //   }
  // }, [playIndex]);

  // const alivePassOwner = async (account: string) => {
  //   const nftContract = new ethers.Contract(
  //     import.meta.env.VITE_ALIVE_ADDRESS as string,
  //     [
  //       {
  //         inputs: [
  //           {
  //             internalType: "address",
  //             name: "owner",
  //             type: "address",
  //           },
  //         ],
  //         name: "balanceOf",
  //         outputs: [
  //           {
  //             internalType: "uint256",
  //             name: "",
  //             type: "uint256",
  //           },
  //         ],
  //         stateMutability: "view",
  //         type: "function",
  //       },
  //     ],
  //     library.getSigner()
  //   );
  //   const bn = await nftContract.balanceOf(account);
  //   if (Number(bn)) {
  //     setShowConnector(false);
  //     setAuthLoading(false);
  //     setAliveTokensBalance(Number(bn));
  //     //   fetcMusicNfts();
  //     //   fetchNfts();
  //     fetchUserDoc(account);
  //     fetchAllNfts();
  //   } else {
  //     setShowError(true);
  //   }
  // };

  useEffect(() => {
    if (account) {
      fetchUserDoc(account);
      fetchAllNfts();
    }
  }, [account]);

  //   const fetcMusicNfts = async () => {
  //     const _musicTokens = await getMusicNftsMetadataByWallet(
  //       "0xA0cb079D354b66188f533A919d1c58cd67aFe398"
  //     );
  //     setMusicNfts(_musicTokens);
  //   };
  const fetchUserDoc = async (walletAddress: string) => {
    const _userDoc = await getOrCreateUserDoc(walletAddress);
    setUserDoc(_userDoc);
  };

  const fetchAllNfts = async () => {
    // "0xA0cb079D354b66188f533A919d1c58cd67aFe398"
    if (!account) return;
    setPageLoading(true);
    const _allTokens = await getNftsMetadataByWallet(
      account
      // "0xA0cb079D354b66188f533A919d1c58cd67aFe398"
      // "0x1f3aECdD7b1c376863d08C5340B1E48Da2961539"
    );
    const _musicNfts: IZoraData[] = [];
    const _nfts: IZoraData[] = [];
    _allTokens.map((t) => {
      if (t.metadata?.animation_url) {
        _musicNfts.push(t);
      } else {
        _nfts.push(t);
      }
    });
    setMusicNfts(_musicNfts);
    setNfts(_nfts);
    // const alivePassIndex = _token.findIndex(
    //   (v) => v.collectionAddress === import.meta.env.NEXT_PUBLIC_ETH_ALIVE_ADDRESS
    // );
    // if (alivePassIndex !== -1) setTokenId(_token[alivePassIndex].tokenId);
    const nfts = await getSpecificNftsByWallet(account);
    const _tokenIds = nfts.map((nft: any) => nft.token_id);
    setTokenId(_tokenIds[0]);
    setOwnedTokenIds(_tokenIds);
    setPageLoading(false);
  };

  // const onSignInUsingWallet = async (
  //   connector: WalletConnectConnector | WalletLinkConnector | InjectedConnector
  // ) => {
  //   await checkAndSwitchConnection();
  //   activate(connector, async (e) => {
  //     if (e.name === "t" || e.name === "UnsupportedChainIdError") {
  //       // setSnackbarMessage("Please switch to Ethereum Mainnet");
  //     } else {
  //       // setSnackbarMessage(e.message);
  //     }
  //     setAuthLoading(false);
  //     console.log(e.name, e.message);
  //   });
  // };

  // const checkAutoLogin = async () => {
  //   if (!(window as any).ethereum) return;
  //   const provider = new Web3Provider((window as any).ethereum);
  //   const accounts = await provider.listAccounts();
  //   if (accounts.length) {
  //     const eth = (window as any).ethereum;
  //     if (eth.isMetaMask) {
  //       onSignInUsingWallet(Injected);
  //     } else if (eth.isCoinbaseBrowser) {
  //       onSignInUsingWallet(CoinbaseWallet);
  //     }
  //   } else {
  //     setAuthLoading(false);
  //   }
  // };

  // const onInsert = async (nft: SelectedNftDetails | MoralisNftData) => {
  //   // setIsLoading(true);
  //   const url = nft.artworkUrl;
  //   const res = await axios.post(
  //     `https://nusic-image-conversion-ynfarb57wa-uc.a.run.app/overlay?url=${url}`, //TODO
  //     {},
  //     { responseType: "arraybuffer" }
  //   );
  //   let base64ImageString = Buffer.from(res.data, "binary").toString("base64");
  //   let srcValue = "data:image/png;base64," + base64ImageString;
  //   // setImageFromServer(srcValue);
  //   // setIsLoading(false);
  // };

  const onUpdateUserDoc = async (obj: {
    bio?: string;
    userName?: string;
    pfp?: string;
  }) => {
    if (account) {
      setUpdating(true);
      await updateUserDoc(account, obj);
      await fetchUserDoc(account);
      setChangedName(undefined);
      setChangedBio(undefined);
      setChangedPfp(undefined);
      setUpdating(false);
      setIsEditProfile(false);
    }
  };

  return (
    <Box py={4} position="relative" mb={"130px"}>
      <Box
        display={"flex"}
        justifyContent="space-between"
        alignItems={"center"}
        px={4}
      >
        <Typography variant="h5" fontFamily={"Roboto"}>
          Profile
        </Typography>
        {/* <img src="nusic_purple.png" alt="" width={100} /> */}
        {/* <Button onClick={}>Logout</Button> */}
      </Box>
      <Grid container>
        <Grid item xs={12} md={4}>
          <Stack gap={2} p={2}>
            <Stack
              m={2}
              p={4}
              alignItems="center"
              gap={2}
              sx={{ backgroundColor: "#141414" }}
              borderRadius="8px"
              position={"relative"}
            >
              <Box
                position={"absolute"}
                width="100%"
                height={100}
                display={"flex"}
                alignItems="center"
                justifyContent="end"
                px={2}
              >
                <Box sx={{ bgcolor: "#262626" }} borderRadius="50%">
                  <IconButton
                    onClick={() => setIsEditProfile(true)}
                    disabled={isEditProfile}
                  >
                    <SettingsOutlinedIcon
                      fontSize="small"
                      sx={{ opacity: "0.7" }}
                    />
                  </IconButton>
                </Box>
              </Box>
              <Box
                borderRadius={"50%"}
                sx={{
                  background:
                    changedPfp || userDoc?.pfp
                      ? `url(${changedPfp || userDoc?.pfp})`
                      : "rgba(255,255,255,0.1)",
                  backgroundSize: "cover",
                  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                }}
                border="2px solid #A3A3A3"
                p={1}
                width={100}
                height={100}
                position="relative"
              >
                <Box
                  position={"absolute"}
                  left={0}
                  top={0}
                  width="100%"
                  height="100%"
                  display={"flex"}
                  justifyContent="center"
                  alignItems={"center"}
                  sx={{
                    ".select": { display: isEditProfile ? "initial" : "none" },
                    // ":hover": {
                    //   ".select": {
                    //     display: isEditProfile ? "initial" : "none",
                    //   },
                    // },
                  }}
                >
                  <Button
                    className="select"
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => setShowSetPfp(true)}
                  >
                    Select
                  </Button>
                </Box>{" "}
              </Box>
              {isEditProfile ? (
                <TextField
                  size="small"
                  placeholder="username"
                  defaultValue={userDoc?.userName}
                  value={changedName}
                  onChange={(e) => setChangedName(e.target.value)}
                />
              ) : (
                <Typography>{userDoc?.userName || "User"}</Typography>
              )}
              {account && (
                <Chip
                  label={`${account.slice(0, 6)}...${account.slice(
                    account.length - 4
                  )}`}
                />
              )}
              <Stack width={"100%"} gap={1} my={2}>
                <Typography variant="h6">Bio</Typography>
                {isEditProfile ? (
                  <TextField
                    multiline
                    defaultValue={userDoc?.bio}
                    value={changedBio}
                    onChange={(e) => setChangedBio(e.target.value)}
                    minRows={3}
                    maxRows={8}
                  />
                ) : (
                  <Typography variant="body2">
                    {userDoc?.bio || "User's bio"}
                  </Typography>
                )}
              </Stack>
              {isEditProfile && (
                <Box display={"flex"} justifyContent="center" gap={2}>
                  <LoadingButton
                    loading={updating}
                    variant="contained"
                    color="info"
                    size="small"
                    disabled={!changedBio && !changedName && !changedPfp}
                    onClick={() => {
                      const saveObj: {
                        userName?: string;
                        bio?: string;
                        pfp?: string;
                      } = {};
                      if (changedName) {
                        saveObj.userName = changedName;
                      }
                      if (changedBio) {
                        saveObj.bio = changedBio;
                      }
                      if (changedPfp) {
                        saveObj.pfp = changedPfp;
                      }
                      onUpdateUserDoc(saveObj);
                    }}
                  >
                    Save
                  </LoadingButton>
                  <Button
                    size="small"
                    color="info"
                    onClick={() => setIsEditProfile(false)}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Stack>
            <Box m={2}>
              <Box
                display={"flex"}
                alignItems={"center"}
                flexWrap="wrap"
                width={"100%"}
                gap={1}
              >
                <Typography variant="h6">Alive Pass #{tokenId}</Typography>
                {ownedTokenIds.length > 1 && (
                  <FormControl sx={{ width: "80px", ml: "auto" }} color="info">
                    <InputLabel id="demo-simple-select-label">
                      Tokens
                    </InputLabel>
                    <Select
                      label="Tokens"
                      color="info"
                      onChange={(e) => setTokenId(e.target.value as string)}
                      value={tokenId}
                      size="small"
                    >
                      {ownedTokenIds.map((t) => (
                        <MenuItem key={t} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                <LoadingButton
                  sx={{ ml: "auto" }}
                  loading={pageLoading}
                  variant="outlined"
                  size="small"
                  color="info"
                  onClick={() => setShowNftsDrawer(true)}
                >
                  Inject PFP
                </LoadingButton>
              </Box>
              <Box display={"flex"} justifyContent="center" my={4}>
                <img src="/alive/new_card.png" alt="" width={"80%"} />
              </Box>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography sx={{ m: 2 }} variant="h6">
            My Music NFTs
          </Typography>
          <Box
            display={"flex"}
            gap={2}
            sx={{ overflowX: "auto" }}
            width={"100%"}
          >
            {musicNfts.length === 0 && (
              <Typography align="center" px={2} mb={2} color="gray">
                No Music NFTs found
              </Typography>
            )}
            {musicNfts.map((musicNft, i) => (
              <NftMusicCard
                key={i}
                i={i}
                loading={!isReady}
                nft={musicNft}
                playIndex={playIndex}
                playing={playing}
                setPlayIndex={setPlayIndex}
                togglePlayPause={togglePlayPause}
              />
            ))}
          </Box>
          <Divider />
          <Typography variant="h6" sx={{ m: 2 }}>
            Other NFTs
          </Typography>
          <Box
            display={"flex"}
            // flexWrap="wrap"
            gap={2}
            sx={{ overflowX: "auto" }}
          >
            {nfts.length === 0 && (
              <Typography align="center" px={2} mb={2} color="gray">
                No NFTs found
              </Typography>
            )}
            {nfts.map((nft, i) => (
              <Box
                key={i}
                width={180}
                sx={{
                  background: `url(${createUrlFromCid(nft.image?.url)})`,
                  backgroundSize: "cover",
                }}
                borderRadius="15px"
              >
                <Stack
                  width={180}
                  height={180}
                  justifyContent="end"
                  alignItems={"center"}
                  position="relative"
                >
                  <Box
                    display={"flex"}
                    mb={0.5}
                    p={0.2}
                    px={1}
                    sx={{ background: "rgba(0,0,0,0.8)", borderRadius: "6px" }}
                    alignItems="center"
                    justifyContent={"space-between"}
                    gap={2}
                    maxWidth="90%"
                  >
                    <Tooltip title={nft.collectionName}>
                      <Typography
                        variant="caption"
                        noWrap
                        fontWeight={900}
                        fontSize={"10px"}
                      >
                        {nft.collectionName}
                      </Typography>
                    </Tooltip>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
      {/* <WalletConnectors
        isLoading={authLoading}
        onClose={() => setShowConnector(false)}
        onSignInUsingWallet={onSignInUsingWallet}
        open={showConnector}
        showError={showError}
      /> */}
      <Drawer
        anchor={"right"}
        hideBackdrop
        open={showNftsDrawer}
        onClose={() => setShowNftsDrawer(false)}
        sx={{ background: "rgba(0,0,0,0.8)" }}
      >
        <NftsByWallet
          onConnect={() => {}}
          tokenId={tokenId}
          // onInsert={(nft: any) => {}}
          onClose={() => {
            setShowNftsDrawer(false);
          }}
        />
      </Drawer>
      <Dialog
        open={showSetPfp}
        onClose={() => setShowSetPfp(false)}
        fullWidth
        sx={{ background: "rgba(0,0,0,0.8)" }}
      >
        <DialogTitle>
          <Typography>Select NUSIC pfp from your collections</Typography>
          <IconButton
            onClick={() => setShowSetPfp(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box display={"flex"} gap={1} sx={{ overflowX: "auto" }} py={4}>
            {[...musicNfts, ...nfts].length === 0 && (
              <Typography color="gray">No Music NFTs found</Typography>
            )}
            {[...musicNfts, ...nfts].map((mf) => (
              <Stack key={`${mf.collectionAddress}-${mf.tokenId}`}>
                <Box
                  display={"flex"}
                  alignItems="center"
                  justifyContent={"center"}
                  width="100%"
                  height={"100%"}
                >
                  <img
                    src={createUrlFromCid(mf.image?.url)}
                    alt=""
                    width={150}
                    height={150}
                    style={{ borderRadius: "2px", objectFit: "cover" }}
                  ></img>
                </Box>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    setChangedPfp(createUrlFromCid(mf.image?.url));
                    setShowSetPfp(false);
                  }}
                  size="small"
                >
                  Select
                </Button>
              </Stack>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
      {playIndex !== -1 && playIndex < musicNfts.length && (
        <Box position={"fixed"} bottom={0} left={0} zIndex={9999} width="100%">
          <BottomPlayer
            songs={musicNfts}
            songIndexProps={[playIndex, setPlayIndex]}
          />
        </Box>
      )}
    </Box>
  );
};

export default AlivePass;
// export default {};
