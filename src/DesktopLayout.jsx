import React, { useRef, useEffect, useState } from "react";
import HeaderMenu from "./HeaderMenu";
import { Routes, Route, useLocation } from "react-router-dom";
import SignInSide from "./SignInSide";
import { User } from "./user/User";
import { Product } from "./product/Product";
import { Order } from "./order/Order";

export const useQuery = () => {
  const { search } = useLocation();
  const query = React.useMemo(() => new URLSearchParams(search), [search]);
  return query;
};

export const DesktopLayout = (props) => {
  let query = useQuery();

  return (
    <div>
      <HeaderMenu
        handleScrollToMapChip={props.handleScrollToMapChip}
        handleScrollToEnvChip={props.handleScrollToEnvChip}
        handleScrollToPriceChip={props.handleScrollToPriceChip}
      />
      <div
        style={{
          position: "relative",
          top: 60,
          zIndex: 0,
          backgroundColor: "#FFFFFF",
          height: "100vh",
          width: "98vw",
        }}
      >
        <Routes>
          <Route path="/Account" element={<SignInSide />} />
          <Route path="/User" element={<User />} />
          <Route path="/Product" element={<Product />} />
          <Route path="/Order" element={<Order />} />
        </Routes>
      </div>
    </div>
  );
};

export default React.memo(DesktopLayout);
