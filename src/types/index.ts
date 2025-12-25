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
