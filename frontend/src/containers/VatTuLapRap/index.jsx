import React, {useState, useEffect, useRef} from "react";
import {useSearchParams, setSearchParams, useNavigate} from "react-router-dom";
import axios from 'axios'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { toast } from 'react-toastify'
import { Divider,Modal, Typography, Button, Select, Space, DatePicker, InputNumber, Input, Table, Form, Tag, Popconfirm , Alert, Spin, Col, Row} from 'antd';
// import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter  } from "@chakra-ui/react";
import { SearchOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusOutlined,ReloadOutlined } from '@ant-design/icons';
import {VStack, HStack, cookieStorageManager} from  '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import ReactToPrint from "react-to-print";
import { useReactToPrint } from 'react-to-print';

const { Title } = Typography;
const { Option } = Select;

const VatTuLapRap = () =>{
  const _ = require("lodash");  
  
  const [form] = Form.useForm();
  const [data, setData] = useState()
  const [editMode, setEditMode] = useState(false)
  const [dataVatTuFilter, setDataVatTuFilter] = useState()
  const [viewMode, setViewMode] = useState(false)
  const [dataEdit, setDataEdit] = useState()
  const [dataEditCt, setDataEditCt] = useState()
  const [dataVatTu, setDataVatTu] = useState()
  const [dataGiaVatTu, setDataGiaVatTu] = useState()
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false)
  const [openModalContact, setOpenModalContact] = useState(false)
  const [optionsVatTu, setOptionVatTu] = useState()
  
  const Ident = uuidv4()
  const fieldsForm = form.getFieldsValue() 

  function toogleModalFormContact(){
    setOpenModalContact(!openModalContact)
  }
  
  useEffect(()=>{
    loadVatTuLR()
  },[])  

  useEffect(()=>{
    loadVatTuLR()    
  },[refresh])

  useEffect(()=>{
    
    setOptionVatTu(dataVatTu?.map((d) => <Option key={d?.value}>{d?.label}</Option>));

    form.setFieldsValue({
        MaVatTu: dataEdit?.MaVatTu,
        users: dataEditCt
    })
  }, [dataEdit])


  function openCreateMode(){
    setEditMode(false)
    setViewMode(true)
    setOpenModalContact(!openModalContact)

    setOptionVatTu(dataVatTu?.map((d) => <Option key={d?.value}>{d?.label}</Option>));

    form.setFieldsValue({
        MaVatTu: "",
        users:[]
    })
  }
  const onChange = (pagination, filters, sorter, extra) => {
    // const filterNhom = dataVatTuFilter.filters(item => item.TenNhomVatTu === filters?.TenNhomVatTu[0])
    // setFilterVt(filterNhom)
    console.log('params', pagination, filters, sorter, extra);
  };

  const onMaVatTuChange = (name) => {
    
    const fields = form.getFieldsValue()
    const { users } = fields
    const selectedVatTu = dataGiaVatTu.filter(item => item.id === fields.users[name].MaVatTuLR)
    
    Object.assign(users[name], { Dvt: selectedVatTu[0]?.Dvt})
    form.setFieldsValue({users})
  }

  async function loadVatTuLR(){
    setLoading(true)
    return await axios
      .get(`https://testkhaothi.ufm.edu.vn:3002/vattulaprap`)
      .then((res) => {
        const result = {
          status: res.data.status,
          data: res.data.result.recordsets,
        }
        setData(result.data[0])
        setDataVatTu(result.data[1])
        setDataGiaVatTu(result.data[2])
        setDataVatTuFilter(result.data[3])
        setTimeout(() => {      
          setLoading(false)
        }, 500);
        return(result)
      })
      .catch(function (error) {
        // handle error
        console.log(error.response)
      })
      
  }

  async function GetVatTuLREdit(MaPhieuXuat, isEdit){
    setEditMode(isEdit)
    setViewMode(isEdit)
    return await axios
      .get(`https://testkhaothi.ufm.edu.vn:3002/vattulaprap/${MaPhieuXuat}`)
      .then((res) => {
        const result = {
          status: res.status,
          data: res.data.result.recordsets,
        }
        
        setDataEdit(result.data[0][0])
        setDataEditCt(result.data[1])
        setOpenModalContact(!openModalContact)
        return(result)
      })
      .catch(function (error) {
        // handle error
        console.log(error.response)
        toast.error(error?.response)
      })
  };

  async function CreateVatTuLR(values){
    console.log('run create')
    return await axios
      .post('https://testkhaothi.ufm.edu.vn:3002/vattulaprap/create', {
        Ident: Ident,
        MaVatTu: values.MaVatTu,
        ctVatTuLR: values.users  
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

  async function UpdateVatTuLR(values){
    console.log('run update')
    return await axios
      .post(`https://testkhaothi.ufm.edu.vn:3002/vattulaprap/${dataEdit?.Ident}`, {
        MaVatTu: values.MaVatTu,
        ctVatTuLR: values.users  
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

  async function DeleteVatTuLR(MaPhieuXuat){
    return await axios
      .post(`https://testkhaothi.ufm.edu.vn:3002/vattulaprap/delete/${MaPhieuXuat}`)
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
      title: 'V???t t??',
      dataIndex: 'MaVatTu',
      key: 'MaVatTu',      
      width: '300px',filters: dataVatTuFilter,
      onFilter: (value, record) => record.MaVatTu.includes(value),
      filterSearch: true,
    },
    {
      title: 'T??n v???t t??',
      dataIndex: 'TenVatTu',
      key: 'TenVatTu',      
      width: '500px'
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <>  
         <Space size="middle">
            {!record.TinhTrang && <Button key={record.Ident} type="link" onClick= {() =>{GetVatTuLREdit(record.Ident, true)}}>C???p nh???t</Button>}
          </Space>                    
          <Space size="middle">
          {!record.Is_Deleted && <>
              <Popconfirm
                title="B???n c?? ch???c x??a v???t t?? kh??ng?"
                onConfirm={()=>{DeleteVatTuLR(record.Ident)}}
                okText="Yes"
                cancelText="No"
              >
                <Button key={record.Id} type="link" danger >X??a</Button>
              </Popconfirm>
            </>}
          </Space>
        </>
      ),
    },
  ];
  
  return(
    <>
      <Title level={3}>Danh m???c v???t t?? l???p r??p</Title>
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
         style={{
          top: 0,
        }}
        open={openModalContact}
        size="lg"
        // size={"full"}
        title={!editMode ? `Th??m m???i` : `C???p nh???t`}
        onCancel={toogleModalFormContact}
        footer={null}
        width={1500}
      >
          <Form form={form} 
              name="dynamic_form_nest_item" 
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 20,
              }}
              onFinish={!editMode? CreateVatTuLR: UpdateVatTuLR}
            >
              <Row
                gutter={{
                  xs: 8,
                  sm: 16,
                  md: 24,
                  lg: 32,
                }}
              >                
                <Col  span={8}>
                  <Form.Item
                    label={"V???t t??: "}
                    name= {"MaVatTu"}
                    rules={[
                      {
                        required: true,
                        message: 'Vui l??ng ch???n v???t t??!'
                      },
                    ]}
                  >
                    <Select 
                      disabled = {!viewMode} 
                      showSearch 
                      optionFilterProp="children"
                      filterOption={(input, option) => option?.children?.toLowerCase().includes(input)}  
                      filterSort={(optionA, optionB) =>
                        optionA?.children?.toLowerCase().localeCompare(optionB?.children?.toLowerCase())
                      }
                      >
                        {optionsVatTu}
                      </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Divider plain>Chi ti???t l???p r??p</Divider>
              <Form.List name="users">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => {
                      const deleteRow = () =>{
                        remove(name)
                        const fields = form.getFieldsValue()
                        const { users } = fields
                      }
                    return(
                      <Space
                        size={"large"}
                        key={key}
                        style={{
                          display: 'flex',
                          marginBottom: 8,
                        }}
                        align="baseline"
                      >
                    <Form.Item
                      {...restField}
                      name={[name, 'MaVatTuLR']}
                      rules={[
                        {
                          required: true,
                          message: 'Vui l??ng ch???n v???t t??!'
                        },
                      ]}
                    >
                    <Select 
                      disabled = {!viewMode} 
                       style={{
                        width: 250,
                      }}
                      placeholder="Ch???n v???t t??"
                      showSearch 
                      optionFilterProp="children"
                      filterOption={(input, option) => option?.children?.toLowerCase().includes(input)}  
                      filterSort={(optionA, optionB) =>
                        optionA?.children?.toLowerCase().localeCompare(optionB?.children?.toLowerCase())
                      }
                      onChange={() =>onMaVatTuChange(name)}
                      >
                        {optionsVatTu}
                  </Select>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'Dvt']}
                    rules={[
                      {
                        required: true,
                        message: 'Dvt',
                      },
                    ]}
                  >
                  <Input  style={{
                        width: 80,
                      }}/>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'HeSo']}
                    rules={[
                      {
                        required: true,
                        message: 'Nh???p h??? s???',
                      },
                    ]}
                  >
                  <InputNumber 
                    readOnly = {!viewMode} 
                    placeholder="H??? s???"
                      style={{
                        width: 80,
                      }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                      min={0} />
                  </Form.Item>
                  {viewMode && <MinusCircleOutlined onClick={() => deleteRow()} />}
                </Space>
                    )})}
                  <Form.Item>
                    <Button disabled = {!viewMode}  type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Th??m chi ti???t
                    </Button>
                  </Form.Item>
                  </>
                  )}
                </Form.List>
              <Divider/>            
                                        
              <HStack justifyContent="end">
                <Button key="back" onClick={toogleModalFormContact}>Tho??t</Button>
                <Button key="save" type="primary" disabled = {!viewMode}  htmlType="submit">L??u</Button>
              </HStack>
            </Form>
      </Modal>
    </>
  )
}

export default VatTuLapRap;
