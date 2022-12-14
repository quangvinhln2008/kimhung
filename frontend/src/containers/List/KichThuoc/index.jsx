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
      .get('https://testkhaothi.ufm.edu.vn:3002/KichThuoc')
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
      .get(`https://testkhaothi.ufm.edu.vn:3002/KichThuoc/${MaKichThuoc}`)
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
      .post('https://testkhaothi.ufm.edu.vn:3002/KichThuoc/create', {MaKichThuoc: values.MaKichThuoc,TenKichThuoc: values.TenKichThuoc})
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
      .post(`https://testkhaothi.ufm.edu.vn:3002/KichThuoc/${dataEdit?.id}`, {MaKichThuoc: values.MaKichThuoc, TenKichThuoc: values.TenKichThuoc})
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
      .post(`https://testkhaothi.ufm.edu.vn:3002/KichThuoc/delete/${MaKichThuoc}`)
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
      title: 'M?? k??ch th?????c',
      dataIndex: 'MaKichThuoc',
      key: 'MaKichThuoc',
    },
    {
      title: 'T??n k??ch th?????c',
      dataIndex: 'TenKichThuoc',
      key: 'TenKichThuoc',
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
            {!record.Is_Deleted && <Button key={record.id} type="link" onClick= {() =>{GetKichThuocEdit(record.id)}}>C???p nh???t</Button>}
          </Space>
          <Space size="middle">
          {!record.Is_Deleted && <>
              <Popconfirm
                title="B???n c?? ch???c x??a k??ch th?????c kh??ng?"
                onConfirm={()=>{DeleteKichThuoc(record.id)}}
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
      <Title level={3}>K??ch th?????c</Title>
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

      {/* Modal th??m m???i */}
      <Modal
        open={openModalContact}
        title={!editMode ? "Th??m m???i k??ch th?????c" : "C???p nh???t k??ch th?????c"}
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
          label="M?? k??ch th?????c: "
          name="MaKichThuoc"
          rules={[
            {
              required: true,
              message: 'Vui l??ng nh???p m?? k??ch th?????c!'
            },
          ]}
        >
        <Input  />
        </Form.Item>
          <Form.Item
            label="T??n k??ch th?????c: "
            name="TenKichThuoc"
            rules={[
              {
                required: true,
                message: 'Vui l??ng nh???p t??n k??ch th?????c!'
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

export default KichThuoc;