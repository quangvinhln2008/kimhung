import React, {useState, useEffect} from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import moment from 'moment'
import { Divider, Typography, Button, Alert, Modal, Space, Input, Table, Form, Tag, Spin, Popconfirm, DatePicker  } from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {VStack, HStack} from  '@chakra-ui/react';

const { Title } = Typography;
const KichThuoc = () =>{
  
  const [form] = Form.useForm();
  const [data, setData] = useState()
  const [editMode, setEditMode] = useState(false)
  const [dataEdit, setDataEdit] = useState()
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false)
  const [openModalContact, setOpenModalContact] = useState(false)
  
  useEffect(()=>{
    loadKichThuoc()
  },[refresh])
  
useEffect(()=>{
    
    form.setFieldsValue({
      MaKichThuoc: dataEdit?.MaKichThuoc,  
      TenKichThuoc: dataEdit?.TenKichThuoc
    })
  }, [dataEdit])

  function toogleModalFormContact(){
    setOpenModalContact(!openModalContact)
  }

  function openCreateMode(){
    setEditMode(false)
    setOpenModalContact(!openModalContact)

    form.setFieldsValue({
      MaKichThuoc: "",
      TenKichThuoc: "",
    })
  }

  async function loadKichThuoc(){
    return await axios
      .get('http://localhost:3001/KichThuoc')
      .then((res) => {
        const result = {
          status: res.data.status,
          data: res.data.result.recordset,
        }
        setData(res.data.result.recordset)
        setLoading(false)
        return(result)
      })
      .catch(function (error) {
        // handle error
        console.log(error.response)
      })
  }

  async function GetKichThuocEdit(MaKichThuoc){
    
    setEditMode(true)
    return await axios
      .get(`http://localhost:3001/KichThuoc/${MaKichThuoc}`)
      .then((res) => {
        const result = {
          status: res.status,
          data: res.data.result.recordset[0],
        }
        setDataEdit(result.data)
        setOpenModalContact(!openModalContact)

        return(result)
      })
      .catch(function (error) {
        // handle error
        console.log(error.response)
        toast.error(error?.response)
      })
  };

  async function CreateKichThuoc(values){
    console.log('values', values)
    return await axios
      .post('http://localhost:3001/KichThuoc/create', {MaKichThuoc: values.MaKichThuoc,TenKichThuoc: values.TenKichThuoc})
      .then((res) => {
        const result = {
          status: res.status,
          data: res.data.result.recordset,
        }
        result?.data[0].status === 200 ? toast.success(result?.data[0].message): toast.error(result?.data[0].message)
        setRefresh(!refresh)
        setOpenModalContact(!openModalContact)
        return(result)
      })
      .catch(function (error) {
        // handle error
        console.log(error.response)
        toast.error(error?.response)
      })
  };

  async function UpdateKichThuoc(values){
    console.log('run update')
    return await axios
      .post(`http://localhost:3001/KichThuoc/${dataEdit?.id}`, {MaKichThuoc: values.MaKichThuoc, TenKichThuoc: values.TenKichThuoc})
      .then((res) => {
        const result = {
          status: res.status,
          data: res.data.result.recordset,
        }
        result?.data[0].status === 200 ? toast.success(result?.data[0].message): toast.error(result?.data[0].message)
        setRefresh(!refresh)
        setOpenModalContact(!openModalContact)
        return(result)
      })
      .catch(function (error) {
        // handle error
        console.log(error.response)
        toast.error(error?.response)
      })
  };

  async function DeleteKichThuoc(MaKichThuoc){
    return await axios
      .post(`http://localhost:3001/KichThuoc/delete/${MaKichThuoc}`)
      .then((res) => {
        const result = {
          status: res.status,
          data: res.data.result.recordset,
        }
        result?.data[0].status === 200 ? toast.success(result?.data[0].message): toast.error(result?.data[0].message)
        setRefresh(!refresh)
        return(result)
      })
      .catch(function (error) {
        // handle error
        console.log(error.response)
        toast.error(error?.response)
      })
  };

  const columns = [
    {
      title: 'Mã kích thước',
      dataIndex: 'MaKichThuoc',
      key: 'MaKichThuoc',
    },
    {
      title: 'Tên kích thước',
      dataIndex: 'TenKichThuoc',
      key: 'TenKichThuoc',
    },
    {
      title: 'Tình trạng',
      key: 'Is_Deleted',
      dataIndex: 'Is_Deleted',
      render: (_, record) => (                   
          <Tag color={record.Is_Deleted ? 'volcano' :'green'} key={record.MaCoSo}>
            {record.Is_Deleted ? 'DELETED': 'ACTIVE'}
          </Tag>         
      )
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <>
          <Space size="middle">
            {!record.Is_Deleted && <Button key={record.id} type="link" onClick= {() =>{GetKichThuocEdit(record.id)}}>Cập nhật</Button>}
          </Space>
          <Space size="middle">
          {!record.Is_Deleted && <>
              <Popconfirm
                title="Bạn có chắc xóa kích thước không?"
                onConfirm={()=>{DeleteKichThuoc(record.id)}}
                okText="Yes"
                cancelText="No"
              >
                <Button key={record.id} type="link" danger >Xóa</Button>
              </Popconfirm>
            </>}
          </Space>
        </>
        
      ),
    },
  ];

  return(
    <>
      <Title level={3}>Kích thước</Title>
      <Divider />
      <VStack justifyContent={"start"} alignItems="start">
      <Space align="left" style={{ marginBottom: 16 }}>
        <Button  onClick={openCreateMode}  type="primary" icon={<PlusCircleOutlined />}>
            Thêm mới
          </Button>
        </Space>
        <Divider />
        {loading ? 
            <>
              <Spin tip="Loading..." spinning={loading}>
                <Alert
                  message="Đang lấy dữ liệu"
                  description="Vui lòng chờ trong giây lát."
                  type="info"
                />
              </Spin>
            </> 
            :
              <Table columns={columns} dataSource={data} />}
      </VStack>

      {/* Modal thêm mới */}
      <Modal
        open={openModalContact}
        title={!editMode ? "Thêm mới kích thước" : "Cập nhật kích thước"}
        onCancel={toogleModalFormContact}
        footer={null}
      >
      <Form form={form} 
          name="control-hooks"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          onFinish={!editMode? CreateKichThuoc: UpdateKichThuoc}
        > 
          <Form.Item
          label="Mã kích thước: "
          name="MaKichThuoc"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mã kích thước!'
            },
          ]}
        >
        <Input  />
        </Form.Item>
          <Form.Item
            label="Tên kích thước: "
            name="TenKichThuoc"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên kích thước!'
              },
            ]}
          >
          <Input  />
          </Form.Item>
          <HStack justifyContent="end">
            <Button key="back" onClick={toogleModalFormContact}>Thoát</Button>
            <Button key="save" type="primary"  htmlType="submit">Lưu</Button>
          </HStack>
        </Form>
      </Modal>
    </>
  )
}

export default KichThuoc;