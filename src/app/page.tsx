'use client';

import { useEffect, useState } from "react";
import moment from "moment";
import { 
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack, 
  Typography 
} from "@mui/material";
import { IOp, IOperator } from "@/types";

const OPS_API_URL = 
  process.env.NEXT_PUBLIC_OPS_API_URL ??
  "https://frontend-challenge.veryableops.com/";

export default function Home() {
  const [ops, setOps] = useState<IOp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOps = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(OPS_API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch ops");
        }

        const data = await response.json() as IOp[];
        setOps(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error fetching ddata");
      } finally {
        setLoading(false);
      }
    };

    fetchOps();
  }, []);

  const formatDateTime = (dateTime: string) => {
    return moment(dateTime).format("MMM D, YYYY h:mm A");
  };

  const renderOperatorRow = (op:IOp, operator:IOperator) => {
    return (
      <TableRow key={`${op.opId}-${operator.id}`}>
        <TableCell>{operator.firstName} {operator.lastName}</TableCell>
        <TableCell>{operator.opsCompleted}</TableCell>
        <TableCell>{Math.round(operator.reliability * 100)}%</TableCell>
        <TableCell>{operator.endorsements.join(', ')}</TableCell>
      </TableRow>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4}}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4">Ops List</Typography>
          <Typography variant="body1">Assigned operators and mange check in/out status.</Typography>
        </Box>

        {loading && (
          <Stack alignItems="center" justifyContent="center" spacing={2}>
            <CircularProgress />
            <Typography variant="body1">Loading ops data...</Typography>
          </Stack>
        )}

        {!loading && error && (
          <Alert severity="error">{error}</Alert>
        )}

        {!loading && !error && ops.length === 0 && (
          <Alert severity="info">No ops data available.</Alert>
        )}

        {!loading && !error && ops.map(op => (
          <Card key={op.opId} variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={1}>
                  <Box>
                    <Typography variant="h6">{op.opTitle}</Typography>
                    <Typography variant="body2" color="text.secondary">Public ID: {op.publicId}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2">Operators Needed: {op.operatorsNeeded}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: "right"}}>Filled: {op.filledQuantity}</Typography>
                  </Box>
                </Stack>
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Start Time: {formatDateTime(op.startTime)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  End Time: {formatDateTime(op.endTime)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Est. Hours: {op.estTotalHours}
                </Typography>
              </Stack>

              <Box sx={{ overflow: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Operator</TableCell>
                      <TableCell>Ops Completed</TableCell>
                      <TableCell>Reliability</TableCell>
                      <TableCell>Endorsements</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {op.operators.map((operator) => renderOperatorRow(op,operator))}
                  </TableBody>
                </Table>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}
