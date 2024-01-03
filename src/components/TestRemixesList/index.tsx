import DeleteOutline from "@mui/icons-material/DeleteOutline";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import ThumbDownOutlined from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpOutlined from "@mui/icons-material/ThumbUpOutlined";
import {
  // Button,
  Chip,
  // Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { collection, query, where } from "firebase/firestore";
import { useState } from "react";
import {
  useCollection,
  // useCollectionData,
} from "react-firebase-hooks/firestore";
import { updateDocById } from "../../services/db/testSamples.service";
import { db } from "../../services/firebase.service";

type Props = { projectId: string };

const TestRemixRow = ({ row }: { row: any }) => {
  const [state, setState] = useState(true);

  const onDelete = async () => {
    await updateDocById(row.id, { remove: true });
  };

  const onLikeOrDislike = async (
    prop: "sync_like" | "sync_dis_like" | "non_sync_like" | "non_sync_dis_like",
    val: boolean
  ) => {
    await updateDocById(row.id, { [prop]: val });
  };

  return (
    <Stack
      gap={1}
      sx={{ background: "rgba(255,255,255,0.1)" }}
      borderRadius={4}
      p={2}
    >
      <Box
        display={"flex"}
        gap={2}
        alignItems="center"
        justifyContent={"space-between"}
      >
        <Chip label={row.prompt} />
        {/* <Typography>{row.prompt}</Typography> */}
        <Box>
          <IconButton
            onClick={() => {
              setState(false);
              setTimeout(() => setState(true), 200);
            }}
          >
            <RefreshRounded />
          </IconButton>
          <IconButton onClick={onDelete}>
            <DeleteOutline />
          </IconButton>
        </Box>
      </Box>
      <Box
        display={"flex"}
        justifyContent="space-between"
        alignItems={"center"}
      >
        <Box>
          <Chip label="&nbsp;Sync&nbsp;" variant="outlined" />
        </Box>
        {state && (
          <audio controls>
            <source
              // https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/test_remixer%2FSwyJVfKTLeUJFHistOlR%2Ffinal_non_sync.wav?alt=media
              src={`https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/test_remixer%2F${row.id}%2Ffinal_sync.wav?alt=media`}
              type="audio/wav"
            />
          </audio>
        )}
        <Box>
          <IconButton
            onClick={() => onLikeOrDislike("sync_like", !row.sync_like)}
          >
            <ThumbUpOutlined color={row.sync_like ? "success" : "secondary"} />
          </IconButton>
          <IconButton
            onClick={() => onLikeOrDislike("sync_dis_like", !row.sync_dis_like)}
          >
            <ThumbDownOutlined
              color={row.sync_dis_like ? "error" : "secondary"}
            />
          </IconButton>
        </Box>
      </Box>
      {/* <Typography>No Sync</Typography> */}
      <Box
        display={"flex"}
        justifyContent="space-between"
        alignItems={"center"}
      >
        <Box>
          <Chip label="NoSync" variant="outlined" />
        </Box>
        {state && (
          <audio controls>
            <source
              src={`https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/test_remixer%2F${row.id}%2Ffinal_non_sync.wav?alt=media`}
              type="audio/wav"
            />
          </audio>
        )}
        <Box>
          <IconButton
            onClick={() => onLikeOrDislike("non_sync_like", !row.non_sync_like)}
          >
            <ThumbUpOutlined
              color={row.non_sync_like ? "success" : "secondary"}
            />
          </IconButton>
          <IconButton
            onClick={() =>
              onLikeOrDislike("non_sync_dis_like", !row.non_sync_dis_like)
            }
          >
            <ThumbDownOutlined
              color={row.non_sync_dis_like ? "error" : "secondary"}
            />
          </IconButton>
        </Box>
      </Box>
    </Stack>
  );
};

const TestRemixesList = ({ projectId }: Props) => {
  const [values, loading, error] = useCollection(
    query(
      collection(db, "test_remixer"),
      where("project_id", "==", projectId),
      where("remove", "==", false)
    )
  );

  return (
    <Box px={4}>
      <Typography>NUMIX List</Typography>
      {loading && <Typography>Loading...</Typography>}
      {values && (
        <Stack spacing={2} mt={2}>
          {values.docs.map((v) => (
            <Box key={v.id}>
              <TestRemixRow row={{ ...v.data(), id: v.id }} />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default TestRemixesList;
