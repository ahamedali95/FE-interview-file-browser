import React, {FunctionComponent, memo} from 'react';
import {TableSortLabel} from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import type {Entry} from "../generated-api";

type HeadCellType = {
  id: keyof Entry;
  alignDirection: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  label: string;
};

// alligned fields as per excel tabular rules
const headCells: HeadCellType[] = [
  { id: 'path', alignDirection: 'left', label: 'Path' },
  { id: 'name', alignDirection: 'left', label: 'Name' },
  { id: '__typename', alignDirection: 'left', label: 'Type' }, //@ts-ignore
  { id: 'size', alignDirection: 'right', label: 'Size' }
];

type CustomTableHeadProps = {
  sortType: "desc" | "asc" | undefined;
  sortField: keyof Entry | undefined;
  onRequestSort: (property: keyof Entry) => unknown;
};

const CustomTableHead: FunctionComponent<CustomTableHeadProps> = ({ sortField, sortType, onRequestSort }) => {
  const createSortHandler = (property: keyof Entry) => () => {
    onRequestSort(property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell): JSX.Element => (
          <TableCell key={headCell.id} align={headCell.alignDirection}>
            <TableSortLabel
              active={sortField === headCell.id}
              onClick={createSortHandler(headCell.id)}
              direction={sortField === headCell.id ? sortType : 'asc'}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="left">
          Last Modified
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default memo(CustomTableHead);
