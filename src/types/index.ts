export interface IOperator {
  id: number;
  firstName: string;
  lastName: string;
  opsCompleted: number;
  reliability: number;
  endorsements: string[];
}

export interface IOp {
  opId: number;
  publicId: string;
  opTitle: string;
  opDate: string;
  filledQuantity: number;
  operatorsNeeded: number;
  startTime: string;
  endTime: string;
  estTotalHours: number;
  checkInCode: string;
  checkOutCode: string;
  checkInExpirationTime: string;
  checkOutExpirationTime: string;
  operators: IOperator[];
}

export interface IOperatorCheckStatus {
  checkInTime?: string;
  checkOutTime?: string;
}

export interface IOperatorCheckState {
  [operatorId: string]: IOperatorCheckStatus;
}

export interface IOpsResult {
  ops: IOp[];
  loading: boolean;
  error: string | null;
}

export interface IFilteredOp {
  op: IOp;
  searchableOperators: IOperator[];
};
