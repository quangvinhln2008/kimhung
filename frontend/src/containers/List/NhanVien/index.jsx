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
      title: 'Mã nhân viên',
      dataIndex: 'MaNhanVien',
      key: 'MaNhanVien',
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'TenNhanVien',
      key: 'TenNhanVien',
    },
    {
      title: 'Quyền truy cập',
      dataIndex: 'Role',
      key: 'Role',
      render: (_, record) => (                   
        <Tag color={record.Role.toLowerCase() === 'user' ? 'volcano' :'green'} key={record.MaKho}>
          {record.Role.toUpperCase()}
        </Tag>         
    )
    },
    {
      title: 'Tình trạng',
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
            {!record.Is_Deleted && <Button key={record.MaNhanVien} type="link" onClick= {() =>{GetNhanVienEdit(record.MaNhanVien)}}>Cập nhật</Button>}
          </Space>
          <Space size="middle">
          {!record.Is_Deleted && <>
              <Popconfirm
                title="Bạn có chắc xóa nhân viên không?"
                onConfirm={()=>{DeleteNhanVien(record.MaNhanVien)}}
                okText="Yes"
                cancelText="No"
              >
                <Button key={record.MaNhanVien} type="link" danger >Xóa</Button>
              </Popconfirm>
            </>}
          </Space>
        </>
        
      ),
    },
  ];

  return(
    <>
      <Title level={3}>Nhân viên</Title>
      <Divider />
      <VStack justifyContent={"start"} alignItems="start">
        <Space align="left" style={{ marginBottom: 16 }}>
          <Button  onClick={openCreateMode}  type="primary" icon={<PlusCircleOutlined />}>
              Thêm mới
          </Button>
          {/* <Button  onClick={toogleModalFormContact} icon={<SearchOutlined />}>
              Tìm kiếm
          </Button> */}
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
        title={!editMode ? "Thêm mới nhân viên" : "Cập nhật nhân viên"}
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
            label="Mã nhân viên: "
            name="MaNhanVien"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mã nhân viên!'
              },
            ]}
          >
          <Input  />
          </Form.Item>
          
          <Form.Item
            label="Tên nhân viên: "
            name="TenNhanVien"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên nhân viên!'
              },
            ]}
          >
          <Input  />
          </Form.Item>
          <Form.Item
            label="Điện thoại: "
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
                message: 'Vui lòng chọn kho!'
              },
            ]}
          >
          <Select options={dataCoSo} />
          </Form.Item>
          <Divider plain>Thông tin đăng nhập</Divider>
          <Form.Item
            label="Tên đăng nhập: "
            name="TenDangNhap"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên đăng nhập!'
              },
            ]}
          >
          <Input  />
          </Form.Item>
          <Form.Item
            label="Mật khẩu đăng nhập: "
            name="MatKhauDangNhap"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!'
              },
            ]}
          >
          <Input.Password  />
          </Form.Item>
          <Form.Item
            label="Quyền truy cập: "
            name="Role"
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn quyền truy cập!'
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

export default NhanVien;