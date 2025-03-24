import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { LoadingOverlay } from "../components/loading/Loading";
import { PagingTable } from "../components/table/PagingTable";
import { apiUris } from "../config/Api";
import { useAPI } from "../context/APIContext";
import { useData } from './../context/DataContext';
import Condition from "./Condition";
import CreatedDialog from "./CreatedDialog";
import DeletedDialog from "./DeletedDialog";
import EditDialog from "./EditDialog";

const columns = [
  // { field: "no", headerName: "編號", width: 70 },
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "品名", width: 70 },
  { field: "price", headerName: "價格", width: 70 },
  { field: "created_time", headerName: "建立時間", width: 300 },
  { field: "updated_time", headerName: "更新時間", width: 300 },
  { field: "deleted_time", headerName: "刪除時間", width: 300 },
];

export const Product = () => {
  const { patch, post, deleteApi, loading, showAlert } = useAPI();
  const { queryProduct } = useData();
  const [resData, setResData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [condition, setCondition] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deletedDialogOpen, setDeletedDialogOpen] = useState(false);
  const [createdDialogOpen, setCreatedDialogOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [deletedId, setDeletedId] = useState(null);

  useEffect(() => {
    if (editRow === null) {
      setDialogOpen(false);
    } else {
      setDialogOpen(true);
    }
  }, [editRow]);

  useEffect(() => {
    if (deletedId === null) {
      setDeletedDialogOpen(false);
    } else {
      setDeletedDialogOpen(true);
    }
  }, [deletedId]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const parseToApiParams = (newRow) => {
    for (let key in newRow) {
      switch (key) {
        case "county":
          newRow[key] = newRow[key] === "null" ? null : newRow[key];
          break;
        case "district":
          newRow[key] = newRow[key] === "null" ? null : newRow[key];
          break;
        case "category":
          newRow[key] = newRow[key] === "null" ? null : newRow[key];
          break;
      }
    }
    //return newRow;
  };

  // #region Query
  const query = async (newCondition) => {
    const apiParams = { ...newCondition };
    parseToApiParams(apiParams);
    const resData = await post(
      apiUris.queryProduct,
      apiParams,
      setResData
    );
  };

  const handleSearch = (newCondition) => {
    setCondition(newCondition);
    query(newCondition);
    handleToggle();
  };

  const handlePaging = (event, value) => {
    const newCondition = { ...condition, page_index: value - 1 };
    setCondition(newCondition);
    query(newCondition);
  };
  // #endregion

  // #region Update
  const updateRow = async (newRow) => {
    const apiParams = { ...newRow };
    parseToApiParams(apiParams);
    const updatedResData = await patch(apiUris.updateProduct, apiParams);
    if (updatedResData.code === 0) {
      showAlert("更新成功", "success");
      setEditRow(null);
      query(condition);
      queryProduct();
    }
  };

  const handleEdit = (newRow) => {
    setEditRow(newRow);
  };

  const handleClose = () => {
    setEditRow(null);
  };
  // #endregion

  // #region Delete
  const deleteRow = async (id) => {
    const deletedResData = await deleteApi(
      apiUris.deleteProduct,
      { id },
      setResData
    );
    if (deletedResData.code === 0) {
      showAlert("刪除成功", "success");
      setDeletedId(null);
      query(condition);
      queryProduct();
    }
  };

  const handleDelete = (id) => {
    setDeletedId(id);
  };

  const handleDeletedClose = () => {
    setDeletedId(null);
  };
  // #endregion

  // #region Create
  const handleCreateRow = async (newRow) => {
    const apiParams = { ...newRow };
    parseToApiParams(apiParams);
    const addedResData = await post(apiUris.createProduct, newRow);
    if (addedResData.code === 0) {
      showAlert("新增成功", "success");
      setCreatedDialogOpen(false);
      queryProduct();
    }
  };

  const handleShowCreatedDialog = () => {
    setCreatedDialogOpen(true);
  };

  const handleCloseCreatedDialog = () => {
    setCreatedDialogOpen(false);
  };
  // #endregion

  return (
    <div style={{ position: "relative" }}>
      <h2 style={{ marginLeft: "30px" }}>商品管理</h2>
      {loading && <LoadingOverlay />}
      <Collapse in={isExpanded}>
        <Condition
          handleSearch={handleSearch}
          onShowCreatedDialog={handleShowCreatedDialog}
        />
      </Collapse>
      <IconButton onClick={handleToggle} sx={{ position: "relative" }}>
        查詢
        {isExpanded ? <ExpandLess /> : <ExpandMore />}
      </IconButton>
      <PagingTable
        style={{ position: "relative", height: "calc(100vh - 62px)" }}
        columns={columns}
        resData={resData}
        handlePaging={handlePaging}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <EditDialog
        editRow={editRow}
        dialogOpen={dialogOpen}
        handleClose={handleClose}
        handleUpdate={updateRow}
      />
      <DeletedDialog
        id={deletedId}
        dialogOpen={deletedDialogOpen}
        handleClose={handleDeletedClose}
        handleDeleteRow={deleteRow}
      />
      <CreatedDialog
        dialogOpen={createdDialogOpen}
        onCloseDialog={handleCloseCreatedDialog}
        onSubmit={handleCreateRow}
      />
    </div>
  );
};

export default React.memo(Product);
