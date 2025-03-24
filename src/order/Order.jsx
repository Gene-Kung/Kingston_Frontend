import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { LoadingOverlay } from "../components/loading/Loading";
import { PagingTableDetail } from "../components/table/PagingTableDetail";
import { apiUris } from "../config/Api";
import { useAPI } from "../context/APIContext";
import Condition from "./Condition";
import CreatedDialog from "./CreatedDialog";
import DeletedDialog from "./DeletedDialog";
import DetailDialog from "./DetailDialog";
import EditDialog from "./EditDialog";

const columns = [
  // { field: "no", headerName: "編號", width: 70 },
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "名稱", width: 70 },
  { field: "phone", headerName: "電話", width: 200 },
  { field: "created_user_id", headerName: "建立者ID", width: 200 },
  { field: "total_price", headerName: "總金額", width: 200 },
  { field: "created_time", headerName: "建立時間", width: 300 },
  { field: "updated_time", headerName: "更新時間", width: 300 },
  { field: "deleted_time", headerName: "刪除時間", width: 300 },
];

export const Order = () => {
  const { loginStatus, patch, post, deleteApi, loading, showAlert } = useAPI();
  const [resData, setResData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [condition, setCondition] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deletedDialogOpen, setDeletedDialogOpen] = useState(false);
  const [createdDialogOpen, setCreatedDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [deletedId, setDeletedId] = useState(null);
  const [DetailRow, setDetail] = useState(null);

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

  useEffect(() => {
    if (DetailRow === null) {
      setDetailDialogOpen(false);
    } else {
      setDetailDialogOpen(true);
    }
  }, [DetailRow]);

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
      apiUris.queryOrder,
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
    const updatedResData = await patch(apiUris.updateOrder, apiParams);
    if (updatedResData.code === 0) {
      showAlert("更新成功", "success");
      setEditRow(null);
      query(condition);
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
      apiUris.deleteOrder,
      { id },
      setResData
    );
    if (deletedResData.code === 0) {
      showAlert("刪除成功", "success");
      setDeletedId(null);
      query(condition);
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
    const addedResData = await post(apiUris.createOrder, newRow);
    if (addedResData.code === 0) {
      showAlert("新增成功", "success");
      setCreatedDialogOpen(false);
    }
  };

  const handleShowCreatedDialog = () => {
    setCreatedDialogOpen(true);
  };

  const handleCloseCreatedDialog = () => {
    setCreatedDialogOpen(false);
  };


  // #endregion

  // #region Update
  const handleDetail = (newRow) => {
    setDetail(newRow);
  }

  const handleCloseDetailDialog = () => {
    setDetail(null);
  };
  // #endregion

  return (
    <div style={{ position: "relative" }}>
      <h2 style={{ marginLeft: "30px" }}>訂單管理</h2>
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
      <PagingTableDetail
        style={{ position: "relative", height: "calc(100vh - 62px)" }}
        columns={columns}
        resData={resData}
        handlePaging={handlePaging}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleDetail={handleDetail}
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
      <DetailDialog
        editRow={DetailRow}
        dialogOpen={detailDialogOpen}
        handleClose={handleCloseDetailDialog}
      />
    </div>
  );
};

export default React.memo(Order);
