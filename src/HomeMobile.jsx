import React, { useEffect, useState, useRef } from 'react';
import Env from './Env.jsx';
import TravelModel from './TravelMode.jsx';
import Map from './Map/MapRadius.jsx';
import House from './House.jsx';
import { getPlacesByLocal } from "./api/PlacesAPI";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import SearchFloatingBtn from './SearchFloatingBtn.jsx';
import { Stack } from '@mui/material';
import Divider from '@mui/material/Divider/Divider.js';
import Chip from '@mui/material/Chip/Chip.js';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import SearchResult from './SearchResult.jsx';

const dividerStyle = {
  margin: '10px',
};

const chipStyle = {
  fontSize: '18px',
  backgroundColor: '#FFFFFF',
  color: '#1976d2',
  border: '1px solid #1976d2',
};

const drawerBleeding = 56;

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor:
    theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 68,
  left: 'calc(50% - 15px)',
}));

function HomeMobile(props) {
  const [houseInfo, setHouseInfo] = useState(null);
  const [radius, setRadius] = useState('300');
  const [env, setEnv] = useState([]);
  const [places, setPlaces] = useState([]);
  const [map, setMap] = useState(null);
  const [travelMode, setTravelMode] = useState(''); // 使用 state 来存储输入的值
  const [open, setOpen] = React.useState(false);

  const container = undefined;

  const handleHouseInfoChange = (houseObj) => {
    setHouseInfo(houseObj);
  }

  const handleRadiusChange = (event) => {
    setRadius(event.target.value);
  };

  const handleEnvChange = (event) => {
    const { value, checked } = event.target;
    if (checked == true) {
      setEnv([...env, parseFloat(value)]);
    }
    else {
      const newEnv = env.filter((item) => item !== parseFloat(value));
      setEnv(newEnv);
    }
  };

  const handleTravelChange = (event) => {
    setTravelMode(event.target.value); // 更新输入的值
  };

  const handleEnvClick = async () => {
    getPlacesFromAPI();
    setOpen(false);
    handleScrollToMapChip();
  };

  async function getPlacesFromAPI() {
    const resData = await getPlacesByLocal(
      houseInfo.position, houseInfo.Address, radius, env);
    //處理resResult
    const newPlaces = [];
    let newHouseInfo = houseInfo;
    newHouseInfo.position = { lat: resData.houseLat, lng: resData.houseLng };
    resData.places.results.forEach((result) => {
      let place = {
        name: result.name,
        position: result.geometry.location,
        env_group_code: result.env_group_code
      };
      newPlaces.push(place)
    });
    const newMap = {
      houseInfo: newHouseInfo,
      travelMode: travelMode,
      radius: radius,
      places: newPlaces
    }
    setPlaces(newPlaces);
    setHouseInfo(newHouseInfo);
    setMap(newMap);
  }

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  function handleScrollToMapChip() {
    const yCoordinate = props.mapChipRef.current.getBoundingClientRect().top + window.scrollY;
    const yOffset = -70;
    window.scrollTo({
      top: yCoordinate + yOffset,
      behavior: 'smooth'
    });
  };

  return (
    <div style={{ marginTop: '50px' }}>
      <Root>
        <CssBaseline />
        <Global
          styles={{
            '.MuiDrawer-root > .MuiPaper-root': {
              height: `calc(100% - ${drawerBleeding}px)`,
              overflow: 'visible',
            },
          }}
        />
        <SwipeableDrawer
          container={container}
          anchor="bottom"
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <StyledBox
            sx={{
              position: 'absolute',
              top: -drawerBleeding,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              visibility: 'visible',
              right: 0,
              left: 0,
            }}
          >
            <Puller />
          </StyledBox>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} padding={3} marginTop={'10px'}>
            <Grid item sm={3} xs={12} >
              <TextField required disabled fullWidth
                label="搜尋半徑 (必填)"
                defaultValue={radius}
                placeholder="公尺"
              />
            </Grid>
            <Grid item sm={3} xs={12}>
              <House onInputChange={handleHouseInfoChange} />{/*社區座標or地址*/}
            </Grid>
            <Grid item sm={3} xs={12}>
              <TravelModel defaultValue={travelMode} onInputChange={handleTravelChange} />
            </Grid>
            <Grid item sm={3} xs={12}>
            </Grid>
            <Grid item sm={12} xs={12}>
              <Env onInputChange={handleEnvChange} />{/*機能選單，ex:超商、捷運、公車站、賣場 */}
            </Grid>
            <Grid item sm={4} xs={12}>
              <Button variant="contained" onClick={handleEnvClick}>查詢</Button>
            </Grid>
          </Grid>
        </SwipeableDrawer>
        <SearchFloatingBtn handleFabClick={toggleDrawer(true)} />
      </Root>
      {/* <Divider textAlign="left" sx={dividerStyle}>
        <Chip label="地圖" sx={chipStyle} ref={props.mapChipRef}/>
      </Divider> */}
      <Stack ref={props.mapChipRef} />
      <Map map={map} />
      {places.length > 0 ?
        <Stack>
          <Divider textAlign="left" sx={dividerStyle}>
            <Chip label="機能" sx={chipStyle} ref={props.envChipRef} />
          </Divider>
          <SearchResult places={places} />
        </Stack>
        : <></>
      }
      {/* <Stack>
        <Divider textAlign="left" sx={dividerStyle}>
          <Chip label="實價登錄" sx={chipStyle} ref={props.priceChipRef}/>
        </Divider>
      </Stack> */}
    </div>
  );
}

export default HomeMobile;
