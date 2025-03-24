import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useAPI } from '../../context/APIContext';

export const Alerts = () => {
    const { alert, hideAlert } = useAPI();

    return (
        <Snackbar open={alert.open} autoHideDuration={6000} onClose={hideAlert}>
            <Alert onClose={hideAlert} severity={alert.type} sx={{ width: '100%' }} sm={{ width: '100%' }} md={{ width: '100%' }}>
                {alert.message}
            </Alert>
        </Snackbar>
    );
};

export default Alerts;
