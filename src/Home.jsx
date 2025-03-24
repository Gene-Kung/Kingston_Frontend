import React, { useEffect, useState, useRef } from 'react';
import TravelModel from './TravelMode.jsx';
import Map from './Map/MapRadius.jsx';
import House from './House.jsx';
import { getPlacesByLocal } from "./api/PlacesAPI";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Stack } from '@mui/material';
import Divider from '@mui/material/Divider/Divider.js';
import Chip from '@mui/material/Chip/Chip.js';
import { Collapse, IconButton } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import SearchResult from './SearchResult.jsx';
import LeafletMap from './LeafletMap.jsx';
import Env from './Env.jsx';
import { useAPI } from './context/APIContext.jsx';


const dividerStyle = {
  margin: '10px',
};

const chipStyle = {
  fontSize: '18px',
  backgroundColor: '#FFFFFF',
  color: '#1976d2',
  border: '1px solid #1976d2',
};

const Home = (props) => {
  const envRef = useRef(null);
  const [houseInfo, setHouseInfo] = useState();
  const [radius, setRadius] = useState('400');
  const [env, setEnv] = useState([]);
  const [places, setPlaces] = useState([]);
  const [map, setMap] = useState(null);
  const [travelMode, setTravelMode] = useState(''); // 使用 state 来存储输入的值
  const [isExpanded, setIsExpanded] = useState(false);
  const { post } = useAPI();

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleHouseInfoChange = (houseObj) => {
    setHouseInfo(houseObj);
  }

  const handleRadiusChange = (event) => {
    setRadius(event.target.value);
  };

  const handleEnvChange = (newEnvCategories) => {
    const newEnv = [];

    newEnvCategories.forEach(item => {
      if (item.checked) {
        newEnv.push(item.category);
      }
    });

    setEnv(newEnv);
  };

  const handleTravelChange = (event) => {
    setTravelMode(event.target.value); // 更新输入的值
  };

  const handleEnvClick = async () => {
    queryEnv();
    handleToggle();
    handleScrollToMapChip();
  };

  async function queryEnv() {
    const reqData = {
      center_lat: houseInfo.position.lat,
      center_lng: houseInfo.position.lng,
      env_categories: env,
      address: houseInfo.Address,
      radius: radius,
    }
    const resData = await post('queryEnv', reqData);
    //處理resResult
    const newPlaces = [];
    let newHouseInfo = houseInfo;
    newHouseInfo.position = { lat: resData.center_lat, lng: resData.center_lng };
    resData.env_infos.forEach(result => {
      let place = {
        name: result.name,
        fullname: result.fullname,
        position: { lat: result.lat, lng: result.lng },
        // category: result.category,
        distance: 300,
        time: 5
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
        env_group_code: result.env_group_code,
        distance: 300,
        time: 5
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

  function handleScrollToMapChip() {
    const yCoordinate = props.mapChipRef.current.getBoundingClientRect().top + window.scrollY;
    const yOffset = -70;
    window.scrollTo({
      top: yCoordinate + yOffset,
      behavior: 'smooth'
    });
  };

  return (
    <div style={{ marginTop: '60px' }}>
      <div style={{ position: 'fixed', top: 60, zIndex: 1, backgroundColor: '#FFFFFF', width: '100%' }}>
        <Collapse in={isExpanded}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} padding={3}>
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
              <TravelModel onInputChange={handleTravelChange} />
            </Grid>
            <Grid item sm={3} xs={12}>
            </Grid>
            <Grid item sm={12} xs={12}>
              {/*機能選單，ex:超商、捷運、公車站、賣場 */}
              <Env onInputChange={handleEnvChange} />
            </Grid>
            <Grid item sm={4} xs={12}>
              <Button variant="contained" onClick={handleEnvClick}>查詢</Button>
            </Grid>
          </Grid>
        </Collapse>
        <IconButton onClick={handleToggle} sx={{ height: 30 }}>
          查詢
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
        <Divider />
      </div>
      <div style={{ zIndex: 0, marginTop: 90 }}>
        {/* <Divider textAlign="left" sx={dividerStyle}>
          <Chip label="地圖" sx={chipStyle} ref={props.mapChipRef}/>
        </Divider> */}
        <Stack ref={props.mapChipRef} />
        {/* <Map map={map} /> */}
        <div id="map" style={{ width: '100%', height: '500px', zIndex: 0 }}></div>
        <LeafletMap map={map} />
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
    </div>
  );
}

export default React.memo(Home);
