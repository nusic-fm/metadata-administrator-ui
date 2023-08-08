/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
// import WaveForm from "./components/WaveForm/old";
import AcceptStems from "./components/Dropzone";
import { useDropzone } from "react-dropzone";
import TransactionDialog from "./components/TransactionDialog";
import { Web3Storage } from "web3.storage";
// import { useNavigate } from "react-router-dom";
import ArtistMetadataTab, {
  ArtistMetadataObj,
} from "./components/ArtistMetadataTab";
import SongMetadataTab, { SongMetadataObj } from "./components/SongMetadataTab";
import ProofOfCreationTab, {
  ProofOfCreationMetadataObj,
} from "./components/ProofOfCreationTab";
import useSaveChanges from "./hooks/useSaveChanges";
import dayjs from "dayjs";
import WaveForm from "./components/WaveForm";
import { ethers } from "ethers";
import FactoryAbi from "./abi/NusicMetadataFactory.json";
import { useWeb3React } from "@web3-react/core";
import ArtistMetadataAbi from "./abi/NusicMetadata.json";
import { LoadingButton } from "@mui/lab";
import NftInfoModule from "./components/NftInfoModule";
import { IZoraNftMetadata } from "./models/IZora";
import { createUrlFromCid, fetchAndConvertToBlob } from "./utils/helper";
import { getOrCreateUserDoc, updateUserDoc } from "./services/db/user.service";
import { IAliveUserDoc } from "./models/IUser";
import { CreditsRow } from "./components/CreditsRows";

const StemTypes = ["Vocal", "Instrumental", "Bass", "Drums"];

type Stem = { file: File; name: string; type: string };
type StemsObj = {
  [key: string]: Stem;
};
type Section = {
  name: string;
  start: number;
  end: number;
  bars: number;
  id: number;
  totalBars: number;
};
export type SectionsObj = {
  [internalId: string]: Section;
};

const getWithoutSpace = (str: string) => str?.split(" ").join("");

