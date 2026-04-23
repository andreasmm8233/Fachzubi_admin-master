"use client";

import {
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
}
const CustomTable = (props: Props) => {
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
                  colSpan={props.columns.length}
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
