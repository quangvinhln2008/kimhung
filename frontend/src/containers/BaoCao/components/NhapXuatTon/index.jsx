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

const NhapXuatTon = () =>{
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
  const [dataKho, setDataKho] = useState()
  const [dataDoiTuong, setDataDoiTuong] = useState()
  const [dataNhomVatTuFilter, setDataNhomVatTuFilter] = useState()
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false)
  const [optionsVatTu, setOptionVatTu] = useState()
  const [optionsDoiTuong, setOptionDoiTuong] = useState()
  const [optionsKho, setOptionKho] = useState()
  
  const navigate = useNavigate();

  const fieldsForm = form.getFieldsValue()
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const getHeader = function () {
    const rToken = cookies.rToken
    return {
      Authorization: 'Bearer ' + rToken,
    }
  }

  const onChange = (pagination, filters, sorter, extra) => {
    // const filterNhom = dataVatTuFilter.filters(item => item.TenNhomVatTu === filters?.TenNhomVatTu[0])
    // setFilterVt(filterNhom)
    console.log('params', pagination, filters, sorter, extra);
  };

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
    // setOptionDoiTuong(dataDoiTuong?.map((d) => <Option key={d?.value}>{d?.label}</Option>));
    setOptionKho(dataKho?.map((d) => <Option key={d?.value}>{d?.label}</Option>));
    
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
        setDataKho(result.data[2])
        setLoading(false)
        return(result)
      })
      .catch(function (error) {
        // handle error
        console.log(error.response)
      })
  }

  async function loadNhapXuatTon(values){
    const header = getHeader()
    return await axios
      .post(`https://testkhaothi.ufm.edu.vn:3002/baocao/nhapxuatton`, {
        NgayCt0: values.NgayCt0.format("YYYYMMDD"),
        NgayCt1: values.NgayCt1.format("YYYYMMDD"),      
        MaVatTu: values.MaVatTu, 
        MaKho: values.MaKho,
      }, {headers:header})
      .then((res) => {
        const result = {
          status: res.data.status,
          data: res.data.result.recordsets,
        }
        setData(result.data[0])      
        setDataNhomVatTuFilter(result.data[1])  
        return(result)
      })
      .catch(function (error) {
        // handle error
        console.log(error.response)
      })
  }

  const columns = [
    {
      title: 'Nhóm vật tư',
      dataIndex: 'TenNhomVatTu',
      key: 'TenNhomVatTu',
      filters: dataNhomVatTuFilter,
      onFilter: (value, record) => record.TenNhomVatTu.includes(value),
      filterSearch: true,
    },
    {
      title: 'Tên vật tư',
      dataIndex: 'TenVatTu',
      key: 'TenVatTu',
    },
    {
      title: 'Tồn đầu kỳ',
      dataIndex: 'Ton_Dau',
      key: 'Ton_Dau',
      align:'right'
    },    
    {
      title: 'Số lượng nhập',
      dataIndex: 'Sl_Nhap',
      key: 'Sl_Nhap',
      align:'right'
    },    
    {
      title: 'Số lượng xuất',
      dataIndex: 'Sl_Xuat',
      key: 'Sl_Xuat',
      align:'right'
    },    
    {
      title: 'Tồn cuối kỳ',
      dataIndex: 'Ton_Cuoi',
      key: 'Ton_Cuoi',
      align:'right'
    },    
  ];

  const columnsChiTiet = [
    {
      title: 'Tên vật tư',
      dataIndex: 'TenVatTu',
      key: 'TenVatTu',
    },
    {
      title: 'Số lượng',
      dataIndex: 'SoLuong',
      key: 'SoLuong',
      align:'right'
    },    
    {
      title: 'Đơn giá',
      dataIndex: 'DonGia',
      key: 'DonGia',
      align:'right'
    },
    {
      title: 'Thành tiền',
      dataIndex: 'ThanhTien',
      key: 'ThanhTien',
      align:'right'
    }
  ];
  
  return(
    <>
      <Title level={3}>Báo cáo nhập xuất tồn kho</Title>
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
              onFinish={loadNhapXuatTon}
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
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập chọn ngày!'
                      },
                    ]}                   
                  >
                  <DatePicker  format={"DD-MM-YYYY"} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Đến ngày: "
                    name="NgayCt1" 
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập chọn ngày!'
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
                    label={"Chọn kho: "}
                    name={"MaKho"}                    
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
                        {optionsKho}
                      </Select>
                  </Form.Item>
                </Col>
                <Col  span={24}>
                  <Form.Item
                    label={"Vật tư: "}
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
              <Table pagination={false} columns={columns} dataSource={data} onChange={onChange} />}
      </VStack>
    </>
  )
}

export default NhapXuatTon;