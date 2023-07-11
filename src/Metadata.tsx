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
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
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

// const IOSSwitch = styled((props: SwitchProps) => (
//   <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
// ))(({ theme }) => ({
//   width: 42,
//   height: 26,
//   padding: 0,
//   "& .MuiSwitch-switchBase": {
//     padding: 0,
//     margin: 2,
//     transitionDuration: "300ms",
//     "&.Mui-checked": {
//       transform: "translateX(16px)",
//       color: "#fff",
//       "& + .MuiSwitch-track": {
//         backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#573FC8",
//         opacity: 1,
//         border: 0,
//       },
//       "&.Mui-disabled + .MuiSwitch-track": {
//         opacity: 0.5,
//       },
//     },
//     "&.Mui-focusVisible .MuiSwitch-thumb": {
//       color: "#33cf4d",
//       border: "6px solid #fff",
//     },
//     "&.Mui-disabled .MuiSwitch-thumb": {
//       color:
//         theme.palette.mode === "light"
//           ? theme.palette.grey[100]
//           : theme.palette.grey[600],
//     },
//     "&.Mui-disabled + .MuiSwitch-track": {
//       opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
//     },
//   },
//   "& .MuiSwitch-thumb": {
//     boxSizing: "border-box",
//     width: 22,
//     height: 22,
//   },
//   "& .MuiSwitch-track": {
//     borderRadius: 26 / 2,
//     backgroundColor: theme.palette.mode === "light" ? "#c4c4c4" : "#39393D",
//     opacity: 1,
//     transition: theme.transitions.create(["background-color"], {
//       duration: 500,
//     }),
//   },
// }));

