// 預定義 API URL
export const apiUris = {
    getEnvFilterItem: 'EnvCategory/GetEnvFilterItem',
    queryEnv: 'Env/Query',
    queryTempEnv: 'TempEnv/Query',
    queryCoordinateStatus: 'TempEnv/QueryCoordinateStatus',
    login: 'User/Login',
    logout: 'User/Logout',
    updateTempEnv: 'TempEnv/Update',
    queryEnvCategory: 'EnvCategory/Query',
    deleteTempEnv: 'TempEnv/Delete',
    createTempEnv: 'TempEnv/Create',
    createSellingItem: 'SellingItem/Create', //[HttpPost]
    querySellingItem: 'SellingItem/Query', //[HttpPost]
    getSellingItem: 'SellingItem/Get', //[HttpPost]
    updateSellingItem: 'SellingItem/Update', //[HttpPost]
    deleteSellingItem: 'SellingItem/Delete', //[HttpDelete]
    queryUser: 'User/Query',
    getUser: 'User/Get',
    createUser: 'User/Create',
    updateUser: 'User/Update',
    deleteUser: 'User/Delete',
    queryProduct: 'Product/Query',
    getProduct: 'Product/Get',
    createProduct: 'Product/Create',
    updateProduct: 'Product/Update',
    deleteProduct: 'Product/Delete',
    queryOrder: 'Order/Query',
    getOrder: 'Order/Get',
    createOrder: 'Order/Create',
    updateOrder: 'Order/Update',
    deleteOrder: 'Order/Delete',
    queryOrderDetail: 'Order/QueryOrderDetail'
};

export default apiUris;
