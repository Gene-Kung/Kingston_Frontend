import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useAPI } from './context/APIContext';
import { useNavigate } from 'react-router-dom';

const appBarStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '60px', // 可根据需要调整 AppBar 的高度
  // backgroundColor: '#f0f0f0',
  // 添加其他样式，如阴影等
};

const menuStyle = {
  display: 'flex',
  flexGrow: 1,
}

const accountStyle = {
  display: 'flex',
};

const HeaderMenu = (props) => {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { loginStatus, handleLoginStatus, post } = useAPI();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null && token !== "") {
      handleLoginStatus(true);
    }
  }, []);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
  }

  const logout = async () => {
    // const res = await post('logout');
    // if (res.code === 0) {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    //localStorage.removeItem("latest_access_type");
    //localStorage.removeItem("role_ids");
    handleLoginStatus(false);
    navigate('/account', { replace: false });
    // }
  }

  return (
    <div>
      <AppBar sx={appBarStyle}>
        <Toolbar>
          {/* <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button> */}
          <Box sx={menuStyle}>
            <Button color="inherit" component={Link} to="/">
              <img width="42px" src="/tea.png" />
            </Button>
            {/* <Button color="inherit" component={Link} to="/SellingItem">銷售物件</Button>
            <Button color="inherit" component={Link} to="/TempEnv">待新增機能</Button> */}
            <Button color="inherit" component={Link} to="/Order">訂單管理</Button>
            {
              loginStatus &&
              <>
                <Button color="inherit" component={Link} to="/Product">商品管理</Button>
                <Button color="inherit" component={Link} to="/User">帳號管理</Button>
              </>
            }
          </Box>
          <Box sx={accountStyle}>
            <Button color="inherit" component={Link} to="/Pricing">
              <img width="30px" src="/cart-50.png"></img>
            </Button>
            {
              loginStatus == true
                ?
                <div>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
                    <MenuItem onClick={handleClose}>帳戶</MenuItem>
                    <MenuItem onClick={handleLogout}>登出</MenuItem>
                  </Menu>
                </div>
                : <Button color="inherit" component={Link} to="/Account">登入</Button>
            }
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
}


export default React.memo(HeaderMenu);