import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack
} from "@mui/material";

const ReportsPage = () => {

  const [data, setData] = useState([]);
  const [reportType, setReportType] = useState("");

  const fetchReport = async (type) => {

  try {

    const res = await fetch(`http://localhost:5000/api/reports/${type}`);
    const result = await res.json();

    if (Array.isArray(result)) {
      setData(result);
    } else {
      console.error(result);
      setData([]);
    }

  } catch (err) {
    console.error(err);
    setData([]);
  }

};

  return (
    <Container sx={{ mt: 5 }}>

      <Typography variant="h5" sx={{ mb: 3 }}>
        Reports
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>

        <Button
          variant="contained"
          onClick={() => fetchReport("attendance")}
        >
          Attendance Report
        </Button>

        <Button
          variant="contained"
          onClick={() => fetchReport("leave")}
        >
          Leave Report
        </Button>

        <Button
          variant="contained"
          onClick={() => fetchReport("tasks")}
        >
          Task Report
        </Button>

      </Stack>

      <Paper>

        <Table>

          <TableHead>
            <TableRow>
              {data.length > 0 &&
                Object.keys(data[0]).map(key => (
                  <TableCell key={key}>{key}</TableCell>
                ))
              }
            </TableRow>
          </TableHead>

          <TableBody>

            {data.map((row, i) => (

              <TableRow key={i}>

                {Object.values(row).map((val, index) => (
                  <TableCell key={index}>{val}</TableCell>
                ))}

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </Paper>

    </Container>
  );
};

export default ReportsPage;