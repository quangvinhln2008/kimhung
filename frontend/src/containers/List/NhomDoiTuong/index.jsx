import React, {useState, useEffect} from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import { Divider, Typography, Button, Alert, Modal, Space, Input, Table, Form, Tag, Spin, Popconfirm  } from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {VStack, HStack} from  '@chakra-ui/react';

const { Title } = Typography;
const NhomDoiTuong = () =>{
  
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
    loadNhomDoiTuong()
  },[refresh])

  useEffect(()=>{
    form.setFieldsValue({
        TenNhomDoiTuong: dataEdit?.TenNhomDoiTuong
    })
  }, [dataEdit])

  function toogleModalFormContact(){
    setOpenModalContact(!openModalContact)
  }

  function openCreateMode(){
    setEditMode(false)
    setOpenModalContact(!openModalContact)

    form.setFieldsValue({
      TenNhomDoiTuong: ""
    })
  }

  async function loadNhomDoiTuong(){
    return await axios
      .get('https://testkhaothi.ufm.edu.vn:3002/nhomdoituong')
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

  async function GetNhomDoiTuongEdit(MaNhomDoiTuong){
    setEditMode(true)
    return await axios
      .get(`https://testkhaothi.ufm.edu.vn:3002/nhomdoituong/${MaNhomDoiTuong}`)
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

  async function CreateNhomDoiTuong(values){
    
    return await axios
      .post('https://testkhaothi.ufm.edu.vn:3002/nhomdoituong/create', {TenNhomDoiTuong: values.TenNhomDoiTuong})
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

  async function UpdateNhomDoiTuong(values){
    console.log('run update')
    return await axios
      .post(`https://testkhaothi.ufm.edu.vn:3002/NhomDoiTuong/${dataEdit?.MaNhomDoiTuong}`, {TenNhomDoiTuong: values.TenNhomDoiTuong})
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

  async function DeleteNhomDoiTuong(MaNhomDoiTuong){
    return await axios
      .post(`https://testkhaothi.ufm.edu.vn:3002/nhomdoituong/delete/${MaNhomDoiTuong}`)
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
      title: 'Tên nhóm đối tượng',
      dataIndex: 'TenNhomDoiTuong',
      key: 'TenNhomDoiTuong',
    },
    {
      title: 'Tình trạng',
      key: 'Is_Deleted',
      dataIndex: 'Is_Deleted',
      render: (_, record) => (                   
          <Tag color={record.Is_Deleted ? 'volcano' :'green'} key={record.MaNhomDoiTuong}>
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
            {!record.Is_Deleted && <Button key={record.MaNhomDoiTuong} type="link" onClick= {() =>{GetNhomDoiTuongEdit(record.MaNhomDoiTuong)}}>Cập nhật</Button>}
          </Space>
          <Space size="middle">
          {!record.Is_Deleted && <>
              <Popconfirm
                title="Bạn có chắc xóa nhóm đối tượng không?"
                onConfirm={()=>{DeleteNhomDoiTuong(record.MaNhomDoiTuong)}}
                okText="Yes"
                cancelText="No"
              >
                <Button key={record.MaNhomDoiTuong} type="link" danger >Xóa</Button>
              </Popconfirm>
            </>}
          </Space>
        </>
        
      ),
    },
  ];

  return(
    <>
      <Title level={3}>Nhóm đối tượng</Title>
      <Divider />
      <VStack justifyContent={"start"} alignItems="start">
      <Space align="left" style={{ marginBottom: 16 }}>
        <Button  onClick={openCreateMode} type="primary" icon={<PlusCircleOutlined />}>
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
        title={!editMode ? "Thêm mới nhóm đối tượng" : "Cập nhật nhóm đối tượng"}
        // onOk={submitChangeEmail}
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
          onFinish={!editMode? CreateNhomDoiTuong: UpdateNhomDoiTuong}
        >
          <Form.Item
            label="Tên nhóm đối tượng: "
            name="TenNhomDoiTuong"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên nhóm đối tượng!'
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

export default NhomDoiTuong;