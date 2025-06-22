import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import type { Task } from "../types/task";
import type { TaskStatus } from "../types/taskStatus";
import { UPDATE_TASK } from "../mutations/taskMutations";
import { useMutation } from "@apollo/client";
import { GET_TASKS } from "../queries/taskQueries";
import { useNavigate } from "react-router-dom";

export default function EditTask({
  task,
  userId,
}: {
  task: Task;
  userId: number;
}) {
  const [open, setOpen] = useState<boolean>(false);

  const [name, setName] = useState<string>(task.name);
  const [dueDate, setDueDate] = useState<string>(task.dueDate);
  const [status, setStatus] = useState<string>(task.status);
  const [description, setDescription] = useState<string>(task.description);
  const [isInvalidName, setIsInvalidName] = useState<boolean>(false);
  const [isInvalidDueDate, setIsInvalidDueDate] = useState<boolean>(false);

  const [updateTask] = useMutation<{ updateTask: Task }>(UPDATE_TASK);

  const navigate = useNavigate();

  const resetState = () => {
    setName(task.name);
    setDueDate(task.dueDate);
    setStatus(task.status);
    setDescription(task.description);
    setIsInvalidName(false);
    setIsInvalidDueDate(false);
  };

  const handleEditTask = async () => {
    let canEdit = true;

    if (name.length === 0) {
      canEdit = false;
      setIsInvalidName(true);
    } else {
      setIsInvalidName(false);
    }

    if (!Date.parse(dueDate)) {
      canEdit = false;
      setIsInvalidDueDate(true);
    } else {
      setIsInvalidDueDate(false);
    }

    if (canEdit) {
      const updateTaskInput = {
        id: task.id,
        name,
        dueDate,
        status,
        description,
      };
      try {
        await updateTask({
          variables: { updateTaskInput },
          refetchQueries: [{ query: GET_TASKS, variables: { userId } }],
        });
        resetState();
        setOpen(false);
      } catch (err: any) {
        if (err.message == "Unauthorized") {
          localStorage.removeItem("token");
          alert("トークンの有効期限が切れました。サインイン画面に遷移します。");
          navigate("/signin");
          return;
        }
        alert("タスクの編集に失敗しました。");
      }
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetState();
  };

  return (
    <div>
      <Tooltip title="編集">
        <IconButton onClick={handleClickOpen}>
          <EditIcon color="action" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="normal"
            id="name"
            label="Task Name"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={isInvalidName}
            helperText={isInvalidName ? "タスク名を入力してください" : ""}
          />
          <TextField
            autoFocus
            margin="normal"
            id="due-date"
            label="Due Date"
            placeholder="YYYY-MM-DD"
            fullWidth
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            error={isInvalidDueDate}
            helperText={isInvalidName ? "日付形式で入力してください" : ""}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="task-status-label">ステータス</InputLabel>
            <Select
              labelId="task-status-label"
              id="task-status"
              label="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              <MenuItem value={"NOT_STARTED"}>Not Started</MenuItem>
              <MenuItem value={"IN_PROGRESS"}>In Progress</MenuItem>
              <MenuItem value={"COMPLETED"}>Completed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="normal"
            id="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button onClick={handleEditTask}>更新する</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
