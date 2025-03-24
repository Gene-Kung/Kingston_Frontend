import { Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Button from "@mui/material/Button";
import React from "react";

export const List = (props) => {

    const handleChange = (event, value) => {
        props.handlePaging(value - 1);
    };

    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {props.columns.map(col => {
                                if (col.field === 'id') {
                                    return <TableCell style={{ display: 'none' }}>{col.headerName}</TableCell>
                                }
                                else {
                                    return <TableCell>{col.headerName}</TableCell>
                                }
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            props.data.list.map((row, no = 1) => (
                                <TableRow key={row.id}>
                                    <TableCell style={{ display: 'none' }}>{row.id}</TableCell>
                                    <TableCell>{(props.data.page_index * props.data.page_size) + no + 1}</TableCell>
                                    <TableCell>{row.lat}</TableCell>
                                    <TableCell>{row.lng}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.subname}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.county}</TableCell>
                                    <TableCell>{row.district}</TableCell>
                                    <TableCell>{row.address}</TableCell>
                                    <TableCell>{row.created_time}</TableCell>
                                    <TableCell>{row.updated_time}</TableCell>
                                    <TableCell>{row.deleted_time}</TableCell>
                                    <TableCell>
                                        <Button>修改</Button>
                                        <Button>刪除</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Pagination count={props.data.page_total} page={props.data.page_index + 1} onChange={handleChange} />
        </div>
    )
}

export default React.memo(List);