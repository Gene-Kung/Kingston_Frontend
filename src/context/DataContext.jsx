import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAPI } from './APIContext';
import { apiUris } from '../config/Api';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { post } = useAPI();
    const [categoryList, setCategoryList] = useState(null);
    const [productList, setProductList] = useState(null);

    useEffect(() => {
        // queryEnvCategory();
        queryProduct();
    }, []);

    const queryEnvCategory = async () => {
        await post(apiUris.queryEnvCategory, null, handleResData);
    }

    const queryProduct = async () => {
        await post(apiUris.queryProduct, null, handleProduct);
    }

    const handleResData = (resData) => {
        let newCategoryList = [{ category: '請選擇', value: "null", name: "" }];
        resData.list.map((item) => {
            newCategoryList.push({
                category: item.category,
                value: item.category,
                name: item.name
            });
        });
        setCategoryList(newCategoryList);
    }

    const handleProduct = (resData) => {
        let newList = [{ category: '請選擇', value: "null", name: "" }];
        resData.list.map((item) => {
            newList.push({
                value: item.id,
                name: item.name,
                price: item.price
            });
        });
        setProductList(newList);
    }

    return (
        <DataContext.Provider value={{
            categoryList,
            productList,
            queryProduct
        }}>
            {children}
        </DataContext.Provider>
    )
}

export const useData = () => useContext(DataContext);