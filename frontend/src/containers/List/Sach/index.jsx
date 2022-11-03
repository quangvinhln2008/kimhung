import React, {useState, useEffect} from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import { Divider, Typography, Button, Select, Modal, Space, Input, InputNumber, Table, Form, Tag, Popconfirm , Alert, Spin} from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {VStack, HStack} from  '@chakra-ui/react';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Sach = () =>{
  
  const [form] = Form.useForm();
  const [data, setData] = useState()
  const [editMode, setEditMode] = useState(false)
  const [dataEdit, setDataEdit] = useState()
  const [dataDoiTuong, setDataDoiTuong] = useState()
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false)
  const [openModalContact, setOpenModalContact] = useState(false)
  const [options, setOption] = useState()

  function toogleModalFormContact(){
    setOpenModalContact(!openModalContact)
  }
  
  useEffect(()=>{
    loadSach()
  },[refresh])

  useEffect(()=>{
    
    setOption(dataDoiTuong?.map((d) => <Option key={d?.value}>{d?.label}</Option>));

    form.setFieldsValue({
        TenSach: dataEdit?.TenSach,
        MaDoiTuong: dataEdit?.MaDoiTuong,
        NamXuatBan: dataEdit?.NamXuatBan,
        Barcode : dataEdit?.Barcode,
        GiaBan : dataEdit?.GiaBan
    })
  }, [dataEdit])

  function toogleModalFormContact(){
    setOpenModalContact(!openModalContact)
  }

  function openCreateMode(){
    setEditMode(false)
    setOpenModalContact(!openModalContact)

    setOption(dataDoiTuong?.map((d) => <Option key={d?.value}>{d?.label}</Option>));
    form.setFieldsValue({
      TenSach: "",
      MaDoiTuong: "",
      NamXuatBan: "",
      Barcode : "",
      GiaBan : 0
    })
  }

  async function loadSach(){
    return await axios
      .get('http://localhost:3001/Sach')
      .then((res) => {
        const result = {
          status: res.data.status,
          data: res.data.result.recordsets,
        }
        setData(result.data[0])
        setDataDoiTuong(result.data[1])
        
        setLoading(false)
        return(result)
      })
      .catch(function (error) {
        // handle error
        console.log(error.response)
      })
  }

  async function GetSachEdit(MaSach){
    setEditMode(true)
    return await axios
      .get(`http://localhost:3001/Sach/${MaSach}`)
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

  async function CreateSach(values){
    return await axios
      .post('http://localhost:3001/Sach/create', {
        TenSach: values.TenSach, 
        MaDoiTuong: values.MaDoiTuong, 
        NamXuatBan: values.NamXuatBan, 
        Barcode: values.Barcode, 
        GiaBan: values.GiaBan,
        DienGiaiSach : values.DienGiaiSach
      })
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

  async function UpdateSach(values){
    console.log('run update')
    return await axios
      .post(`http://localhost:3001/Sach/${dataEdit?.MaSach}`, {
        TenSach: values.TenSach, 
        MaDoiTuong: values.MaDoiTuong, 
        NamXuatBan: values.NamXuatBan, 
        Barcode: values.Barcode, 
        GiaBan: values.GiaBan,
        DienGiaiSach: values.DienGiaiSach
      })
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

  async function DeleteSach(MaSach){
    return await axios
      .post(`http://localhost:3001/Sach/delete/${MaSach}`)
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
      title: 'Tên sách',
      dataIndex: 'TenSach',
      key: 'TenSach',
    },
    {
      title: 'NXB/ Nhà in',
      dataIndex: 'TenDoiTuong',
      key: 'TenDoiTuong',
    },
    {
      title: 'Năm xuất bản',
      dataIndex: 'NamXuatBan',
      key: 'NamXuatBan',
      align:'center'
    },
    {
      title: 'Giá phát hành',
      dataIndex: 'GiaBan',
      align:'right',
      key: 'GiaBan',
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
            {!record.Is_Deleted && <Button key={record.MaSach} type="link" onClick= {() =>{GetSachEdit(record.MaSach)}}>Cập nhật</Button>}
          </Space>
          <Space size="middle">
          {!record.Is_Deleted && <>
              <Popconfirm
                title="Bạn có chắc xóa sách không?"
                onConfirm={()=>{DeleteSach(record.MaSach)}}
                okText="Yes"
                cancelText="No"
              >
                <Button key={record.MaSach} type="link" danger >Xóa</Button>
              </Popconfirm>
            </>}
          </Space>
        </>
        
      ),
    },
  ];

  return(
    <>
      <Title level={3}>Sách</Title>
      <Divider />
      <VStack justifyContent={"start"} alignItems="start">
        <Space align="left" style={{ marginBottom: 16 }}>
          <Button  onClick={openCreateMode}  type="primary" icon={<PlusCircleOutlined />}>
              Thêm mới
          </Button>
          <Button  onClick={toogleModalFormContact} icon={<SearchOutlined />}>
              Tìm kiếm
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
        title={!editMode ? "Thêm mới sách" : "Cập nhật sách"}
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
          onFinish={!editMode? CreateSach: UpdateSach}
        >
          <Form.Item
            label="Tên sách: "
            name="TenSach"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên sách!'
              },
            ]}
          >
          <Input  />
          </Form.Item>
          
          <Form.Item
            label="Nhà xuất bản/ Nhà in: "
            name="MaDoiTuong"
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn NXB!'
              },
            ]}
          >
          <Select 
            showSearch 
            optionFilterProp="children"
            filterOption={(input, option) => option?.children?.toLowerCase().includes(input)}  
            filterSort={(optionA, optionB) =>
              optionA?.children?.toLowerCase().localeCompare(optionB?.children?.toLowerCase())
            }

            >
              {options}
            </Select>
          </Form.Item>
          <Form.Item
            label="Năm xuất bản: "
            name="NamXuatBan"
            
          >
          <Input  />
          </Form.Item>
          <Form.Item
            label="Diễn giải: "
            name="DienGiaiSach"
            
          >
          <TextArea rows={2} />
          </Form.Item>
          <Form.Item
            label="Barcode: "
            name="Barcode"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập Barcode!'
              },
            ]}
          >
          <Input  />
          </Form.Item>
          <Form.Item
            label="Giá phát hành: "
            name="GiaBan"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập giá phát hành!'
              },
            ]}
          >
          <InputNumber 
            style={{
              width: 150,
            }}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            min={0}  
            defaultValue={0} />
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

export default Sach;