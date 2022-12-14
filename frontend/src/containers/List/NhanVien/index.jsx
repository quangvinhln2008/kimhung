import React, {useState, useEffect} from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import { Divider, Typography, Button, Select, Modal, Space, Input, Table, Form, Tag, Popconfirm , Alert, Spin} from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {VStack, HStack} from  '@chakra-ui/react';

const { Title } = Typography;
const NhanVien = () =>{
  
  const [form] = Form.useForm();
  const [data, setData] = useState()
  const [editMode, setEditMode] = useState(false)
  const [dataEdit, setDataEdit] = useState()
  const [dataCoSo, setDataCoSo] = useState()
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false)
  const [openModalContact, setOpenModalContact] = useState(false)
  
  useEffect(()=>{
    loadNhanVien()
  },[refresh])

  useEffect(()=>{
    form.setFieldsValue({
        MaNhanVien: dataEdit?.MaNhanVien,
        TenNhanVien: dataEdit?.TenNhanVien,
        DienThoai: dataEdit?.DienThoai,
        MaKho: dataEdit?.MaKho,
        TenDangNhap: dataEdit?.TenDangNhap,
        MatKhauDangNhap: dataEdit?.MatKhauDangNhap,
        Role: dataEdit?.Role,
    })
  }, [dataEdit])

  function toogleModalFormContact(){
    setOpenModalContact(!openModalContact)
  }

  function openCreateMode(){
    setEditMode(false)
    setOpenModalContact(!openModalContact)

    form.setFieldsValue({
      MaNhanVien: "",
        TenNhanVien: "",
        DienThoai: "",
        MaKho: "",
        TenDangNhap: "",
        MatKhauDangNhap: "",
        Role: "",
    })
  }

  async function loadNhanVien(){
    return await axios
      .get('https://testkhaothi.ufm.edu.vn:3002/NhanVien')
      .then((res) => {
        const result = {
          status: res.data.status,
          data: res.data.result.recordsets,
        }
        setData(result.data[0])
        setDataCoSo(result.data[1])
        setLoading(false)
        return(result)
      })
      .catch(function (error) {
        // handle error
        console.log(error.response)
      })
  }

  async function GetNhanVienEdit(MaNhanVien){
    setEditMode(true)
    return await axios
      .get(`https://testkhaothi.ufm.edu.vn:3002/NhanVien/${MaNhanVien}`)
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

  async function CreateNhanVien(values){
    return await axios
      .post('https://testkhaothi.ufm.edu.vn:3002/NhanVien/create', {
        MaNhanVien: values.MaNhanVien, 
        TenNhanVien: values.TenNhanVien, 
        DienThoai : values.DienThoai, 
        MaKho : values.MaKho, 
        TenDangNhap: values.TenDangNhap, 
        MatKhauDangNhap: values.MatKhauDangNhap, 
        Role: values.Role })
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

  async function UpdateNhanVien(values){
    console.log('run update')
    return await axios
      .post(`https://testkhaothi.ufm.edu.vn:3002/NhanVien/${dataEdit?.MaNhanVien}`, {
        MaNhanVien: values.MaNhanVien, 
        TenNhanVien: values.TenNhanVien, 
        DienThoai : values.DienThoai, 
        MaKho : values.MaKho, 
        TenDangNhap: values.TenDangNhap, 
        MatKhauDangNhap: values.MatKhauDangNhap, 
        Role: values.Role })
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

  async function DeleteNhanVien(MaNhanVien){
    return await axios
      .post(`https://testkhaothi.ufm.edu.vn:3002/NhanVien/delete/${MaNhanVien}`)
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
      title: 'M?? nh??n vi??n',
      dataIndex: 'MaNhanVien',
      key: 'MaNhanVien',
    },
    {
      title: 'T??n nh??n vi??n',
      dataIndex: 'TenNhanVien',
      key: 'TenNhanVien',
    },
    {
      title: 'Quy???n truy c???p',
      dataIndex: 'Role',
      key: 'Role',
      render: (_, record) => (                   
        <Tag color={record.Role.toLowerCase() === 'user' ? 'volcano' :'green'} key={record.MaKho}>
          {record.Role.toUpperCase()}
        </Tag>         
    )
    },
    {
      title: 'T??nh tr???ng',
      key: 'Is_Deleted',
      dataIndex: 'Is_Deleted',
      render: (_, record) => (                   
          <Tag color={record.Is_Deleted ? 'volcano' :'green'} key={record.MaKho}>
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
            {!record.Is_Deleted && <Button key={record.MaNhanVien} type="link" onClick= {() =>{GetNhanVienEdit(record.MaNhanVien)}}>C???p nh???t</Button>}
          </Space>
          <Space size="middle">
          {!record.Is_Deleted && <>
              <Popconfirm
                title="B???n c?? ch???c x??a nh??n vi??n kh??ng?"
                onConfirm={()=>{DeleteNhanVien(record.MaNhanVien)}}
                okText="Yes"
                cancelText="No"
              >
                <Button key={record.MaNhanVien} type="link" danger >X??a</Button>
              </Popconfirm>
            </>}
          </Space>
        </>
        
      ),
    },
  ];

  return(
    <>
      <Title level={3}>Nh??n vi??n</Title>
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
        title={!editMode ? "Th??m m???i nh??n vi??n" : "C???p nh???t nh??n vi??n"}
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
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
          onFinish={!editMode? CreateNhanVien: UpdateNhanVien}
        >
          <Form.Item
            label="M?? nh??n vi??n: "
            name="MaNhanVien"
            rules={[
              {
                required: true,
                message: 'Vui l??ng nh???p m?? nh??n vi??n!'
              },
            ]}
          >
          <Input  />
          </Form.Item>
          
          <Form.Item
            label="T??n nh??n vi??n: "
            name="TenNhanVien"
            rules={[
              {
                required: true,
                message: 'Vui l??ng nh???p t??n nh??n vi??n!'
              },
            ]}
          >
          <Input  />
          </Form.Item>
          <Form.Item
            label="??i???n tho???i: "
            name="DienThoai"           
          >
          <Input  />
          </Form.Item>
          <Form.Item
            label="Kho: "
            name="MaKho"
            rules={[
              {
                required: true,
                message: 'Vui l??ng ch???n kho!'
              },
            ]}
          >
          <Select options={dataCoSo} />
          </Form.Item>
          <Divider plain>Th??ng tin ????ng nh???p</Divider>
          <Form.Item
            label="T??n ????ng nh???p: "
            name="TenDangNhap"
            rules={[
              {
                required: true,
                message: 'Vui l??ng nh???p t??n ????ng nh???p!'
              },
            ]}
          >
          <Input  />
          </Form.Item>
          <Form.Item
            label="M???t kh???u ????ng nh???p: "
            name="MatKhauDangNhap"
            rules={[
              {
                required: true,
                message: 'Vui l??ng nh???p m???t kh???u!'
              },
            ]}
          >
          <Input.Password  />
          </Form.Item>
          <Form.Item
            label="Quy???n truy c???p: "
            name="Role"
            rules={[
              {
                required: true,
                message: 'Vui l??ng ch???n quy???n truy c???p!'
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

export default NhanVien;