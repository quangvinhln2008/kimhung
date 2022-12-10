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
  
  const getHeader = function () {
    const rToken = cookies.rToken
    return {
      Authorization: 'Bearer ' + rToken,
    }
  }
  
  
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
        setDataVatTu(result.data[2])
        setDataDoiTuong(result.data[3])
        return(result)
      })
      .catch(function (error) {
        // handle error
        console.log(error.response)
      })
  }

  const columns = [
    {
      title: 'Ngày phiếu',
      dataIndex: 'NgayCt',
      key: 'NgayCt',
    },
    {
      title: 'Số chứng từ',
      dataIndex: 'SoCt',
      key: 'SoCt',
    },
    {
      title: 'Diễn giải',
      dataIndex: 'DienGiai',
      key: 'DienGiai',
    },
    {
      title: 'Đối tượng',
      dataIndex: 'TenDoiTuong',
      key: 'TenDoiTuong',
    },
    {
      title: 'Mã vật tư',
      dataIndex: 'MaVatTu_Ma',
      key: 'MaVatTu_Ma'
    },    
    {
      title: 'Tên Vật Tư',
      dataIndex: 'TenVatTu',
      key: 'TenVatTu'
    },
    {
      title: 'Số lượng xuất',
      dataIndex: 'SoLuong',
      key: 'SoLuong',
      align:'right'
    },
    {
      title: 'Đơn giá xuất',
      dataIndex: 'DonGia',
      key: 'DonGia',
      align:'right'
    },
    {
      title: 'Thành tiền xuất',
      dataIndex: 'ThanhTien',
      key: 'ThanhTien',
      align:'right'
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <>
          <Space size="middle">
            {!record.Is_Deleted && <Button key={record.Ident} type="link" onClick= {() =>{navigate(`/phieuxuat/${record.Ident}`)}}>Xem</Button>}
          </Space>         
        </>
      ),
    },
  ];
  
  return(
    <>
      <Title level={3}>Bảng kê phiếu xuất</Title>
      <Divider />
      <VStack justifyContent={"start"} alignItems="start">
      <Form form={form} 
              name="dynamic_form_nest_item" 
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 20,
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
                    label="Từ ngày: "
                    name="NgayCt0"                    
                  >
                  <DatePicker  format={"DD-MM-YYYY"} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Đến ngày: "
                    name="NgayCt1"                    
                  >
                  <DatePicker  format={"DD-MM-YYYY"}/>
                  </Form.Item>
                </Col>
              </Row> 
              <Row
                gutter={{
                  xs: 8,
                  sm: 16,
                  md: 24,
                  lg: 32,
                }}
              >                
                <Col  span={12}>
                  <Form.Item
                    label={"Đối tượng: "}
                    name={"MaDoiTuong"}                    
                  >
                    <Select 
                      showSearch 
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
                <Col  span={12}>
                  <Form.Item
                    label={"Vật tư: "}
                    name={"MaVatTu"}                    
                  >
                    <Select 
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
              <HStack justifyContent="start">
                <Button key="save" type="primary" htmlType="submit">Lọc bảng kê</Button>
              </HStack>
            </Form>
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

    </>
  )
}

export default BangKeXuat;