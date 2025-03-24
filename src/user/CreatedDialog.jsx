import CloseIcon from '@mui/icons-material/Close';
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import React, { useState } from "react";
import { LoadingOverlay } from '../components/loading/Loading';
import { useAPI } from "../context/APIContext";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export const CreatedDialog = ({ dialogOpen, onCloseDialog, onSubmit }) => {
    const { handleApiParam, handleApiMutiParam, loading } = useAPI();
    const [formData, setFormData] = useState(null);
    const GridColumnSpacingAddr = { xs: 1, sm: 2, md: 3 }
    const GridItemSizeAddr = { xs: 12, sm: 4, md: 4 }
    const GridColSpacingEnvCategory = { xs: 1, sm: 2, md: 3 }
    const GridItemSizeEnvCategory = { xs: 12, sm: 6, md: 6 }

    const handleChange = (event) => {
        handleApiParam(event, formData, setFormData);
    };

    const handleMuitChange = (values) => {
        handleApiMutiParam(values, formData, setFormData);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(formData);
    }

    return (

        <BootstrapDialog
            maxWidth="lg" //'xs', 'sm', 'md', 'lg', 'xl' 或 false
            fullWidth={true}
            onClose={onCloseDialog}
            aria-labelledby="customized-dialog-title"
            open={dialogOpen}
        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                新增
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onCloseDialog}
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
                <Grid component="form" container rowSpacing={{ xs: 1, sm: 2, md: 3 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }} padding={3}>
                    <Grid item xs={12} sm={6} md={6} >
                        <FormControl fullWidth>
                            <TextField fullWidth
                                required
                                name="name"
                                label="姓名"
                                onChange={handleChange}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} >
                        <FormControl fullWidth>
                            <TextField fullWidth
                                required
                                name="email"
                                label="信箱"
                                onChange={handleChange}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button autoFocus type="submit" onClick={handleSubmit}>
                    儲存
                </Button>
            </DialogActions>
        </BootstrapDialog>

    )
}

export default React.memo(CreatedDialog);