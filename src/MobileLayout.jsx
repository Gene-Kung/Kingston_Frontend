import React, { useRef, useEffect, useState } from "react";
import HeaderMenu from "./HeaderMenu";
import { Router, Routes, Route, useLocation, Link, Redirect } from 'react-router-dom';
import HomeMobile from "./HomeMobile";

export const MobileLayout = (props) => {
    return (
        <Router>
            <HeaderMenu
                handleScrollToMapChip={props.handleScrollToMapChip}
                handleScrollToEnvChip={props.handleScrollToEnvChip}
                handleScrollToPriceChip={props.handleScrollToPriceChip} />
            <Routes>
                <Route path="/" element={
                    <HomeMobile mapChipRef={props.mapChipRef} envChipRef={props.envChipRef} priceChipRef={props.priceChipRef} />
                }
                />
            </Routes>
        </Router>
    );
}

export default React.memo(MobileLayout);