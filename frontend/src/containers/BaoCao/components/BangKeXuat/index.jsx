import React, {useState, useEffect} from "react";
import {useSearchParams, setSearchParams, useNavigate} from "react-router-dom";
import axios from 'axios'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify'
import { Divider,Modal, Typography, Button, Select, Space, DatePicker, InputNumber, Input, Table, Form, Tag, Popconfirm , Alert, Spin, Col, Row} from 'antd';
// import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter  } from "@chakra-ui/react";
import { SearchOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {VStack, HStack, cookieStorageManager} from  '@chakra-ui/react';
import { useCookies } from 'react-cookie';

const { Title } = Typography;
const { Option } = Select;

const BangKeXuat = () =>{
  const _ = require("lodash");  
  
  const [cookies, setCookie] = useCookies(['user']);
  
  const [form] = Form.useForm();
  const [data, setData] = useState()
  const [soCt, setSoCt] = useState()
  const [dataChiTiet, setDataChiTiet] = useState()
  const [dataEdit, setDataEdit] = useState()
  const [Stt, setStt] = useState(0)
  const [dataEditCt, setDataEditCt] = useState()
  const [dataVatTu, setDataVatTu] = useState()
  const [dataDoiTuong, setDataDoiTuong] = useState()
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false)
  const [optionsVatTu, setOptionVatTu] = useState()
  const [optionsDoiTuong, setOptionDoiTuong] = useState()
  
  const navigate = useNavigate();

  const fieldsForm = form.getFieldsValue()
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const getHeader = function () {
    const rToken = cookies.rToken
    return {
      Authorization: 'Bearer ' + rToken,
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  
  async function showModal(Ident, SoCt){
    setIsModalOpen(true);
    return await axios
      .get(`https://testkhaothi.ufm.edu.vn:3002/PhieuXuat/${Ident}`)
      .then((res) => {
        const result = {
          status: res.status,
          data: res.data.result.recordsets,
        }        
        setDataEditCt(result.data[1])
        setSoCt(SoCt)
        return(result)
      })
      .catch(function (error) {
        // handle error
        console.log(error.response)
        toast.error(error?.response)
      })
  };

  useEffect(()=>{
    loadList()
  },[])
  
  useEffect(()=>{
    
    setOptionVatTu(dataVatTu?.map((d) => <Option key={d?.value}>{d?.label}</Option>));
    setOptionDoiTuong(dataDoiTuong?.map((d) => <Option key={d?.value}>{d?.label}</Option>));
    
  }, [dataVatTu, dataDoiTuong])

  async function loadList(){
    const header = getHeader()
    return await axios
      .get(`https://testkhaothi.ufm.edu.vn:3002/baocao/list`, {headers:header})
      .then((res) => {
        const result = {
          status: res.data.status,
          data: res.data.result.recordsets,
        }
        setDataVatTu(result.data[0])
        setDataDoiTuong(result.data[1])
        setLoading(false)
        return(result)
      })
      .catch(function (error) {
        // handle error
        console.log(error.response)
      })
  }

  async function loadBangKePhieuNhap(values){
    const header = getHeader()
    return await axios
      .post(`https://testkhaothi.ufm.edu.vn:3002/baocao/bangkexuat`, {
        NgayCt0: values.NgayCt0.format("YYYYMMDD"),
        NgayCt1: values.NgayCt1.format("YYYYMMDD"),        
        LoaiCt: '2',        
        MaVatTu: values.MaVatTu, 
        MaDoiTuong: values.MaDoiTuong,
      }, {headers:header})
      .then((res) => {
        const result = {
          status: res.data.status,
          data: res.data.result.recordsets,
        }
        setData(result.data[0])        
        return(result)
      })
      .catch(function (error) {
        // handle error
        console.log(error.response)
      })
  }

  const columns = [
    {
      title: 'Ng??y phi???u',
      dataIndex: 'NgayCt',
      key: 'NgayCt',
    },
    {
      title: 'S??? ch???ng t???',
      dataIndex: 'SoCt',
      key: 'SoCt',
    },
    {
      title: 'Di???n gi???i',
      dataIndex: 'DienGiai',
      key: 'DienGiai',
    },
    {
      title: '?????i t?????ng',
      dataIndex: 'TenDoiTuong',
      key: 'TenDoiTuong',
    },
    {
      title: 'T???ng s??? l?????ng',
      dataIndex: 'TongSoLuong',
      key: 'TongSoLuong',
      align:'right'
    },
    {
      title: 'T???ng th??nh ti???n',
      dataIndex: 'TongThanhTien',
      key: 'TongThanhTien',
      align:'right'
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <>
          <Space size="middle">
            {!record.Is_Deleted && <Button key={record.Ident} type="link" onClick= {() =>{showModal(record.Ident, record.SoCt)}}>Xem</Button>}
          </Space>         
        </>
      ),
    },
  ];

  const columnsChiTiet = [
    {
      title: 'T??n v???t t??',
      dataIndex: 'TenVatTu',
      key: 'TenVatTu',
    },
    {
      title: 'S??? l?????ng',
      dataIndex: 'SoLuong',
      key: 'SoLuong',
      align:'right'
    },    
    {
      title: '????n gi??',
      dataIndex: 'DonGia',
      key: 'DonGia',
      align:'right'
    },
    {
      title: 'Th??nh ti???n',
      dataIndex: 'ThanhTien',
      key: 'ThanhTien',
      align:'right'
    }
  ];
  
  return(
    <>
      <Title level={3}>B???ng k?? phi???u xu???t</Title>
      <Divider />
      <VStack justifyContent={"start"} alignItems="start">
      <Form form={form} 
              name="dynamic_form_nest_item" 
              labelCol={{
                span: 12,
              }}
              wrapperCol={{
                span: 24,
              }}
              onFinish={loadBangKePhieuNhap}
            >
              <Row
                gutter={{
                  xs: 8,
                  sm: 16,
                  md: 24,
                  lg: 32,
                }}
              >
                <Col span={12}>
                  <Form.Item
                    label="T??? ng??y: "
                    name="NgayCt0" 
                    rules={[
                      {
                        required: true,
                        message: 'Vui l??ng nh???p cho??n nga??y!'
                      },
                    ]}                   
                  >
                  <DatePicker  format={"DD-MM-YYYY"} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="?????n ng??y: "
                    name="NgayCt1" 
                    rules={[
                      {
                        required: true,
                        message: 'Vui l??ng nh???p cho??n nga??y!'
                      },
                    ]}                      
                  >
                  <DatePicker  format={"DD-MM-YYYY"}/>
                  </Form.Item>
                </Col>
              </Row> 
              <Row
                gutter={{
                  xs: 8,
                  sm: 12,
                  md: 16,
                  lg: 32,
                }}
              >                
                <Col  span={24}>
                  <Form.Item
                    label={"?????i t?????ng: "}
                    name={"MaDoiTuong"}                    
                  >
                    <Select 
                      showSearch
                      allowClear
                      optionFilterProp="children"
                      filterOption={(input, option) => option?.children?.toLowerCase().includes(input)}  
                      filterSort={(optionA, optionB) =>
                        optionA?.children?.toLowerCase().localeCompare(optionB?.children?.toLowerCase())
                      }

                      >
                        {optionsDoiTuong}
                      </Select>
                  </Form.Item>
                </Col>
                <Col  span={24}>
                  <Form.Item
                    label={"V???t t??: "}
                    name={"MaVatTu"}                    
                  >
                    <Select                     
                      showSearch 
                      allowClear
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
              <HStack justifyContent="start">
                <Button key="save" type="primary" htmlType="submit">L???c b???ng k??</Button>
              </HStack>
            </Form>
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
      <Modal title={`Chi ti???t phi???u ${soCt}`} open={isModalOpen} onOk={handleCancel} onCancel={handleCancel}>
        <Table pagination={false} columns={columnsChiTiet}  dataSource={dataEditCt}/>
      </Modal>
    </>
  )
}

export default BangKeXuat;