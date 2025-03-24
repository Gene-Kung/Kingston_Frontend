
import React, { useEffect, useState } from 'react';

function isMobileDevice() {
  const mobileWidth = 768; // 设置移动设备的宽度阈值
  return window.innerWidth < mobileWidth;
}

export default function useDeviceDetector(){

    const [isMobile, setIsMobile] = useState(isMobileDevice());

    useEffect(() => {
        function handleResize() {
          setIsMobile(isMobileDevice());
        }
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
    
    return isMobile;
}
