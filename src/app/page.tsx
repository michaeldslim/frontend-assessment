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
  Typography,
  Chip,
  Button
} from "@mui/material";
import { IOp, IOperator, IOperatorCheckState } from "@/types";

const OPS_API_URL = 
  process.env.NEXT_PUBLIC_OPS_API_URL ??
  "https://frontend-challenge.veryableops.com/";

const CHECK_STATE_KEY = "operator-check-state";

function loadCheckState(): IOperatorCheckState {
  if (typeof window === "undefined") return {};

  try {
    const state = window?.localStorage.getItem(CHECK_STATE_KEY);
    if (!state) return {};

    return JSON.parse(state) as IOperatorCheckState;
  } catch{
    return {};
  }
}

function saveCheckState(checkState: IOperatorCheckState) {
  if (typeof window === "undefined") return;

  try {
    window?.localStorage.setItem(CHECK_STATE_KEY, JSON.stringify(checkState));
  } catch{
    // ignore
  }
}

export default function Home() {
  const [ops, setOps] = useState<IOp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [operatorCheckState, setOperatorCheckState] = useState<IOperatorCheckState>(() => loadCheckState());

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

  type CheckField = 'checkInTime' | 'checkOutTime';
  const updateOperatorCheckState = (operator: IOperator, field: CheckField) => {
    const oKey = String(operator.id);
    const now = moment().toISOString();

    setOperatorCheckState((prev) => {
      const updatedState: IOperatorCheckState = {
        ...prev,
        [oKey]: {
          ...(prev[oKey] || {}),
          [field]: now,
        }
      };
      
      saveCheckState(updatedState);
      return updatedState;
    });
  };

  const handleCheckIn = (operator: IOperator) => updateOperatorCheckState(operator, 'checkInTime');
  const handleCheckOut = (operator: IOperator) => updateOperatorCheckState(operator, 'checkOutTime');

  const renderOperatorRow = (op:IOp, operator:IOperator) => {
    const key = String(operator.id);
    const checkInTime = operatorCheckState[key]?.checkInTime;
    const checkOutTime = operatorCheckState[key]?.checkOutTime;

    const isCheckedIn = Boolean(checkInTime);
    const isCheckedOut = Boolean(checkOutTime);

    const checkedInLabel = checkInTime ? formatDateTime(checkInTime) : "Not Checked In";
    const checkedOutLabel = checkOutTime ? formatDateTime(checkOutTime) : "Not Checked Out";

    return (
      <TableRow key={`${op.opId}-${operator.id}`} hover>
        <TableCell>{operator.firstName} {operator.lastName}</TableCell>
        <TableCell>{operator.opsCompleted}</TableCell>
        <TableCell>{Math.round(operator.reliability * 100)}%</TableCell>
        <TableCell>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            {operator.endorsements.map((endorsement, index) => (
              <Chip key={index} label={endorsement} size="small" />
            ))}
          </Stack>
        </TableCell>
        <TableCell>
          <Stack spacing={0.5}>
            <Typography variant="body2">Check In: {checkedInLabel}</Typography>
            <Typography variant="body2">Check Out: {checkedOutLabel}</Typography>
          </Stack>
        </TableCell>
        <TableCell align="right">
          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
            <Button variant={isCheckedIn ? "contained" : "outlined"} color="primary" size="small" onClick={() => handleCheckIn(operator)} sx={{ textTransform: "none" }}>check in</Button>
            <Button variant={isCheckedOut ? "contained" : "outlined"} color={isCheckedOut ? "error" : "primary"} size="small" onClick={() => handleCheckOut(operator)} sx={{ textTransform: "none" }}>check out</Button>
          </Stack>
        </TableCell>
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
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
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
