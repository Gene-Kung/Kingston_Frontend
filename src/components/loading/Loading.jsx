// LoadingOverlay.js
import React from 'react';
import './Loading.css'; // 引入剛剛創建的 CSS 檔案

export const LoadingOverlay = () => (
    <div className="loading-overlay">
        <img src="/loading_256.gif" alt="Loading..." className="loading-image" />
    </div>
);

export default LoadingOverlay;
