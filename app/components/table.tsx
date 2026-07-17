"use client";

import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";
import TablePaginationDemo from "@/app/components/pagination";
import { ReactElement } from "react";
import CustomLoader from "./SpinLoader";
const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#fff",
    fontWeight: "600",
    color: "#000",
    fontSize: 16,
    border: "0px",
    borderBottom: "1px solid #646464",
    padding: "22px 22px",
    whiteSpace: "nowrap",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    borderBottom: "1px solid #646464",
    padding: "22px 22px",
    // whiteSpace: "nowrap",
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#fff",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
    background: "transparent",
  },
}));
interface Props {
  loading?: boolean;
  columns: {
    name: string;
    key: string;
    width?: number | string;
  }[];
  pageCount: number;
  recordPerPage: string;
  setRecordPerPage: (payload: string) => void;
  setPageNo: (payload: number) => void;
  pageNo: number;
  rows: Record<string, string | number | ReactElement | boolean | undefined>[];
  // Optional multi-select support. When `selectable` is true a checkbox column is
  // rendered. `rowIds` must be parallel to `rows` (same order) so each checkbox
  // maps to a record id. Left undefined everywhere else, so existing tables are unaffected.
  selectable?: boolean;
  rowIds?: string[];
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: (checked: boolean) => void;
}
const CustomTable = (props: Props) => {
  const rowIds = props.rowIds ?? [];
  const selectedIds = props.selectedIds ?? [];
  const allSelected =
    rowIds.length > 0 && rowIds.every((id) => selectedIds.includes(id));
  const someSelected =
    rowIds.some((id) => selectedIds.includes(id)) && !allSelected;
  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "0px 10px 15px -3px rgba(15, 23, 42, 0.08)",
          borderRadius: "10px",
          height: "calc(100vh - 222px)",
        }}
      >
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          stickyHeader
        >
          <TableHead>
            <TableRow>
              {props.selectable && (
                <StyledTableCell padding="checkbox">
                  <Checkbox
                    sx={{ color: "#0096A4", "&.Mui-checked": { color: "#0096A4" }, "&.MuiCheckbox-indeterminate": { color: "#0096A4" } }}
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={(e) => props.onToggleSelectAll?.(e.target.checked)}
                    disabled={rowIds.length === 0}
                  />
                </StyledTableCell>
              )}
              {props.columns.map((data) => (
                <StyledTableCell width={data.width} key={data.key}>
                  {data.name}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ position: "relative" }}>
            {!props.loading &&
              props.rows.map((row, index) => (
                <StyledTableRow key={index}>
                  {props.selectable && (
                    <StyledTableCell padding="checkbox">
                      <Checkbox
                        sx={{ color: "#0096A4", "&.Mui-checked": { color: "#0096A4" } }}
                        checked={selectedIds.includes(rowIds[index])}
                        onChange={() => props.onToggleSelect?.(rowIds[index])}
                      />
                    </StyledTableCell>
                  )}
                  {props.columns.map((column) => {
                    return (
                      <StyledTableCell key={column.key}>
                        {row[column.key]}
                      </StyledTableCell>
                    );
                  })}
                </StyledTableRow>
              ))}

            {props.loading && (
              <StyledTableRow>
                <StyledTableCell
                  colSpan={props.columns.length + (props.selectable ? 1 : 0)}
                  style={{
                    height: "calc(100vh - 293px)",
                    background: "#fff",
                  }}
                >
                  <CustomLoader />
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePaginationDemo
        pageCount={props.pageCount}
        setRecordPerPage={props.setRecordPerPage}
        recordPerPage={props.recordPerPage}
        setPageNo={props.setPageNo}
        pageNo={props.pageNo}
      />
    </>
  );
};
export default CustomTable;
