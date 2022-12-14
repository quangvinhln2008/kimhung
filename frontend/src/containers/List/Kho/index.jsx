import React, {useState, useEffect} from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import { Divider, Typography, Button, Alert, Modal, Space, Input, Table, Form, Tag, Spin, Popconfirm  } from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {VStack, HStack} from  '@chakra-ui/react';

const { Title } = Typography;

const Kho = () =>{
  const [form] = Form.useForm();
  const [data, setData] = useState()
  const [editMode, setEditMode] = useState(false)
  const [dataEdit, setDataEdit] = useState()
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false)
  const [openModalContact, setOpenModalContact] = useState(false)
 
  useEffect(()=>{
    loadKho()
  },[refresh])

  useEffect(()=>{
    form.setFieldsValue({
      MaKho: dataEdit?.MaKho,  
      TenKho: dataEdit?.TenKho,
      DiaChiKho: dataEdit?.DiaChiKho
    })
  }, [dataEdit])

  function toogleModalFormContact(){
    setOpenModalContact(!openModalContact)
  }

  function openCreateMode(){
    setEditMode(false)
    setOpenModalContact(!openModalContact)

    form.setFieldsValue({
      MaKho: "",
      TenKho: "",
      DiaChiKho: ""
    })
  }

  async function loadKho(){
    return await axios
      .get('https://testkhaothi.ufm.edu.vn:3002/kho')
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

  async function GetKhoEdit(MaKho){
    setEditMode(true)
    return await axios
      .get(`https://testkhaothi.ufm.edu.vn:3002/Kho/${MaKho}`)
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

  async function CreateKho(values){
    
    return await axios
      .post('https://testkhaothi.ufm.edu.vn:3002/Kho/create', {MaKho: values.MaKho, TenKho: values.TenKho, DiaChiKho: values.DiaChiKho})
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

  async function UpdateKho(values){
    console.log('run update')
    return await axios
      .post(`https://testkhaothi.ufm.edu.vn:3002/Kho/${dataEdit?.id}`, {MaKho: values.MaKho, TenKho: values.TenKho, DiaChiKho: values.DiaChiKho})
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

  async function DeleteKho(MaKho){
    return await axios
      .post(`https://testkhaothi.ufm.edu.vn:3002/Kho/delete/${MaKho}`)
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
      title: 'M?? kho',
      dataIndex: 'MaKho',
      key: 'MaKho',
    },
    {
      title: 'T??n kho',
      dataIndex: 'TenKho',
      key: 'TenKho',
    },
    {
      title: '?????a ch???',
      dataIndex: 'DiaChiKho',
      key: 'DiaChiKho',
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
            {!record.Is_Deleted && <Button key={record.id} type="link" onClick= {() =>{GetKhoEdit(record.id)}}>C???p nh???t</Button>}
          </Space>
          <Space size="middle">
          {!record.Is_Deleted && <>
              <Popconfirm
                title="B???n c?? ch???c x??a kho kh??ng?"
                onConfirm={()=>{DeleteKho(record.id)}}
                okText="Yes"
                cancelText="No"
              >
                <Button key={record.id} type="link" danger >X??a</Button>
              </Popconfirm>
            </>}
          </Space>
        </>
        
      ),
    },
  ];

  return(
    <>
      <Title level={3}>Danh m???c kho</Title>
      <Divider />
      <VStack justifyContent={"start"} alignItems="start">
        <Space align="left" style={{ marginBottom: 16 }}>
          <Button  onClick={openCreateMode}  type="primary" icon={<PlusCircleOutlined />}>
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

      {/* Modal form */}
      <Modal
        open={openModalContact}
        title={!editMode ? "Th??m m???i kho th?? vi???n" : "C???p nh???t kho th?? vi???n"}
        onCancel={toogleModalFormContact}
        footer={null}
      >
      <Form form={form} 
          name="control-hooks"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 20,
          }}
          onFinish={!editMode? CreateKho: UpdateKho}
        >
          <Form.Item
            label="M?? kho: "
            name="MaKho"
            rules={[
              {
                required: true,
                message: 'Vui l??ng nh???p m?? kho!'
              },
            ]}
          >
          <Input  />
          </Form.Item>
          <Form.Item
            label="T??n kho: "
            name="TenKho"
            rules={[
              {
                required: true,
                message: 'Vui l??ng nh???p t??n kho!'
              },
            ]}
          >
          <Input  />
          </Form.Item>
          <Form.Item
            label="?????a ch??? kho: "
            name="DiaChiKho"            
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

export default Kho;