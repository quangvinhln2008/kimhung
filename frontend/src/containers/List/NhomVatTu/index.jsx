import React, {useState, useEffect} from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import { Divider, Typography, Button, Alert, Modal, Space, Input, Table, Form, Tag, Spin, Popconfirm  } from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {VStack, HStack} from  '@chakra-ui/react';

const { Title } = Typography;
const NhomVatTu = () =>{

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
    loadNhomVatTu()
  },[refresh])

  useEffect(()=>{
    form.setFieldsValue({
      MaNhomVatTu: dataEdit?.MaNhomVatTu,  
      TenNhomVatTu: dataEdit?.TenNhomVatTu
    })
  }, [dataEdit])

  function toogleModalFormContact(){
    setOpenModalContact(!openModalContact)
  }

  function openCreateMode(){
    setEditMode(false)
    setOpenModalContact(!openModalContact)

    form.setFieldsValue({
      MaNhomVatTu: "",
      TenNhomVatTu: "",
    })
  }

  async function loadNhomVatTu(){
    return await axios
      .get('https://testkhaothi.ufm.edu.vn:3002/NhomVatTu')
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

  async function GetNhomVatTuEdit(MaNhomVatTu){
    setEditMode(true)
    return await axios
      .get(`https://testkhaothi.ufm.edu.vn:3002/NhomVatTu/${MaNhomVatTu}`)
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

  async function CreateNhomVatTu(values){
    
    return await axios
      .post('https://testkhaothi.ufm.edu.vn:3002/NhomVatTu/create', {MaNhomVatTu: values.MaNhomVatTu,TenNhomVatTu: values.TenNhomVatTu, DiaChiNhomVatTu: values.DiaChiNhomVatTu})
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

  async function UpdateNhomVatTu(values){
    console.log('run update')
    return await axios
      .post(`https://testkhaothi.ufm.edu.vn:3002/NhomVatTu/${dataEdit?.id}`, {MaNhomVatTu: values.MaNhomVatTu, TenNhomVatTu: values.TenNhomVatTu, DiaChiNhomVatTu: values.DiaChiNhomVatTu})
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

  async function DeleteNhomVatTu(MaNhomVatTu){
    return await axios
      .post(`https://testkhaothi.ufm.edu.vn:3002/NhomVatTu/delete/${MaNhomVatTu}`)
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
      title: 'Mã nhóm vật tư',
      dataIndex: 'MaNhomVatTu',
      key: 'MaNhomVatTu',
    },
    {
      title: 'Tên nhóm vật tư',
      dataIndex: 'TenNhomVatTu',
      key: 'TenNhomVatTu',
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
            {!record.Is_Deleted && <Button key={record.id} type="link" onClick= {() =>{GetNhomVatTuEdit(record.id)}}>Cập nhật</Button>}
          </Space>
          <Space size="middle">
          {!record.Is_Deleted && <>
              <Popconfirm
                title="Bạn có chắc xóa nhóm vật tư không?"
                onConfirm={()=>{DeleteNhomVatTu(record.id)}}
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
      <Title level={3}>Nhóm vật tư</Title>
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
        title={!editMode ? "Thêm mới nhóm vật tư" : "Cập nhật nhóm vật tư"}
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
          onFinish={!editMode? CreateNhomVatTu: UpdateNhomVatTu}
        >
          <Form.Item
            label="Mã nhóm vật tư: "
            name="MaNhomVatTu"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mã nhóm vật tư!'
              },
            ]}
          >
          <Input  />
          </Form.Item>
          <Form.Item
            label="Tên nhóm vật tư: "
            name="TenNhomVatTu"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên nhóm vật tư!'
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

export default NhomVatTu;