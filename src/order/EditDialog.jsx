import CloseIcon from '@mui/icons-material/Close';
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from "react";
import { LoadingOverlay } from '../components/loading/Loading';
import { apiUris } from "../config/Api";
import { useAPI } from "../context/APIContext";
import { useData } from './../context/DataContext';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export const EditDialog = ({ editRow, dialogOpen, handleClose, handleUpdate }) => {
    const { handleApiParam, handleApiMutiParam, loading, post } = useAPI();
    // const [formData, setFormData] = useState({
    //     id: null,
    //     name: null,
    //     phone: null,
    //     created_user_id: null,
    //     total_price: 0
    // });
    const [formData, setFormData] = useState(null);
    const GridColumnSpacingAddr = { xs: 1, sm: 2, md: 3 }
    const GridItemSizeAddr = { xs: 12, sm: 4, md: 4 }
    const GridColSpacingEnvCategory = { xs: 1, sm: 2, md: 3 }
    const GridItemSizeEnvCategory = { xs: 12, sm: 6, md: 6 }
    // const [orderDetail, setOrderDetail] = useState([
    //     { product_id: null, price: 0, sugar: null, ice: null },
    // ]);
    const [orderDetail, setOrderDetail] = useState(null);
    const { productList } = useData();


    // useEffect(() => {
    //     if (editRow !== null) {
    //         const newFormData = {
    //             id: editRow.id,
    //             name: editRow.name,
    //             phone: editRow.phone,
    //             created_user_id: editRow.created_user_id,
    //             total_price: editRow.total_price
    //         }
    //         setFormData(newFormData);
    //         query(editRow.id);
    //     }
    //     //setFormData({ ...formData, ["created_user_id"]: localStorage.getItem("id") });
    // }, []);

    useEffect(() => {
        setFormData(editRow);
        if (editRow !== null) {
            query(editRow.id);
        }
    }, [editRow]);


    const query = async (id) => {
        const apiParams = { id };
        const resData = await post(
            apiUris.queryOrderDetail,
            apiParams
        );
        setOrderDetail(resData.list);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        const newformData = { ...formData, [name]: value };
        setFormData(newformData);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const newformData = { ...formData, ["order_detail"]: orderDetail };
        handleUpdate(formData);
    }

    const handleAddOrderDetail = () => {
        setOrderDetail([...orderDetail, { product_id: null, price: 0, sugar: null, ice: null }]); // 新增一個空字串
    };

    const handleDetailChange = (index, value) => {
        const newOrderDetail = [...orderDetail];
        newOrderDetail[index] = value;
        setOrderDetail(newOrderDetail);
    };

    const handleChangeProduct = (index, value) => {
        const newOrderDetail = [...orderDetail];
        newOrderDetail[index]["product_id"] = value;
        newOrderDetail[index]["price"] = productList.find(p => p.value == value)["price"];
        setOrderDetail(newOrderDetail);
        const total_price = newOrderDetail.reduce((sum, item) => sum + item.price, 0);
        setFormData({ ...formData, ["total_price"]: total_price });
    };

    const handleChangeSugar = (index, value) => {
        const newOrderDetail = [...orderDetail];
        newOrderDetail[index]["sugar"] = value;
        setOrderDetail(newOrderDetail);
    };

    const handleChangeIce = (index, value) => {
        const newOrderDetail = [...orderDetail];
        newOrderDetail[index]["ice"] = value;
        setOrderDetail(newOrderDetail);
    };

    return (
        <>
            {formData &&
                <BootstrapDialog
                    maxWidth="lg" //'xs', 'sm', 'md', 'lg', 'xl' 或 false
                    fullWidth={true}
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={dialogOpen}
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        編輯
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
                        <Grid component="form" container rowSpacing={{ xs: 1, sm: 2, md: 3 }} columnSpacing={{ xs: 1, sm: 2, md: 3 }} padding={3}>
                            <Grid item xs={12} sm={12} md={12}>
                                <input type='hidden' name='id' value={formData.id} ></input>
                                <p>ID:{formData.id}</p>
                            </Grid>
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
                                        name="phone"
                                        label="電話"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} >
                                <FormControl fullWidth>
                                    <TextField fullWidth
                                        disabled
                                        required
                                        name="userName"
                                        value={localStorage.getItem("name")}
                                        label="訂單建立者"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} >
                                <FormControl fullWidth>
                                    <TextField fullWidth
                                        disabled
                                        required
                                        name="total_price"
                                        value={formData.total_price}
                                        label="總金額"
                                    />
                                </FormControl>
                            </Grid>
                            {
                                orderDetail &&
                                orderDetail.map((item, index) => (
                                    <>
                                        <Grid item xs={12} sm={3} md={3}>
                                            <Select
                                                disabled
                                                key={index}
                                                label="品名"
                                                value={item.product_id}
                                                onChange={(e) => handleChangeProduct(index, e.target.value)}
                                                fullWidth
                                            >
                                                {productList && productList.map((product) => (
                                                    <MenuItem key={product.value} value={product.value}>{product.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </Grid>
                                        <Grid item xs={12} sm={3} md={3}>
                                            <FormControl fullWidth>
                                                <TextField fullWidth
                                                    disabled
                                                    required
                                                    name="price"
                                                    value={productList.find(p => p.value === item.product_id)["price"]}
                                                    label="金額"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={3} md={3}>
                                            <Select
                                                disabled
                                                key={index}
                                                label="甜度"
                                                value={item.sugar}
                                                onChange={(e) => handleChangeSugar(index, e.target.value)}
                                                fullWidth
                                            >
                                                <MenuItem key={`sugar_${index}`} value="甜">甜</MenuItem>
                                                <MenuItem key={`sugar_${index}`} value="很甜">很甜</MenuItem>
                                                <MenuItem key={`sugar_${index}`} value="超級甜">超級甜</MenuItem>
                                            </Select>
                                        </Grid>
                                        <Grid item xs={12} sm={3} md={3}>
                                            <Select
                                                disabled
                                                key={index}
                                                label="冰塊"
                                                value={item.ice}
                                                onChange={(e) => handleChangeIce(index, e.target.value)}
                                                fullWidth
                                            >
                                                <MenuItem key={`ice_${index}`} value="冰">冰</MenuItem>
                                                <MenuItem key={`ice_${index}`} value="很冰">很冰</MenuItem>
                                                <MenuItem key={`ice_${index}`} value="超級冰">超級冰</MenuItem>
                                            </Select>
                                        </Grid>
                                    </>))
                            }
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus type="submit" onClick={handleSubmit}>
                            更新
                        </Button>
                    </DialogActions>
                </BootstrapDialog>
            }
        </>
    )
}

export default React.memo(EditDialog);