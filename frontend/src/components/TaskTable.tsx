import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import type { Task } from "../types/task";
import EditTask from "./EditTask";
import DeleteTask from "./DeleteTask";

export default function TaskTable({
  tasks,
  userId,
}: {
  tasks: Task[] | undefined;
  userId: number;
}) {
  return (
    <TableContainer component={Paper} sx={{ width: "80%", m: "auto" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>タスク名</TableCell>
            <TableCell align="right">日時</TableCell>
            <TableCell align="right">ステータス</TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks?.map((task) => (
            <TableRow
              key={task.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {task.name}
              </TableCell>
              <TableCell align="right">{task.dueDate}</TableCell>
              <TableCell align="right">{task.status}</TableCell>
              <TableCell align="right">
                <EditTask task={task} userId={userId} />
              </TableCell>
              <TableCell align="right">
                <DeleteTask id={task.id} userId={userId} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
