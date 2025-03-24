import CloseIcon from '@mui/icons-material/Close';
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from "react";
import { useAPI } from "../context/APIContext";
import { LoadingOverlay } from '../components/loading/Loading';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export const DeletedDialog = ({ id, dialogOpen, handleClose, handleDeleteRow }) => {
    const { loading } = useAPI();
    const [deletedId, setDeletedId] = useState(null);

    useEffect(() => {
        setDeletedId(id);
    }, [id])

    const handleSubmit = (event) => {
        event.preventDefault();
        handleDeleteRow(deletedId);
    }

    return (
        <>
            {deletedId &&
                <BootstrapDialog
                    maxWidth="xs" //'xs', 'sm', 'md', 'lg', 'xl' 或 false
                    fullWidth={true}
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={dialogOpen}
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        刪除
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent dividers>
                        {loading && <LoadingOverlay />}
                        <p>確認要刪除此筆資料?</p>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus type="submit" onClick={handleSubmit}>
                            確認
                        </Button>
                    </DialogActions>
                </BootstrapDialog>
            }
        </>
    )
}

export default React.memo(DeletedDialog);