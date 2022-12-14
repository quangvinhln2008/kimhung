import React, {useState, useEffect} from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import { Divider, Typography, Button, Select, Modal, Space, Input, Table, Form, Tag, Popconfirm , Alert, Spin} from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {VStack, HStack} from  '@chakra-ui/react';

const { Title } = Typography;
const DoiTuong = () =>{
  
  const [form] = Form.useForm();
  const [data, setData] = useState()
  const [editMode, setEditMode] = useState(false)
  const [dataEdit, setDataEdit] = useState()
  const [dataNhomDoiTuong, setDataNhomDoiTuong] = useState()
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false)
  const [openModalContact, setOpenModalContact] = useState(false)

  useEffect(()=>{
    loadDoiTuong()
  },[refresh])

  useEffect(()=>{
    form.setFieldsValue({
        TenDoiTuong: dataEdit?.TenDoiTuong,
        MaNhomDoiTuong: dataEdit?.MaNhomDoiTuong
    })
  }, [dataEdit])

  function toogleModalFormContact(){
    setOpenModalContact(!openModalContact)
  }

  function openCreateMode(){
    setEditMode(false)
    setOpenModalContact(!openModalContact)

    form.setFieldsValue({
      TenDoiTuong: "",
      MaNhomDoiTuong: ""
    })
  }

  async function loadDoiTuong(){
    return await axios
      .get('https://testkhaothi.ufm.edu.vn:3002/DoiTuong')
      .then((res) => {
        const result = {
          status: res.data.status,
          data: res.data.result.recordsets,
        }
        setData(result.data[0])
        setDataNhomDoiTuong(result.data[1])
        setLoading(false)
        return(result)
      })
      .catch(function (error) {
        // handle error
        console.log(error.response)
      })
  }

  async function GetDoiTuongEdit(MaDoiTuong){
    setEditMode(true)
    return await axios
      .get(`https://testkhaothi.ufm.edu.vn:3002/DoiTuong/${MaDoiTuong}`)
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

  async function CreateDoiTuong(values){
    return await axios
      .post('https://testkhaothi.ufm.edu.vn:3002/DoiTuong/create', {TenDoiTuong: values.TenDoiTuong, MaNhomDoiTuong: values.MaNhomDoiTuong})
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

  async function UpdateDoiTuong(values){
    console.log('run update')
    return await axios
      .post(`https://testkhaothi.ufm.edu.vn:3002/DoiTuong/${dataEdit?.MaDoiTuong}`, {TenDoiTuong: values.TenDoiTuong, MaNhomDoiTuong: values.MaNhomDoiTuong})
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

  async function DeleteDoiTuong(MaDoiTuong){
    return await axios
      .post(`https://testkhaothi.ufm.edu.vn:3002/DoiTuong/delete/${MaDoiTuong}`)
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
      dataIndex: 'TenDoiTuong',
      key: 'TenDoiTuong',
    },
    {
      title: 'Nh??m ?????i t?????ng',
      dataIndex: 'TenNhomDoiTuong',
      key: 'TenNhomDoiTuong',
    },
    {
      title: 'T??nh tr???ng',
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
            {!record.Is_Deleted && <Button key={record.MaDoiTuong} type="link" onClick= {() =>{GetDoiTuongEdit(record.MaDoiTuong)}}>C???p nh???t</Button>}
          </Space>
          <Space size="middle">
          {!record.Is_Deleted && <>
              <Popconfirm
                title="B???n c?? ch???c x??a ?????i t?????ng kh??ng?"
                onConfirm={()=>{DeleteDoiTuong(record.MaDoiTuong)}}
                okText="Yes"
                cancelText="No"
              >
                <Button key={record.MaDoiTuong} type="link" danger >X??a</Button>
              </Popconfirm>
            </>}
          </Space>
        </>
        
      ),
    },
  ];

  return(
    <>
      <Title level={3}>?????i t?????ng</Title>
      <Divider />
      <VStack justifyContent={"start"} alignItems="start">
        <Space align="left" style={{ marginBottom: 16 }}>
          <Button  onClick={openCreateMode}  type="primary" icon={<PlusCircleOutlined />}>
              Th??m m???i
          </Button>
          {/* <Button  onClick={toogleModalFormContact} icon={<SearchOutlined />}>
              T??m ki???m
          </Button> */}
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
        title={!editMode ? "Th??m m???i ?????i t?????ng" : "C???p nh???t ?????i t?????ng"}
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
          onFinish={!editMode? CreateDoiTuong: UpdateDoiTuong}
        >
          <Form.Item
            label="T??n ?????i t?????ng: "
            name="TenDoiTuong"
            rules={[
              {
                required: true,
                message: 'Vui l??ng nh???p t??n c?? s???!'
              },
            ]}
          >
          <Input  />
          </Form.Item>
          <Form.Item
            label="Nh??m ?????i t?????ng: "
            name="MaNhomDoiTuong"
            rules={[
              {
                required: true,
                message: 'Vui l??ng ch???n nh??m ?????i t?????ng!'
              },
            ]}
          >
          <Select options={dataNhomDoiTuong} />
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

export default DoiTuong;