import React, {useState, useEffect} from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import { Divider, Typography, Button, Alert, Modal, Space, Input, Table, Form, Tag, Spin, Popconfirm  } from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {VStack, HStack} from  '@chakra-ui/react';

const { Title } = Typography;
const LoaiHinhSach = () =>{

  const [form] = Form.useForm();
  const [data, setData] = useState()
  const [editMode, setEditMode] = useState(false)
  const [dataEdit, setDataEdit] = useState()
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false)
  const [openModalContact, setOpenModalContact] = useState(false)

  function toogleModalFormContact(){
    setOpenModalContact(!openModalContact)
  }

 
  useEffect(()=>{
    loadLoaiHinhSach()
  },[refresh])

  useEffect(()=>{
    form.setFieldsValue({
        TenLoaiHinhSach: dataEdit?.TenLoaiHinhSach
    })
  }, [dataEdit])

  function toogleModalFormContact(){
    setOpenModalContact(!openModalContact)
  }

  function openCreateMode(){
    setEditMode(false)
    setOpenModalContact(!openModalContact)

    form.setFieldsValue({
      TenLoaiHinhSach: "",
    })
  }

  async function loadLoaiHinhSach(){
    return await axios
      .get('http://localhost:3001/loaihinhsach')
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

  async function GetLoaiHinhSachEdit(MaLoaiHinhSach){
    setEditMode(true)
    return await axios
      .get(`http://localhost:3001/loaihinhsach/${MaLoaiHinhSach}`)
      .then((res) => {
        const result = {
          status: res.status,
          data: res.data.result.recordset,
        }
        setDataEdit(result.data[0])
        setOpenModalContact(!openModalContact)
        return(result)
      })
      .catch(function (error) {
        // handle error
        console.log(error.response)
        toast.error(error?.response)
      })
  };

  async function CreateLoaiHinhSach(values){
    
    return await axios
      .post('http://localhost:3001/loaihinhsach/create', {TenLoaiHinhSach: values.TenLoaiHinhSach, DiaChiLoaiHinhSach: values.DiaChiLoaiHinhSach})
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

  async function UpdateLoaiHinhSach(values){
    console.log('run update')
    return await axios
      .post(`http://localhost:3001/loaihinhsach/${dataEdit?.MaLoaiHinhSach}`, {TenLoaiHinhSach: values.TenLoaiHinhSach, DiaChiLoaiHinhSach: values.DiaChiLoaiHinhSach})
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

  async function DeleteLoaiHinhSach(MaLoaiHinhSach){
    return await axios
      .post(`http://localhost:3001/loaihinhsach/delete/${MaLoaiHinhSach}`)
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
      title: 'Tên loại hình sách',
      dataIndex: 'TenLoaiHinhSach',
      key: 'TenLoaiHinhSach',
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
            {!record.Is_Deleted && <Button key={record.MaLoaiHinhSach} type="link" onClick= {() =>{GetLoaiHinhSachEdit(record.MaLoaiHinhSach)}}>Cập nhật</Button>}
          </Space>
          <Space size="middle">
          {!record.Is_Deleted && <>
              <Popconfirm
                title="Bạn có chắc xóa loại hình sách không?"
                onConfirm={()=>{DeleteLoaiHinhSach(record.MaLoaiHinhSach)}}
                okText="Yes"
                cancelText="No"
              >
                <Button key={record.MaLoaiHinhSach} type="link" danger >Xóa</Button>
              </Popconfirm>
            </>}
          </Space>
        </>
        
      ),
    },
  ];

  return(
    <>
      <Title level={3}>Loại hình sách</Title>
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
        title={!editMode ? "Thêm mới loại hình sách" : "Cập nhật loại hình sách"}
        onCancel={toogleModalFormContact}
        footer={null}
      >
      <Form form={form} 
          name="control-hooks"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 20,
          }}
          onFinish={!editMode? CreateLoaiHinhSach: UpdateLoaiHinhSach}
        >
          <Form.Item
            label="Tên loại hình sách: "
            name="TenLoaiHinhSach"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên loại hình sách!'
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

export default LoaiHinhSach;