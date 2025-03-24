import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import React, { useState } from "react";
import { useAPI } from "../context/APIContext";

export const Condition = (props) => {
    const { handleApiParam, handleApiMutiParam } = useAPI();
    const [formData, setFormData] = useState({
        name: null,
        email: null,
        page_size: 20,
        page_index: 0
    });
    const GridColumnSpacingAddr = { xs: 1, sm: 2, md: 3 }
    const GridItemSizeAddr = { xs: 12, sm: 3, md: 3 }
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
        props.handleSearch(formData);
    }

    const handleCreate = (event) => {
        event.preventDefault();
        props.onShowCreatedDialog();
    }

    return (
        <Grid component="form" container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }} padding={3}>
            <Grid item xs={12} sm={6} md={6} >
                <FormControl fullWidth>
                    <TextField fullWidth
                        required
                        name="name"
                        label="姓名"
                        value={formData.name}
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
                        value={formData.email}
                        onChange={handleChange}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={1} md={1}>
                <Button variant="contained" onClick={handleSubmit}>確認</Button>
            </Grid>
            <Grid item xs={12} sm={1} md={1}>
                <Button
                    variant="contained"
                    sx={{ backgroundColor: '#FFD600', color: 'white', '&:hover': { backgroundColor: 'darkred' } }}
                    onClick={handleCreate}
                >
                    新增
                </Button>
            </Grid>
        </Grid>
    )
}

export default React.memo(Condition);