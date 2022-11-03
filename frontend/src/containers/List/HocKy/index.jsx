import React, {useState, useEffect} from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import moment from 'moment'
import { Divider, Typography, Button, Alert, Modal, Space, Input, Table, Form, Tag, Spin, Popconfirm, DatePicker  } from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {VStack, HStack} from  '@chakra-ui/react';

const { Title } = Typography;
const HocKy = () =>{
  
  const [form] = Form.useForm();
  const [data, setData] = useState()
  const [editMode, setEditMode] = useState(false)
  const [dataEdit, setDataEdit] = useState()
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false)
  const [openModalContact, setOpenModalContact] = useState(false)
  
  useEffect(()=>{
    loadHocKy()
  },[refresh])
  
useEffect(()=>{
    
    form.setFieldsValue({
        TenHocKy: dataEdit?.TenHocKy,
        TuNgay: moment(dataEdit?.TuNgay, 'YYYY/MM/DD'),
        DenNgay: moment(dataEdit?.DenNgay, 'YYYY/MM/DD')
    })
  }, [dataEdit])

  function toogleModalFormContact(){
    setOpenModalContact(!openModalContact)
  }

  function openCreateMode(){
    setEditMode(false)
    setOpenModalContact(!openModalContact)

    form.setFieldsValue({
      TenHocKy: "",
      TuNgay: "",
      DenNgay: ""
    })
  }

  async function loadHocKy(){
    return await axios
      .get('http://localhost:3001/hocky')
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

  async function GetHocKyEdit(MaHocKy){
    
    setEditMode(true)
    return await axios
      .get(`http://localhost:3001/hocky/${MaHocKy}`)
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

  async function CreateHocKy(values){
    console.log('values', values)
    return await axios
      .post('http://localhost:3001/hocky/create', {TenHocKy: values.TenHocKy, TuNgay: values.TuNgay, DenNgay: values.DenNgay})
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

  async function UpdateHocKy(values){
    console.log('run update')
    return await axios
      .post(`http://localhost:3001/hocky/${dataEdit?.MaHocKy}`, {TenHocKy: values.TenHocKy, TuNgay: values.TuNgay.format('YYYY-MM-DD'), DenNgay: values.DenNgay.format('YYYY-MM-DD')})
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

  async function DeleteHocKy(MaHocKy){
    return await axios
      .post(`http://localhost:3001/hocky/delete/${MaHocKy}`)
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
      title: 'Học kỳ',
      dataIndex: 'TenHocKy',
      key: 'TenHocKy',
    },
    {
      title: 'Từ ngày',
      dataIndex: 'TuNgay',
      key: 'TuNgay',
    },{
      title: 'Đến ngày',
      dataIndex: 'DenNgay',
      key: 'DenNgay',
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
            {!record.Is_Deleted && <Button key={record.MaCoSo} type="link" onClick= {() =>{GetHocKyEdit(record.MaHocKy)}}>Cập nhật</Button>}
          </Space>
          <Space size="middle">
          {!record.Is_Deleted && <>
              <Popconfirm
                title="Bạn có chắc xóa học kỳ không?"
                onConfirm={()=>{DeleteHocKy(record.MaHocKy)}}
                okText="Yes"
                cancelText="No"
              >
                <Button key={record.MaHocKy} type="link" danger >Xóa</Button>
              </Popconfirm>
            </>}
          </Space>
        </>
        
      ),
    },
  ];

  return(
    <>
      <Title level={3}>Học kỳ</Title>
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
        title={!editMode ? "Thêm mới học kỳ" : "Cập nhật học kỳ"}
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
          onFinish={!editMode? CreateHocKy: UpdateHocKy}
        >
          <Form.Item
            label="Học kỳ: "
            name="TenHocKy"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên học kỳ!'
              },
            ]}
          >
          <Input  />
          </Form.Item>
          <Form.Item
            label="Từ ngày: "
            name="TuNgay"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập ngày bắt đầu học kỳ!'
              },
            ]}
          >
            <DatePicker format={"DD-MM-YYYY"}   />
          </Form.Item>
          <Form.Item
            label="Đến ngày: "
            name="DenNgay"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập ngày kết thúc học kỳ!'
              },
            ]}
          >
            <DatePicker format={"DD-MM-YYYY"} />
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

export default HocKy;