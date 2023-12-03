import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Checkbox, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import "./themes/Table.scss";

const MyTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        const result = await response.json();
        const newData = result.map((user) => ({
          key: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }));
        setData(newData);
        setFilteredData(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  const onSelectAllChange = (e) => {
    const allRowKeys = filteredData.map((row) => row.key);
    setSelectedRowKeys(e.target.checked ? allRowKeys : []);
  };

  const isEditing = (record) => record.key === editingKey;

  const edit = (key) => {
    setEditingKey(key);
  };

  const cancel = () => {
    setEditingKey(null);
  };

  const save = (form, key) => {
    const newData = [...filteredData];
    const index = newData.findIndex((item) => key === item.key);

    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, ...form });
      setFilteredData(newData);
      setEditingKey(null);
    }
  };

  const handleDelete = (record) => {
    const newData = filteredData.filter((row) => row.key !== record.key);
    setFilteredData(newData);
    setSelectedRowKeys(selectedRowKeys.filter((key) => key !== record.key));
    setEditingKey(null);
  };

  const handleInputChange = (e, fieldName, key) => {
    const { value } = e.target;
    const newData = [...filteredData];
    const index = newData.findIndex((item) => key === item.key);

    if (index > -1) {
      newData[index][fieldName] = value;
      setFilteredData(newData);
      console.log(searchText);
    }
  };

  const handleSearch = (value) => {
    const filtered = data.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.email.toLowerCase().includes(value.toLowerCase()) ||
        item.role.toLowerCase().includes(value.toLowerCase())
    );

    setSearchText(value);
    setFilteredData(filtered);
  };

  const columns = [
    {
      title: (
        <Tooltip title="All Pages">
          <Checkbox
            checked={selectedRowKeys.length === filteredData.length}
            onChange={onSelectAllChange}
          />
        </Tooltip>
      ),
      dataIndex: "key",
      render: (_, record) => (
        <div>
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      editable: true,
      render: (text, record) => {
        const isEdit = isEditing(record);
        return isEdit ? (
          <Input
            value={text}
            onChange={(e) => handleInputChange(e, "name", record.key)}
          />
        ) : (
          text
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      editable: true,
      render: (text, record) => {
        const isEdit = isEditing(record);
        return isEdit ? (
          <Input
            value={text}
            onChange={(e) => handleInputChange(e, "email", record.key)}
          />
        ) : (
          text
        );
      },
    },
    {
      title: "Role",
      dataIndex: "role",
      editable: true,
      render: (text, record) => {
        const isEdit = isEditing(record);
        return isEdit ? (
          <Input
            value={text}
            onChange={(e) => handleInputChange(e, "role", record.key)}
          />
        ) : (
          text
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => {
        const isEdit = isEditing(record);

        return isEdit ? (
          <Space size="middle">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => save(record, record.key)}
            >
              Save
            </Button>
            <Button type="default" icon={<CloseOutlined />} onClick={cancel}>
              Cancel
            </Button>
          </Space>
        ) : (
          <Space size="middle">
            <Tooltip title="Edit row">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => edit(record.key)}
                className="edit"
              >
                Edit
              </Button>
            </Tooltip>
            <Tooltip title="Delete row">
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record)}
                className="delete"
              >
                Delete
              </Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const handleDeleteSelected = () => {
    const newData = filteredData.filter(
      (row) => !selectedRowKeys.includes(row.key)
    );
    setFilteredData(newData);
    setSelectedRowKeys([]);
    setEditingKey(null);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div className="main">
      <div className="Table-Head">
        <Input
          className="search-bar"
          placeholder="Search..."
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ margin: "8px", width: "200px" }}
        />
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={handleDeleteSelected}
          className="delete-selected"
        >
          Delete Selected
        </Button>
      </div>
      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={{
          position: ["bottomCenter"],
          pageSize: 10,
          showSizeChanger: false,
          showQuickJumper: true,
          total: filteredData.length,
        }}
        rowSelection={rowSelection}
        rowKey={(record) => record.key}
        loading={loading}
        style={{ marginBottom: "8px" }}
      />
    </div>
  );
};

export default MyTable;
