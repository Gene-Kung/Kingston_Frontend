import React, { useRef, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from '@mui/material';
import { useAPI } from '../../context/APIContext';
import { LoadingOverlay } from '../loading/Loading';

export const PagingTable = ({ columns, condition, apiName, setCondition }) => {
    const { post, loading } = useAPI();
    const [resData, setResData] = useState(null);

    useEffect(() => {

        query(condition, apiName);

    }, [condition]);

    const query = async (newCondition, apiName) => {
        if (newCondition !== null) {
            let newResData = await post(apiName, newCondition);
            if (newResData !== null && newResData.code !== 0) {
                newResData = null;
            }
            setResData(newResData);
        }
        else {
            setResData(null);
        }
    }

    const handlePaging = (event, value) => {
        const newCondition = { ...condition, page_index: value - 1 };
        setCondition(newCondition);
    }

    return (
        <>
            {loading && <LoadingOverlay />}
            {resData && <div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow key='id'>
                                {columns.map(col => {
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
                                resData.list.map((row, index) => (
                                    <TableRow key={row.id}>
                                        {
                                            columns.map(col => {
                                                if (col.field === 'no') {
                                                    return <TableCell>{(resData.page_index * resData.page_size) + index + 1}</TableCell>
                                                }
                                                else if (col.field === 'id') {
                                                    return <TableCell style={{ display: 'none' }} key={`${row.id}-${col.field}`}>{row.id}</TableCell>
                                                }
                                                else {
                                                    return <TableCell key={`${row.id}-${col.field}`}>{row[col.field]}</TableCell>
                                                }
                                            })
                                        }
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <Pagination count={resData.page_total} page={resData.page_index + 1} onChange={handlePaging} />
            </div>
            }
        </>
    )
}

export default React.memo(PagingTable);