import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
// import { loginByFbAPI } from "./api/OAuthAPI";
import { useAPI } from './context/APIContext';
import { LoadingOverlay } from './components/loading/Loading';
import { apiUris } from './config/Api';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Map Marker
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export const SignInSide = (props) => {
  const line_icon = '/line-icon.svg';
  const fb_icon = '/facebook-icon.svg';
  const google_icon = '/google-icon.svg';
  const navigate = useNavigate();
  const { loading, handleLoginStatus, postFormData } = useAPI();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log({ email: formData.get('email'), pwd: formData.get('password') });
    login(formData);
  };

  const login = async (formData) => {
    const res = await postFormData(apiUris.login, formData);
    if (res.code === 0) {
      handleLoginSuccess(res);
    }
    else {
      navigate('/account', { replace: false });
    }
  }

  // const handleFBLogin = async () => {
  //   // 跳出 Facebook 登入的對話框
  //   window.FB.login(
  //     function (resAccessToken) {
  //       //saveAccessTokenFBFromAPI(response);
  //       console.log('handleFBLogin', resAccessToken);
  //       if (resAccessToken.status === 'connected') {
  //         window.FB.api('/me', { fields: 'last_name, first_name, name, email' }, function (resUserInfo) {
  //           console.log(JSON.stringify(resUserInfo));
  //           loginByFb(resAccessToken, resUserInfo);
  //         });
  //       } else {

  //       }
  //     },
  //     { scope: 'public_profile, email' }
  //   );
  // };

  // async function loginByFb(resAccessToken, resUserInfo) {
  //   let res = await loginByFbAPI(resAccessToken, resUserInfo);
  //   if (res.code !== 0) {
  //     navigate('/account', { replace: false });
  //   }
  //   else {
  //     handleLoginSuccess(res);
  //   }
  // }

  const handleLoginSuccess = (res) => {
    localStorage.setItem("token", res.list.token);
    localStorage.setItem("id", res.list.id);
    localStorage.setItem("name", res.list.name);
    //localStorage.setItem("latest_access_type", res.latest_access_type);
    //localStorage.setItem("role_ids", res.role_ids);
    handleLoginStatus(true);
    navigate('/', { replace: true });
  }

  return (
    <>
      {loading && <LoadingOverlay />}
      <ThemeProvider theme={defaultTheme}>
        <Grid container component="main" sx={{ height: '100vh' }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                登入
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="信箱"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="密碼"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                {/* <span style={{ color: 'red' }}>{errorMsg}</span> */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  登入
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      忘記密碼?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="#" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
                <Copyright sx={{ mt: 5 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
}

export default React.memo(SignInSide);
