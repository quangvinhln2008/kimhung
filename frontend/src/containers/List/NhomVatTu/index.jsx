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
  const [dataFilter, setDataFilter] = useState()
  const [editMode, setEditMode] = useState(false)
  const [dataEdit, setDataEdit] = useState()
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false)
  const [openModalContact, setOpenModalContact] = useState(false)
  const [filteredInfo, setFilteredInfo] = useState({});

  function toogleModalFormContact(){
    setOpenModalContact(!openModalContact)
  }

  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
  };
  const clearFilters = () => {
    setFilteredInfo({});
  };
  const clearAll = () => {
    setFilteredInfo({});
  };

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
          data: res.data.result.recordsets,
        }
        setData(result.data[0])
        setDataFilter(result.data[1])
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
      title: 'M?? nh??m v???t t??',
      dataIndex: 'MaNhomVatTu',
      key: 'MaNhomVatTu',
      filters: dataFilter,
      filteredValue: filteredInfo.MaNhomVatTu || null,
      onFilter: (value, record) => record.MaNhomVatTu.includes(value),    
      ellipsis: true,
    },
    {
      title: 'T??n nh??m v???t t??',
      dataIndex: 'TenNhomVatTu',
      key: 'TenNhomVatTu',
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
            {!record.Is_Deleted && <Button key={record.id} type="link" onClick= {() =>{GetNhomVatTuEdit(record.id)}}>C???p nh???t</Button>}
          </Space>
          <Space size="middle">
          {!record.Is_Deleted && <>
              <Popconfirm
                title="B???n c?? ch???c x??a nh??m v???t t?? kh??ng?"
                onConfirm={()=>{DeleteNhomVatTu(record.id)}}
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
      <Title level={3}>Nh??m v???t t??</Title>
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
              <Table onChange={handleChange} columns={columns} dataSource={data} />}
      </VStack>

      {/* Modal th??m m???i */}
      <Modal
        open={openModalContact}
        title={!editMode ? "Th??m m???i nh??m v???t t??" : "C???p nh???t nh??m v???t t??"}
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
            label="M?? nh??m v???t t??: "
            name="MaNhomVatTu"
            rules={[
              {
                required: true,
                message: 'Vui l??ng nh???p m?? nh??m v???t t??!'
              },
            ]}
          >
          <Input  />
          </Form.Item>
          <Form.Item
            label="T??n nh??m v???t t??: "
            name="TenNhomVatTu"
            rules={[
              {
                required: true,
                message: 'Vui l??ng nh???p t??n nh??m v???t t??!'
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

export default NhomVatTu;