const getWithoutSpace = (str: string) => str?.split(" ").join("");
// const aliceMnemonic =
//   "cost hello lounge proof dinner ask degree spoil donor brown diary midnight cargo fog enroll across cupboard zero chief gate decade toss pretty profit";

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

  const getSelectedBeatOffet = useRef(null);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const [activeTxStep, setActiveTxStep] = useState<number>(0);
  const [isTxDialogOpen, setIsTxDialogOpen] = useState<boolean>(false);
  // const [isEncryptFiles, setIsEncryptFiles] = useState<boolean>(false);

  const [fullTrackHash, setFullTrackHash] = useState<string>();
  const [stemsHash, setStemsHash] = useState<string[]>([]);
  const [sectionsHash, setSectionsHash] = useState<string[]>([]);

  const [userAddress, setUserAddress] = useState<string>();
  // const navigate = useNavigate();
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(1);
  const [draftAvailable, setDraftAvailable] = useState(false);

  const { getFromLocalStorage } = useSaveChanges(
    {
      artistMetadataObj,
      songMetadataObj,
    },
    isStartListening,
    setIsLocallySaving
  );

  useEffect(() => {
    const obj = getFromLocalStorage();
    if (obj) {
      setDraftAvailable(true);
    }
  }, []);

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
    // const response = await fetch(
    //   "http://localhost:8080/cid/bafybeianjehxvg3qpore2bkt5vjmou5qovxuxl46izid4wm4kugxtxcq5e"
    // );
    // const content = await response.arrayBuffer();
    // const blob = new Blob([content], { type: "audio/wav" });
    // const a = new Audio(URL.createObjectURL(blob));
    // a.play();
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

    // const { creator, signingClient } = await getSigningStargateClient();
    // const { keplr } = window;
    // if (!keplr) {
    //   alert("You need to install Keplr");
    //   return;
    // }
    // const offlineSigner: OfflineSigner = keplr.getOfflineSigner!(cosmosChainId);
    // const { msgCreateFullTrack, msgCreateSection, msgCreateStem } =
    //   await txClient(offlineSigner);

    // let parentFullTrackId;
    // try {
    //   const fromJson = MsgCreateFullTrack.fromJSON({
    //     creator,
    //     cid,
    //     artistName: artist,
    //     featureArtists,
    //     trackTitle: title,
    //     album,
    //     genrePrimary,
    //     genreSecondary,
    //     songMoods,
    //     songType,
    //     key,
    //     bpm,
    //     timeSignature,
    //     bars: noOfBars,
    //     beats: noOfBeats,
    //     durationMs: (duration || 0) * 1000,
    //     startBeatOffsetMs: startBeatOffsetMs.toString(),
    //     sectionsCount: Object.keys(sectionsObj).length,
    //     stemsCount: Object.keys(stemsObj).length,
    //     isrcCode,
    //     upcCode,
    //     recordLabel,
    //     distributor,
    //     dateCreated,
    //   });
    //   const msgEncoded = msgCreateFullTrack(fromJson);
    //   // // const broadCast = await signAndBroadcast([msgEncoded]);
    //   const broadCast = await signingClient.signAndBroadcast(
    //     creator,
    //     [msgEncoded],
    //     "auto"
    //   );
    //   const id = JSON.parse(
    //     JSON.parse(broadCast.rawLog || "")[0].events[1].attributes[0].value
    //   );
    //   const creatorAddress = JSON.parse(
    //     JSON.parse(broadCast.rawLog || "")[0].events[1].attributes[1].value
    //   );
    //   parentFullTrackId = id;
    //   console.log(broadCast, id, creatorAddress);
    // } catch (err) {
    //   console.log("error: ", err);
    //   alert("Error creating fulltrack tx.");
    //   return;
    // }

    setActiveTxStep(2);
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
        // const fromJson = MsgCreateStem.fromJSON({
        //   creator,
        //   fullTrackID: parentFullTrackId,
        //   stemCid: cid, //TODO
        //   stemName: stemObj.name,
        //   stemType: stemObj.type,
        // });
        // const msgEncoded = msgCreateStem(fromJson);
        // broadCastStemsMsgs.push(msgEncoded);
      }
      //   try {
      //     //// const broadCastedStems = await signAndBroadcast(broadCastStemsMsgs);
      //     // const broadCastedStems = await signingClient.signAndBroadcast(
      //     //   creator,
      //     //   broadCastStemsMsgs,
      //     //   "auto"
      //     // );
      //     // console.log({ broadCastStemsMsgs });
      //     // console.log({ broadCastedStems });
      //   } catch (err) {
      //     console.log("error: ", err);
      //     alert("Error creating stems tx.");
      //   }
    }
    // setActiveTxStep(3);

    // Section
    const sections = Object.values(sectionsObj);
    const sectionsContent = [];
    if (sections.length) {
      const broadCastSectionsMsgs = [];
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        // const fromJson = MsgCreateSection.fromJSON({
        //   creator,
        //   fullTrackID: parentFullTrackId,
        //   sectionName: section.name,
        //   sectionStartTimeMs: section.start * 1000,
        //   sectionEndTimeMs: section.end * 1000,
        // });
        //     const msgEncoded = msgCreateSection(fromJson);
        //     broadCastSectionsMsgs.push(msgEncoded);
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
        //     // const sectionHash = await new Promise<string>((res) => {
        //     //   api.tx.uploadModule
        //     //     .createSection(
        //     //       `section${
        //     //         i + 1
        //     //       }${titleWithoutSpace}${genreWithoutSpace}${key}${bpm}`,
        //     //       section.name,
        //     //       section.start * 1000,
        //     //       section.end * 1000,
        //     //       section.bars,
        //     //       section.bars * noOfBeatsPerBar
        //     //     )
        //     //     .signAndSend(account, ({ events = [], status }) => {
        //     //       if (status.isFinalized) {
        //     //         console.log(
        //     //           `Transaction included at blockHash ${status.asFinalized}`
        //     //         );

        //     //         // Loop through Vec<EventRecord> to display all events
        //     //         events.forEach(({ phase, event: { data, method, section } }) => {
        //     //           console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
        //     //         });
        //     //         res(status.hash.toString());
        //     //       }
        //     //     });
        //     // });
        //     // setSectionsHash([...sectionsHash, sectionHash]);
      }
      //   try {
      //     // const broadCastedStems = await signAndBroadcast(broadCastSectionsMsgs);
      //     console.log({ broadCastSectionsMsgs });
      //     const broadCastedStems = await signingClient.signAndBroadcast(
      //       creator,
      //       [...broadCastSectionsMsgs, ...broadCastStemsMsgs],
      //       "auto"
      //     );
      //     console.log(broadCastedStems);
      //   } catch (err) {
      //     console.log("error: ", err);
      //     alert("Error creating sections tx.");
      //   }
    }
    download(
      JSON.stringify({
        fullTrackContent,
        stemsContent,
        sectionsContent,
        // fullTrackId: parentFullTrackId,
      }),
      `NUSIC-${titleWithoutSpace}-metadata.json`,
      "text/plain"
    );
    setActiveTxStep(4);
  };

  // const transfer = async () => {
  //   // Sign and send a transfer from Alice to Bob
  //   // const txHash = await api.tx.balances
  //   //   .transfer("5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", 12345)
  //   //   .signAndSend("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY");
  //   // const txHash = await api.tx.uploadModule.createClaim()
  // };
  const onTxClick = async () => {
    const storeFiles = !Boolean(import.meta.env.VITE_IGNORE_STORAGE);
    const { fullTrackFile } = proofOfCreationMetadataObj;
    if (!fullTrackFile) {
      alert("Upload Full Track.");
      return;
    } else if (acceptedFiles.length === 0) {
      // alert("Submit PoC/stem files");
      // return;
    }
    setIsTxDialogOpen(true);
    const stemFiles: File[] = Object.values(stemsObj).map((obj) => obj.file);
    const allFiles = [fullTrackFile, ...stemFiles];
    let finalFiles;
    if (storeFiles) {
      // if (isEncryptFiles) {
      //   finalFiles = await encryptFiles(allFiles);
      // } else {
      finalFiles = allFiles;
      // }
      const client = new Web3Storage({
        token: import.meta.env.VITE_WEB3_STORAGE as string,
      });
      const cid = await client.put(finalFiles);
      setCid(cid);
    } else {
      setCid("test_cid_here");
    }
    // const formData = new FormData();
    // files.map((file) => {
    //   if (file) {
    //     formData.append(file.name, file);
    //   }
    //   return false;
    // });
    // const response = await axios.post(
    //   "https://music-assets-storage-ynfarb57wa-uc.a.run.app/upload",
    //   formData
    // );
    // if (response.data.cid) {
    //   setCid(response.data.cid);
    // } else {
    //   alert("Some error Occured, please try again later.");
    //   setIsTxDialogOpen(false);
    //   return;
    // }
    setActiveTxStep(1);
  };
  useEffect(() => {
    if (cid) {
      processTx();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid]);

  // const encryptFiles = async (files: File[]): Promise<File[]> => {
  //   const filePromises = files.map((file) => {
  //     return new Promise<File>((res) => {
  //       const reader = new FileReader();
  //       reader.addEventListener("load", (event: any) => {
  //         const buff = event.target.result;
  //         var wordArray = CryptoJS.lib.WordArray.create(buff);
  //         var encrypted = CryptoJS.AES.encrypt(
  //           wordArray,
  //           import.meta.env.VITE_ENCRYPTION_KEY
  //         ).toString();
  //         const newEncryptedFile = new File([encrypted], file.name);
  //         res(newEncryptedFile);
  //       });
  //       reader.readAsArrayBuffer(file);
  //     });
  //   });
  //   return Promise.all(filePromises);
  //   // await new Promise((res) => {
  //   //   const reader = new FileReader();
  //   //   reader.addEventListener("load", async (event: any) => {
  //   //     const buff = event.target.result;
  //   //     var wordArray = CryptoJS.lib.WordArray.create(buff);
  //   //     var encrypted = CryptoJS.AES.encrypt(
  //   //       wordArray,
  //   //       "1234567887654321"
  //   //     ).toString();
  //   //     const file = new File([encrypted], "fileName");
  //   //     console.log(file);
  //   //   });
  //   //   reader.readAsArrayBuffer(fullTrackFile as File);
  //   // });
  // };
  const onTxDialogClose = () => {
    setIsTxDialogOpen(false);
    // navigate("/");
    window.location.reload();
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
              Music Metadata Information
            </Typography>
            {/* <Typography variant="caption" fontStyle={"italic"} color="gray">
                saved
              </Typography> */}
          </Box>
          {draftAvailable && !isStartListening && (
            <Button
              size="small"
              variant="outlined"
              color="info"
              onClick={() => {
                const obj = getFromLocalStorage();
                if (obj) {
                  const { artistMetadataObj, songMetadataObj } = obj;
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
                Send To Blockchain
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
