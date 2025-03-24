import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const APIContext = createContext();

export const APIProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    //type:success,info,warning,error
    const [alert, setAlert] = useState({ open: false, message: '', type: 'info' });
    const [loginStatus, setLoginStatus] = useState(false);
    const navigate = useNavigate();
    const baseUri = `${process.env.REACT_APP_API_DOMAIN}/api`;
    const baseParamsObj = {
        "version": process.env.REACT_APP_VERSION,
        "platfrom": process.env.REACT_APP_PLATFROM
    };
    const loadingImg = `${process.env.REACT_APP_WEB_DOMAIN}/loading_256.gif`;

    const showAlert = (message, type = 'info') => {
        setAlert({ open: true, message, type });
    };

    const hideAlert = () => {
        setAlert({ ...alert, open: false });
    };

    const basePost = async (apiUri, paramsObj = null) => {
        const config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,  // 使用 Bearer 方式加入 token，視後端需求而定
                'Content-Type': 'application/json',   // 確認內容類型，根據需求調整
                'version': `${process.env.REACT_APP_VERSION}`,
                'platform': `${process.env.REACT_APP_PLATFORM}`
            }
        };

        let reqParamsObj = null;
        if (paramsObj !== null) { reqParamsObj = { ...baseParamsObj, ...paramsObj }; }
        else { reqParamsObj = baseParamsObj; }

        const uri = `${baseUri}/${apiUri}`;
        console.log(uri);

        const res = await axios.post(uri, reqParamsObj, config)
            .then(response => { return response; })
            .catch(error => { throw error; });

        return res.data;
    }

    const basePatch = async (apiUri, paramsObj = null) => {
        const config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,  // 使用 Bearer 方式加入 token，視後端需求而定
                'Content-Type': 'application/json',   // 確認內容類型，根據需求調整
                'version': `${process.env.REACT_APP_VERSION}`,
                'platform': `${process.env.REACT_APP_PLATFORM}`
            }
        };

        let reqParamsObj = null;
        if (paramsObj !== null) { reqParamsObj = { ...baseParamsObj, ...paramsObj }; }
        else { reqParamsObj = baseParamsObj; }

        const uri = `${baseUri}/${apiUri}`;
        console.log(uri);

        const res = await axios.patch(uri, reqParamsObj, config)
            .then(response => { return response; })
            .catch(error => { throw error; });

        return res.data;
    }

    const post = async (apiUri, paramsObj = null, callBack = null) => {
        try {
            setLoading(true);

            const resData = await basePost(apiUri, paramsObj);

            handleResponse(resData);

            if (callBack != null && resData.code === 0) {
                callBack(resData);
            }

            return resData;
        } catch (error) {
            console.log(error);
            showAlert(error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const patch = async (apiUri, paramsObj = null, callBack = null) => {
        try {
            setLoading(true);

            const resData = await basePatch(apiUri, paramsObj);

            handleResponse(resData);

            if (callBack != null && resData.code === 0) {
                callBack(resData);
            }

            return resData;
        } catch (error) {
            console.log(error);
            showAlert(error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteApi = async (apiUri, paramsObj = null, callBack = null) => {
        try {
            setLoading(true);

            let reqParamsObj = null;
            if (paramsObj !== null) { reqParamsObj = { ...baseParamsObj, ...paramsObj }; }
            else { reqParamsObj = baseParamsObj; }

            const config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,  // 使用 Bearer 方式加入 token，視後端需求而定
                    'Content-Type': 'application/json',   // 確認內容類型，根據需求調整
                    'version': `${process.env.REACT_APP_VERSION}`,
                    'platform': `${process.env.REACT_APP_PLATFORM}`
                },
                data: reqParamsObj
            };

            const uri = `${baseUri}/${apiUri}`;
            console.log(uri);

            const resData = await axios.delete(uri, config)
                .then(response => { return response.data; })
                .catch(error => { throw error; });

            handleResponse(resData);

            if (callBack != null && resData.code === 0) {
                callBack(resData);
            }

            return resData;
        } catch (error) {
            console.log(error);
            showAlert(error);
            return null;
        } finally {
            setLoading(false);
        }
    }

    const postFormData = async (apiUri, formData = null, callBack = null) => {
        try {
            setLoading(true);

            const config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,  // 使用 Bearer 方式加入 token，視後端需求而定
                    'Content-Type': 'multipart/form-data',   // 確認內容類型，根據需求調整
                    'version': `${process.env.REACT_APP_VERSION}`,
                    'platform': `${process.env.REACT_APP_PLATFORM}`
                }
            };

            formData.append("version", baseParamsObj.version);
            formData.append("platfrom", baseParamsObj.platfrom);

            const uri = `${baseUri}/${apiUri}`;
            console.log(uri);

            const resData = await axios.post(uri, formData, config)
                .then(response => { return response.data; })
                .catch(error => { throw error; });

            handleResponse(resData);

            if (callBack != null && resData.code === 0) {
                callBack(resData);
            }

            return resData;
        } catch (error) {
            console.log(error);
            showAlert(error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleResponse = (resData) => {
        console.log(`code:${resData.code}, message:${resData.message}`);
        switch (resData.code) {
            case 0: //成功不動作
                break;
            case 105:
                showAlert(resData.message, 'error');
                handleToken();
                break;
            case 112:
                showAlert(resData.message, 'error');
                handleToken();
                break;
            default:
                showAlert(resData.message, 'error');
                break;
        }
    }

    const handleToken = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("latest_access_type");
        localStorage.removeItem("role_ids");
        setLoginStatus(false);
        navigate('/account', { replace: false });
    }

    const handleLoginStatus = (status) => {
        setLoginStatus(status);
    }

    const handleApiParam = (event, paramsObj, setParamsObj) => {
        const { name, type, value, checked } = event.target;

        let inputValue;
        // 根据输入类型设置值：如果类型是 checkbox，则使用 checked；否则使用 value。
        switch (type) {
            case 'checkbox':
                inputValue = checked;
                break;
            default:
                //判斷 select "請選擇" 項目
                // inputValue = value === 'null' ? null : value;
                inputValue = value;
        }

        const newParamsObj = { ...paramsObj, [name]: inputValue };
        setParamsObj(newParamsObj);
    }

    const handleApiMutiParam = (values, paramsObj, setParamsObj) => {
        const newParamsObj = { ...paramsObj };
        values.map(item => {
            const { name, value } = item;

            // //判斷 select "請選擇" 項目
            // const inputValue = value === 'null' ? null : value;
            // newParamsObj[name] = inputValue;

            newParamsObj[name] = value;
        });
        setParamsObj(newParamsObj);
    }

    return (
        <APIContext.Provider value={{
            loading,
            alert,
            post,
            postFormData,
            showAlert,
            hideAlert,
            loginStatus,
            handleLoginStatus,
            handleApiParam,
            handleApiMutiParam,
            patch,
            deleteApi
        }}>
            {children}
        </APIContext.Provider>
    )
}

export const useAPI = () => useContext(APIContext);