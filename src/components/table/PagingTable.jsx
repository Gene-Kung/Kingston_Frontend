import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from "@mui/icons-material/Delete"; // 使用 Delete 圖示
import { Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import React, { useEffect, useState } from "react";

export const PagingTable = ({ columns, resData, handlePaging, handleEdit, handleDelete }) => {
    const [list, setList] = useState(null);
    const [pageTotal, setPageTotal] = useState(null);
    const [pageIndex, setPageIndex] = useState(null);
    const [pageSize, setPageSize] = useState(null);

    useEffect(() => {
        if (resData === null) {
            setList(null);
            return;
        }
        if (resData === undefined) {
            setList(null);
            return;
        }
        if (resData.list === undefined) {
            setList(null);
            return;
        }
        setList(resData.list);
        setPageTotal(resData.page_total);
        setPageIndex(resData.page_index);
        setPageSize(resData.page_size);
    }, [resData])

    const handleClickEdit = (row) => {
        handleEdit(row);
    }

    const handleClickDelete = (id) => {
        handleDelete(id)
    }

    return (
        <>
            {list &&
                (list.length === 0
                    ? <div><p>查無資料</p></div>
                    :
                    <div>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow key='id'>
                                        {columns.map(col => {
                                            if (col.field === 'id') {
                                                return <TableCell style={{ display: 'none' }} key={col.headerName}>{col.headerName}</TableCell>
                                            }
                                            else {
                                                return <TableCell key={col.headerName}>{col.headerName}</TableCell>
                                            }
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        list.map((row, index) => (
                                            <TableRow key={row.id}>
                                                {
                                                    columns.map(col => {
                                                        if (col.field === 'no') {
                                                            const no = (pageIndex * pageSize) + index + 1;
                                                            return <TableCell key={`${row.id}_${no}`}>{no}</TableCell>
                                                        }
                                                        else if (col.field === 'id') {
                                                            return <TableCell style={{ display: 'none' }} key={`${row.id}_${col.field}`}>{row.id}</TableCell>
                                                        }
                                                        else {
                                                            return <TableCell key={`${row.id}_${col.field}`}>{row[col.field]}</TableCell>
                                                        }
                                                    })
                                                }
                                                <TableCell>
                                                    <IconButton onClick={() => handleClickEdit(row)}>
                                                        <BorderColorIcon color="primary" />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleClickDelete(row.id)}>
                                                        <DeleteIcon sx={{ color: '#CE0000' }} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Pagination count={pageTotal} page={pageIndex + 1} onChange={handlePaging} />
                    </div>)
            }
        </>
    )
}

export default React.memo(PagingTable);