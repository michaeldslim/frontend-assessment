'use client';

import { useState, useCallback, useMemo } from "react";
import moment from "moment";
import { 
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack, 
  Typography,
  Chip,
  Button,
  TableSortLabel,
  TextField,
} from "@mui/material";
import { IOp, IOperator, IOperatorCheckState, IFilteredOp } from "@/types";
import { useOps } from "@/utils/useOps";
import { useDebounce } from "@/utils/useDebounce";
import { filterOps } from "@/utils/filterOps";
import { formatDateTime } from "@/utils/date";
import { loadCheckState, saveCheckState } from "@/utils/checkState";

const MIN_SEARCH_LENGTH = 2;

type SortBy = "operator" | "opsCompleted" | "reliability" | null;

export default function Home() {
  const { ops, loading, error } = useOps();
  const [operatorCheckState, setOperatorCheckState] = useState<IOperatorCheckState>(() => loadCheckState());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy>("operator");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (columnName: Exclude<SortBy, null>) => {
    if (sortBy === columnName) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(columnName);
      setSortOrder("asc");
    }
  };

  const sortOperators = useCallback((operators: IOperator[]):IOperator[] => {
    if (!sortBy) return operators;

    const sortedOperators = [...operators].sort((a, b) => {
      if (sortBy === "operator") { return sortOrder === "asc" ? a.firstName.localeCompare(b.firstName) : b.firstName.localeCompare(a.firstName); }
      if (sortBy === "opsCompleted") { return sortOrder === "asc" ? a.opsCompleted - b.opsCompleted : b.opsCompleted - a.opsCompleted; }
      if (sortBy === "reliability") { return sortOrder === "asc" ? a.reliability - b.reliability : b.reliability - a.reliability; }
      return 0;
    });
    
    return sortedOperators;
  }, [sortBy, sortOrder]);

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

  const startSearch = useDebounce(searchQuery.trim().toLowerCase(), 300);
  const isSearchValid = startSearch.length >= MIN_SEARCH_LENGTH;
  const filteredOps = useMemo<IFilteredOp[]>(() => {
    return filterOps(ops, startSearch, isSearchValid, sortOperators);
  }, [ops, startSearch, isSearchValid, sortOperators]);
  
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4">Ops List</Typography>
          <Typography variant="body1">Assigned operators and manage check in/out status.</Typography>
        </Box>

        <Box>
          <TextField
            label="Search: Operator name, Op title, or Public ID"
            placeholder="Operator name, Op title, or Public ID"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            size="small"
            fullWidth
          />
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

        {!loading && !error && ops.length > 0 && filteredOps.length === 0 && isSearchValid && (
          <Alert severity="info">No results match your search.</Alert>
        )}

        {!loading && !error && filteredOps.map(({ op, searchableOperators }) => (
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
                      <TableCell 
                        sx={{ width: 220, maxWidth: 220 }}
                        sortDirection={sortBy === "operator" ? sortOrder : false}
                      >
                        <TableSortLabel
                          active={sortBy === "operator"}
                          direction={sortBy === "operator" ? sortOrder : "asc"}
                          onClick={() => handleSort("operator")}
                        >
                          Operator
                        </TableSortLabel>                        
                      </TableCell>
                      <TableCell
                        sortDirection={sortBy === "opsCompleted" ? sortOrder : false}
                      >
                        <TableSortLabel
                          active={sortBy === "opsCompleted"}
                          direction={sortBy === "opsCompleted" ? sortOrder : "asc"}
                          onClick={() => handleSort("opsCompleted")}
                        >
                          Ops Completed
                        </TableSortLabel>
                      </TableCell>
                      <TableCell
                        sortDirection={sortBy === "reliability" ? sortOrder : false}
                      >
                        <TableSortLabel
                          active={sortBy === "reliability"}
                          direction={sortBy === "reliability" ? sortOrder : "asc"}
                          onClick={() => handleSort("reliability")}
                        >
                          Reliability
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Endorsements</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchableOperators.map((operator) => renderOperatorRow(op, operator))}
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
