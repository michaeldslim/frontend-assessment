import { IOp, IOperator, IFilteredOp } from "@/types"; 

export function filterOps(
  ops: IOp[], 
  searchQuery: string, 
  isSearchValid: boolean, 
  sortOperators: (operators: IOperator[]) => IOperator[] 
): IFilteredOp[] {
  const startSearch = searchQuery.trim().toLowerCase();
  return ops.map((op) => {
      const opTitle = op.opTitle.trim().toLowerCase();
      const publicId = op.publicId.trim().toLowerCase();
      const filteredOperators = op.operators.filter((operator) => {
        if (!isSearchValid) return true;

        const firstName = operator.firstName.trim().toLowerCase();
        const lastName = operator.lastName.trim().toLowerCase();
        const fullName = `${firstName} ${lastName}`;
        return (
          opTitle.includes(startSearch) ||
          publicId.includes(startSearch) ||
          fullName.includes(startSearch)
        );
      });
      
      if (isSearchValid && filteredOperators.length === 0) return null;
      const searchableOperators = sortOperators(filteredOperators);
      return { op, searchableOperators };
    }).filter((item) => item !== null);
}
