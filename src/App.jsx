import React, { useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import { DesktopLayout } from "./DesktopLayout";
// import { MobileLayout } from "./MobileLayout";
import { Alerts } from './components/alert/Alerts';
import { APIProvider } from "./context/APIContext";
import { DataProvider } from "./context/DataContext";
import useDeviceDetector from "./useDeviceDetector";

function useQuery() {
  const { search } = useLocation();
  const query = React.useMemo(() => new URLSearchParams(search), [search]);
  return query;
}

const App = () => {
  const mapChipRef = useRef(null);
  const envChipRef = useRef(null);
  const priceChipRef = useRef(null);

  let query = useQuery();

  useEffect(() => {
    // 載入 Facebook SDK
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');

    // SDK 載入完成時會立即呼叫 fbAsyncInit，在這個函式中對 Facebook SDK 進行初始化
    window.fbAsyncInit = function () {
      // 初始化 Facebook SDK
      window.FB.init({
        appId: process.env.REACT_APP_FB_APP_ID,
        cookie: true,
        xfbml: true,
        version: process.env.REACT_APP_FB_APP_VERSION,
      });

      console.log('[fbAsyncInit] after window.FB.init');

      // 取得使用者登入狀態
      window.FB.getLoginStatus(function (response) {
        console.log('[refreshLoginStatus]', response);
      });

      window.FB.AppEvents.logPageView();
    };
  }, []);

  function handleScrollToMapChip() {
    if (mapChipRef.current == null)
      return;
    const yCoordinate = mapChipRef.current.getBoundingClientRect().top + window.scrollY;
    const yOffset = -70;
    window.scrollTo({
      top: yCoordinate + yOffset,
      behavior: 'smooth'
    });
  };

  function handleScrollToEnvChip() {
    if (envChipRef.current == null)
      return;
    const yCoordinate = envChipRef.current.getBoundingClientRect().top + window.scrollY;
    const yOffset = -70;
    window.scrollTo({
      top: yCoordinate + yOffset,
      behavior: 'smooth'
    });
  };

  function handleScrollToPriceChip() {
    if (priceChipRef.current == null)
      return;
    const yCoordinate = priceChipRef.current.getBoundingClientRect().top + window.scrollY;
    const yOffset = -70;
    window.scrollTo({
      top: yCoordinate + yOffset,
      behavior: 'smooth'
    });
  };

  return (
    <APIProvider>
      <DataProvider>
        <Alerts />
        {
          // useDeviceDetector()
          //   ? <MobileLayout
          //     mapChipRef={mapChipRef}
          //     envChipRef={envChipRef}
          //     priceChipRef={priceChipRef}
          //     handleScrollToMapChip={handleScrollToMapChip}
          //     handleScrollToEnvChip={handleScrollToEnvChip}
          //     handleScrollToPriceChip={handleScrollToPriceChip}
          //   />
          //   : 
          <DesktopLayout
            mapChipRef={mapChipRef}
            envChipRef={envChipRef}
            priceChipRef={priceChipRef}
            handleScrollToMapChip={handleScrollToMapChip}
            handleScrollToEnvChip={handleScrollToEnvChip}
            handleScrollToPriceChip={handleScrollToPriceChip}
            query={query}
          />
        }
      </DataProvider>
    </APIProvider>
  );
}

export default App;