function Metadata() {
  const [artistMetadataObj, setArtistMetadataObj] = useState<ArtistMetadataObj>(
    {
      artist: "",
      featuredArtists: [],
      credits: { 1: {} },
      masterOwnerships: { 1: {} },
      compositionOwnerships: { 1: {} },
    }
  );
  const [songMetadataObj, setSongMetadataObj] = useState<SongMetadataObj>({
    title: "",
    album: "",
    projectType: "",
    genrePrimary: [],
    genreSecondary: [],
    subGenre: [],
    songMoods: [],
    songType: "",
    key: "",
    isrcCode: "",
    upcCode: "",
    recordLabel: "",
    distributor: "",
    additionalCreationRow: false,
    lyrics: "",
    language: "",
    explicitLyrics: false,
    locationOfCreation: { 1: {}, 2: {} },
  });
  const [proofOfCreationMetadataObj, setProofOfCreationMetadataObj] =
    useState<ProofOfCreationMetadataObj>({
      startBeatOffsetMs: 0,
      timeSignature: "",
      noOfBeatsPerBar: 0,
    });
  const [isLocallySaving, setIsLocallySaving] = useState(false);
  const [isStartListening, setIsStartListening] = useState(false);

  const [cid, setCid] = useState<string>();
  const [sectionsObj, setSectionsObj] = useState<SectionsObj>({});
  const [stemsObj, setStemsObj] = useState<StemsObj>({});

  // const getSelectedBeatOffet = useRef(null);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const [activeTxStep, setActiveTxStep] = useState<number>(0);
  const [isTxDialogOpen, setIsTxDialogOpen] = useState<boolean>(false);
  // const [isEncryptFiles, setIsEncryptFiles] = useState<boolean>(false);

  const [fullTrackHash, setFullTrackHash] = useState<string>();
  const [stemsHash, setStemsHash] = useState<string[]>([]);
  const [sectionsHash, setSectionsHash] = useState<string[]>([]);

  // const [userAddress, setUserAddress] = useState<string>();
  // const navigate = useNavigate();
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(1);
  const [draftAvailable, setDraftAvailable] = useState(false);
  // const [artistMetadataAddress, setArtistMetadataAddress] = useState<string>();
  const [deployingContract, setDeployingContract] = useState(false);
  const [nftAddress, setNftAddress] = useState<string>("");
  const [tokenId, setTokenId] = useState<string>("");
  const [nftMetadata, setNftMetadata] = useState<IZoraNftMetadata>();
  const [userDoc, setUserDoc] = useState<IAliveUserDoc>();

  const { account, library } = useWeb3React();

  const { getFromLocalStorage } = useSaveChanges(
    {
      nftAddress,
      tokenId,
      artistMetadataObj,
      songMetadataObj,
    },
    isStartListening,
    setIsLocallySaving
  );

  const findArtistContract = async (_account: string) => {
    const factoryContract = new ethers.Contract(
      import.meta.env.VITE_ARTIST_FACTORY_ADDRESS,
      FactoryAbi.abi,
      library.getSigner()
    );
    const bn = await factoryContract.getMetadataContract(_account);
    const metadataAddress = bn.toString();
    if (metadataAddress === "0x0000000000000000000000000000000000000000") {
    } else {
      //TODO
      await updateUserDoc(_account, {
        artistContract: metadataAddress,
      });
      await fetchUserDoc(_account);
      // setArtistMetadataAddress(metadataAddress);
    }
  };

  const deployArtistMetadataContract = async (_account: string) => {
    setDeployingContract(true);
    const factoryContract = new ethers.Contract(
      import.meta.env.VITE_ARTIST_FACTORY_ADDRESS,
      FactoryAbi.abi,
      library.getSigner()
    );
    const tx = await factoryContract.setupMetadataForArtist("Test", _account);
    await tx.wait();
    findArtistContract(_account);
    setDeployingContract(false);
    alert("Success");
  };

  const fetchUserDoc = async (walletAddress: string) => {
    const _userDoc = await getOrCreateUserDoc(walletAddress);
    setUserDoc(_userDoc);
  };

  useEffect(() => {
    const obj = getFromLocalStorage();
    if (obj) {
      setDraftAvailable(true);
    }
  }, []);

  useEffect(() => {
    if (account) {
      fetchUserDoc(account);
      // findArtistContract(account);
    }
  }, [account]);

  useEffect(() => {
    if (acceptedFiles.length) {
      const obj = {} as StemsObj;
      acceptedFiles.map((acceptedFile, i) => {
        obj[i] = {
          file: acceptedFile,
          name: acceptedFile.name,
          type: StemTypes[i] || "",
        };
        return "";
      });
      setStemsObj(obj);
    }
  }, [acceptedFiles]);

  useEffect(() => {
    const { duration, bpm, timeSignature, startBeatOffsetMs } =
      proofOfCreationMetadataObj;
    if (duration && bpm && timeSignature?.length === 3) {
      const beatsPerSecond = bpm / 60;
      const totalNoOfBeats =
        beatsPerSecond * (duration - startBeatOffsetMs / 1000);
      // setNoOfBeats(totalNoOfBeats);
      const noOfBeatsPerBar = parseFloat(timeSignature.split("/")[0]);
      // setNoOfBeatsPerBar(noOfBeatsPerBar);
      const noOfMeasures = Math.floor(totalNoOfBeats / noOfBeatsPerBar);
      // setNoOfBars(noOfMeasures);
      const durationOfEachBar = duration / noOfMeasures;
      // setDurationOfEachBarInSec(durationOfEachBar);
      setProofOfCreationMetadataObj({
        ...proofOfCreationMetadataObj,
        noOfBeats: totalNoOfBeats,
        noOfBeatsPerBar,
        noOfBars: noOfMeasures,
        durationOfEachBarInSec: durationOfEachBar,
      });
    }
  }, [
    proofOfCreationMetadataObj.duration,
    proofOfCreationMetadataObj.bpm,
    proofOfCreationMetadataObj.timeSignature,
    proofOfCreationMetadataObj.startBeatOffsetMs,
  ]);

  const onFetchStartBeatOffet = async () => {
    if (proofOfCreationMetadataObj.fileUrl) {
      const time = document.getElementsByTagName("audio")[0]?.currentTime;
      setProofOfCreationMetadataObj({
        ...proofOfCreationMetadataObj,
        startBeatOffsetMs: Math.floor(time * 1000),
      });
    }
  };

  const download = (content: any, fileName: string, contentType: string) => {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  };

  const processTx = async () => {
    const {
      artist,
      featuredArtists,
      credits,
      masterOwnerships,
      compositionOwnerships,
    } = artistMetadataObj;

    const {
      album,
      dateCreated,
      distributor,
      explicitLyrics,
      genrePrimary,
      genreSecondary,
      isrcCode,
      key,
      language,
      lyrics,
      projectType,
      recordLabel,
      songMoods,
      songType,
      subGenre,
      title,
      upcCode,
    } = songMetadataObj;

    const {
      bpm,
      duration,
      startBeatOffsetMs,
      timeSignature,
      noOfBars,
      noOfBeats,
      noOfBeatsPerBar,
    } = proofOfCreationMetadataObj;

    const titleWithoutSpace = getWithoutSpace(title as string)?.slice(0, 10);
    const genrePrimaryWithoutSpace = getWithoutSpace(genrePrimary[0]);

    const fullTrackContent = {
      id: `fulltrack${titleWithoutSpace}${genrePrimaryWithoutSpace}${key}${bpm}`,
      cid,
      artist,
      featuredArtists,
      title,
      album,
      projectType,
      genrePrimary,
      genreSecondary,
      subGenre,
      songMoods,
      songType,
      key,
      duration,
      startBeatOffsetMs: startBeatOffsetMs.toString(),
      bpm,
      timeSignature,
      noOfBars,
      noOfBeats,
      isrcCode,
      upcCode,
      recordLabel,
      distributor,
      dateCreated: dateCreated?.toJSON(),
      credits,
      masterOwnerships,
      compositionOwnerships,
      lyrics,
      language,
      explicitLyrics,
      sections: Object.keys(sectionsObj).length,
      stems: Object.keys(stemsObj).length,
    };

    // Stems
    const stems = Object.values(stemsObj);
    const stemsContent = [];
    // const broadCastStemsMsgs = [];
    if (stems.length) {
      for (let i = 0; i < stems.length; i++) {
        const stemObj = stems[i];
        stemsContent.push({
          id: `stem${
            i + 1
          }${titleWithoutSpace}${genrePrimaryWithoutSpace}${key}${bpm}`,
          cid,
          name: stemObj.name,
          type: stemObj.type,
        });
      }
    }

    // Section
    const sections = Object.values(sectionsObj);
    const sectionsContent = [];
    if (sections.length) {
      const broadCastSectionsMsgs = [];
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        sectionsContent.push({
          id: `section${
            i + 1
          }${titleWithoutSpace}${genrePrimaryWithoutSpace}${key}${bpm}`,
          name: section.name,
          startMs: section.start * 1000,
          endMs: section.end * 1000,
          bars: section.bars,
          beats: section.bars * noOfBeatsPerBar,
        });
      }
    }
    setActiveTxStep(2);
    const client = new Web3Storage({
      token: import.meta.env.VITE_WEB3_STORAGE as string,
    });
    const metadataFile = new File(
      [
        JSON.stringify({
          fullTrackContent,
          stemsContent,
          sectionsContent,
        }),
      ],
      "metadata.json",
      { type: "application/json" }
    );
    const ipfsCid = await client.put([metadataFile]);
    // const ipfsCid =
    //   "bafybeibctdasolo4773kquf6oxfqcmw2xpmr2mplizzbooidwcocspxvsm";
    if (userDoc?.artistContract) {
      const metadataContract = new ethers.Contract(
        userDoc.artistContract,
        ArtistMetadataAbi.abi,
        library.getSigner()
      );
      const tx = await metadataContract.publishMetadata(
        ipfsCid,
        "0x91cb12fb7a1678b6cdc1b18ef8d5ec0d7697c4a0",
        "1"
      );
      await tx.wait(tx.confirmations);
      setActiveTxStep(3);
      alert("successful");
    }
    download(
      JSON.stringify({
        fullTrackContent,
        stemsContent,
        sectionsContent,
        ipfsCid,
        // fullTrackId: parentFullTrackId,
      }),
      `NUSIC-${titleWithoutSpace}-metadata.json`,
      "text/plain"
    );
  };

  const onTxClick = async () => {
    const storeFiles = !Boolean(import.meta.env.VITE_IGNORE_STORAGE);
    // const { fullTrackFile } = proofOfCreationMetadataObj;
    if (!proofOfCreationMetadataObj.fileUrl) {
      alert("Audio is missing");
      return;
    }
    const fileObj = await fetchAndConvertToBlob(
      proofOfCreationMetadataObj.fileUrl
    );
    // if (!fileObj) {
    //   alert("Upload Full Track.");
    //   return;
    // } else
    if (acceptedFiles.length === 0) {
      // alert("Submit PoC/stem files");
      // return;
    }
    setIsTxDialogOpen(true);
    const stemFiles: File[] = Object.values(stemsObj).map((obj) => obj.file);
    const allFiles = [fileObj, ...stemFiles];
    let finalFiles;
    if (storeFiles) {
      finalFiles = allFiles;
      const client = new Web3Storage({
        token: import.meta.env.VITE_WEB3_STORAGE as string,
      });
      const cid = await client.put(finalFiles);
      setCid(cid);
    }
    //  else {
    //   setCid("test_cid_here");
    // }
    setActiveTxStep(1);
    processTx();
  };
  // useEffect(() => {
  //   if (cid) {
  //     processTx();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [cid]);

  const onTxDialogClose = () => {
    setIsTxDialogOpen(false);
    // navigate("/");
    window.location.reload();
  };
  const onMetdataFetch = async (
    obj: IZoraNftMetadata,
    credits?: {
      account: string;
      percentAllocation: number;
    }[]
  ) => {
    setNftMetadata(obj);
    const url = createUrlFromCid(obj.content?.url);
    // const duration = await getAudioDuration(url);
    // const fileObj = await fetchAndConvertToBlob(url);
    setProofOfCreationMetadataObj({
      ...proofOfCreationMetadataObj,
      fileUrl: url,
      // fullTrackFile: fileObj,
      // duration,
    });
    if (credits) {
      const _credits: {
        [key: number]: CreditsRow;
      } = {};
      credits.map((credit, i) => {
        _credits[i] = {
          percentAllocation: credit.percentAllocation,
          walletAddress: credit.account,
        };
      });
      // const keysLength = Object.keys(_credits);
      setArtistMetadataObj({ ...artistMetadataObj, credits: _credits });
    }
  };
  return (
    <Box>
      <Box p={{ xs: 4 }}>
        <Box
          display={"flex"}
          alignItems="center"
          gap={{ xs: 1, md: 4 }}
          justifyContent="space-between"
          flexWrap={"wrap"}
        >
          <Box display={"flex"} alignItems="center" gap={1}>
            <Typography
              variant="h5"
              // align="left"
              fontFamily={"Roboto"}
            >
              Music Metadata Administration
            </Typography>
            {userDoc?.artistContract ? (
              <Chip label={userDoc?.artistContract} variant="outlined" />
            ) : (
              <LoadingButton
                color="info"
                size="small"
                onClick={() => {
                  if (account) deployArtistMetadataContract(account);
                }}
                loading={deployingContract}
              >
                Deploy your Artist Contract
              </LoadingButton>
            )}
          </Box>
          {draftAvailable && !isStartListening && (
            <Button
              size="small"
              variant="outlined"
              color="info"
              onClick={() => {
                const obj = getFromLocalStorage();
                if (obj) {
                  const {
                    nftAddress,
                    tokenId,
                    artistMetadataObj,
                    songMetadataObj,
                  } = obj;
                  setNftAddress(nftAddress);
                  setTokenId(tokenId);
                  setArtistMetadataObj(artistMetadataObj);
                  if (songMetadataObj.dateCreated) {
                    songMetadataObj.dateCreated = dayjs(
                      songMetadataObj.dateCreated
                    );
                  }
                  setSongMetadataObj(songMetadataObj);
                  setDraftAvailable(false);
                  // setSectionsObj(sectionsObj);
                }
              }}
            >
              Load Previous State
            </Button>
          )}
        </Box>
        <Box
          mt={2}
          p={2}
          //  border="1px solid #1d1d1d"
          borderRadius={4}
        >
          {account && (
            <NftInfoModule
              addressProps={[nftAddress, setNftAddress]}
              tokenProps={[tokenId, setTokenId]}
              nftMetadata={nftMetadata}
              onMetadatUpdate={onMetdataFetch}
              setIsStartListening={setIsStartListening}
              walletAddress={account}
              // Catalog: 0x081Bc58a9538b1313e93F6bBC6119Ac6434FbE05
              // Sound: 0x9cfad4326eb84396b7610987eee45fd8236ddb30
              // Sound multiple Optimism: 0x57ab1bb893577b2e3f91f979855ec6d913d643ef
              releases={userDoc?.releases}
            />
          )}
        </Box>
        <Box mt={2}>
          <Tabs
            value={selectedTabIndex}
            onChange={(e, val) => setSelectedTabIndex(val)}
            variant="fullWidth"
            // textColor="secondary"
            // indicatorColor="secondary"
          >
            <Tab
              label="Artist Metadata"
              value={1}
              wrapped
              sx={{ fontWeight: 900, fontFamily: "Roboto", color: "#fff" }}
            ></Tab>
            <Tab
              label="Song Metadata"
              value={2}
              wrapped
              sx={{ fontWeight: 900, fontFamily: "Roboto", color: "#fff" }}
            ></Tab>
            <Tab
              label="Proof of Creation"
              value={3}
              wrapped
              sx={{ fontWeight: 900, fontFamily: "Roboto", color: "#fff" }}
            ></Tab>
          </Tabs>
        </Box>
        {selectedTabIndex === 1 && (
          <ArtistMetadataTab
            artistMetadataObj={artistMetadataObj}
            setArtistMetadataObj={(obj: ArtistMetadataObj) => {
              setIsStartListening(true);
              setArtistMetadataObj(obj);
            }}
          />
        )}

        {selectedTabIndex === 2 && (
          <SongMetadataTab
            songMetadataObj={songMetadataObj}
            setSongMetadataObj={(obj: SongMetadataObj) => {
              setIsStartListening(true);
              setSongMetadataObj(obj);
            }}
          />
        )}
        {selectedTabIndex === 3 && (
          <ProofOfCreationTab
            proofOfCreationMetadataObj={proofOfCreationMetadataObj}
            setProofOfCreationMetadataObj={(
              obj: ProofOfCreationMetadataObj
            ) => {
              setIsStartListening(true);
              setProofOfCreationMetadataObj(obj);
            }}
            onFetchStartBeatOffet={onFetchStartBeatOffet}
          />
        )}
        <Box display={selectedTabIndex === 3 ? "initial" : "none"}>
          {proofOfCreationMetadataObj.fileUrl && (
            <WaveForm
              proofOfCreationMetadataObj={proofOfCreationMetadataObj}
              onDurationUpdate={(duration: number) =>
                setProofOfCreationMetadataObj({
                  ...proofOfCreationMetadataObj,
                  duration,
                })
              }
              sectionsObj={sectionsObj}
              setSectionsObj={setSectionsObj}
            />
          )}
        </Box>
        {selectedTabIndex === 3 && (
          <Box>
            <Box mt={8}>
              <Typography variant="h6">Proof of Creation</Typography>
              <Box mt={4} display="flex" justifyContent="center">
                <AcceptStems
                  getRootProps={getRootProps}
                  getInputProps={getInputProps}
                />
              </Box>
              <Box
                mt={4}
                display="flex"
                gap={2}
                justifyContent="center"
                flexWrap="wrap"
              >
                {Object.values(stemsObj).map(({ file, name, type }, i) => (
                  <Box>
                    <Box display="flex" justifyContent="center">
                      <Select
                        size="small"
                        value={type}
                        onChange={(e) => {
                          const newObject = { ...stemsObj };
                          newObject[i].type = String(e.target.value);
                          setStemsObj(newObject);
                        }}
                      >
                        <MenuItem value={"Vocal"}>Vocal</MenuItem>
                        <MenuItem value={"Instrumental"}>Instrumental</MenuItem>
                        <MenuItem value={"Bass"}>Bass</MenuItem>
                        <MenuItem value={"Drums"}>Drums</MenuItem>
                      </Select>
                    </Box>
                    <Box mt={2}>
                      <TextField
                        placeholder="Name"
                        value={name}
                        onChange={(e) => {
                          const newObject = { ...stemsObj };
                          newObject[i].name = e.target.value;
                          setStemsObj(newObject);
                        }}
                      ></TextField>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box mt={8} display="flex" justifyContent="center">
              <Button variant="contained" color="primary" onClick={onTxClick}>
                Publish
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      <TransactionDialog
        isTxDialogOpen={isTxDialogOpen}
        activeTxStep={activeTxStep}
        onTxDialogClose={onTxDialogClose}
        fullTrackHash={fullTrackHash}
        stemsHash={stemsHash}
        sectionsHash={sectionsHash}
        isEncryptFiles={false}
      />
    </Box>
  );
}

export default Metadata;
