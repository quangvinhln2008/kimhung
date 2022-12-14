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
      title: 'T??n nh??m ?????i t?????ng',
      dataIndex: 'TenNhomDoiTuong',
      key: 'TenNhomDoiTuong',
    },
    {
      title: 'T??nh tr???ng',
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
            {!record.Is_Deleted && <Button key={record.MaNhomDoiTuong} type="link" onClick= {() =>{GetNhomDoiTuongEdit(record.MaNhomDoiTuong)}}>C???p nh???t</Button>}
          </Space>
          <Space size="middle">
          {!record.Is_Deleted && <>
              <Popconfirm
                title="B???n c?? ch???c x??a nh??m ?????i t?????ng kh??ng?"
                onConfirm={()=>{DeleteNhomDoiTuong(record.MaNhomDoiTuong)}}
                okText="Yes"
                cancelText="No"
              >
                <Button key={record.MaNhomDoiTuong} type="link" danger >X??a</Button>
              </Popconfirm>
            </>}
          </Space>
        </>
        
      ),
    },
  ];

  return(
    <>
      <Title level={3}>Nh??m ?????i t?????ng</Title>
      <Divider />
      <VStack justifyContent={"start"} alignItems="start">
      <Space align="left" style={{ marginBottom: 16 }}>
        <Button  onClick={openCreateMode} type="primary" icon={<PlusCircleOutlined />}>
            Th??m m???i
          </Button>
        </Space>
        <Divider />
        {loading ? 
            <>
              <Spin tip="Loading..." spinning={loading}>
                <Alert
                  message="??ang l???y d??? li???u"
                  description="Vui l??ng ch??? trong gi??y l??t."
                  type="info"
                />
              </Spin>
            </> 
            :
              <Table columns={columns} dataSource={data} />}
      </VStack>

      {/* Modal th??m m???i */}
      <Modal
        open={openModalContact}
        title={!editMode ? "Th??m m???i nh??m ?????i t?????ng" : "C???p nh???t nh??m ?????i t?????ng"}
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
            label="T??n nh??m ?????i t?????ng: "
            name="TenNhomDoiTuong"
            rules={[
              {
                required: true,
                message: 'Vui l??ng nh???p t??n nh??m ?????i t?????ng!'
              },
            ]}
          >
          <Input  />
          </Form.Item>

          <HStack justifyContent="end">
            <Button key="back" onClick={toogleModalFormContact}>Tho??t</Button>
            <Button key="save" type="primary"  htmlType="submit">L??u</Button>
          </HStack>
        </Form>
      </Modal>
    </>
  )
}

export default NhomDoiTuong;