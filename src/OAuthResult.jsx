import { loginByGoogleAPI, loginByLineAPI } from './api/OAuthAPI.jsx';
import { useNavigate } from 'react-router-dom';
import { useAPI } from './context/APIContext.jsx';

export function OAuthResultLine(props) {
    const navigate = useNavigate();
    const code = props.queryString.get('code');
    const { handleLoginStatus } = useAPI();
    loginByLine(code);

    async function loginByLine(code) {
        const resData = await loginByLineAPI(code);
        if (resData.code == 0) {
            handleLoginStatus(true);
            localStorage.setItem("token", resData.token);
            localStorage.setItem("latest_access_type", resData.latest_access_type);
            localStorage.setItem("role_name", resData.role_name);
            navigate('/', { replace: true });
        }
        else {
            navigate('/account', { replace: false });
        }
    }
}

export function OAuthResultGoogle(props) {
    const navigate = useNavigate();
    const code = props.queryString.get('code');
    const { handleLoginStatus } = useAPI();
    loginByGoogle(code);

    async function loginByGoogle(code) {
        const resData = await loginByGoogleAPI(code);
        if (resData.code == 0) {
            handleLoginStatus(true);
            localStorage.setItem("token", resData.token);
            localStorage.setItem("latest_access_type", resData.latest_access_type);
            localStorage.setItem("role_name", resData.role_name);
            navigate('/', { replace: true });
        }
        else {
            navigate('/account', { replace: false });
        }
    }
}

export default OAuthResultLine;