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
const { RangePicker } = DatePicker;

const PhieuXuat = () =>{
  const _ = require("lodash");  
  
  const [cookies, setCookie] = useCookies(['user']);
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [formFilter] = Form.useForm();
  const [data, setData] = useState()
  const [dataChiTiet, setDataChiTiet] = useState()
  const [editMode, setEditMode] = useState(false)
  const [viewMode, setViewMode] = useState(false)
  const [printMode, setPrintMode] =useState(false)
  const [dataEdit, setDataEdit] = useState()
  const [Stt, setStt] = useState(0)
  const [dataEditCt, setDataEditCt] = useState()
  const [dataPrint, setDataPrint] = useState()
  const [dataVatTu, setDataVatTu] = useState()
  const [dataKho, setDataKho] = useState()
  const [dataDoiTuong, setDataDoiTuong] = useState()
  const [dataNhanVien, setDataNhanVien] = useState()
  const [dataGiaVatTu, setDataGiaVatTu] = useState()
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false)
  const [openModalContact, setOpenModalContact] = useState(false)
  const [optionsVatTu, setOptionVatTu] = useState()
  const [optionsKho, setOptionKho] = useState()
  const [optionsDoiTuong, setOptionDoiTuong] = useState()
  const [optionsNhanVien, setOptionNhanVien] = useState()
  const [tongSoLuongXuat,setTongSoLuongXuat] = useState(0)
  const [tongThanhTienXuat,setTongThanhTienXuat] = useState(0)
  const [maCt, setMaCt] = useState('')
  const [title, setTitle] = useState('')
  const [searchParams, setSearchParams] = useSearchParams();
  
  const Ident = uuidv4()
  const type = searchParams.get('type')
  const fieldsForm = form.getFieldsValue()
  
  let componentRef = useRef()

  const getHeader = function () {
    const rToken = cookies.rToken
    return {
      Authorization: 'Bearer ' + rToken,
    }
  }

  function getMaCt (type)
  {
    switch (type.toLowerCase()) {
      case 'xuatban':
        return setMaCt("XB");
      case 'xuatphathanh':
        return setMaCt("XPH");
      case 'xuatkygui':
         return setMaCt("XKG");
      case 'xuattang':
        return setMaCt("XT");
      case 'xuatthanhly':
        return setMaCt("XTL");
      case 'xuattrain':
          return setMaCt("XTI");
      case 'xuatphongban':
        return setMaCt("XPB");
      case 'xuatmat':
        return setMaCt("XM");
      case 'xuatkhac':
        return setMaCt("XK");
      default: 
        return ''
    }
  }

  function getTitle (type)
  {
    switch (type.toLowerCase()) {
      case 'xuatban':
        return setTitle("xu???t b??n");
      case 'xuatphathanh':
        return setTitle("xu???t ph??t h??nh");
      case 'xuatkygui':
         return setTitle("xu???t k?? g???i");
      case 'xuattang':
        return setTitle("xu???t t???ng");
      case 'xuatthanhly':
        return setTitle("xu???t thanh l??");
      case 'xuattrain':
          return setTitle("xu???t tr??? nh?? In-Photo");
      case 'xuatphongban':
        return setTitle("xu???t Ph??ng/Khoa");
      case 'xuatmat':
        return setTitle("xu???t m???t");
      case 'xuatkhac':
        return setTitle("xu???t kh??c");
      default: 
        return ''
    }
  }

  function toogleModalFormContact(){
    setOpenModalContact(!openModalContact)
  }
  
  useEffect(()=>{
    getMaCt(type)
    getTitle(type)
    loadPhieuXuat()
  },[type])
  

  useEffect(()=>{
    loadPhieuXuat()    
  },[refresh])

  useEffect(()=>{
    
    setOptionVatTu(dataVatTu?.map((d) => <Option key={d?.value}>{d?.label}</Option>));
    setOptionKho(dataKho?.map((d) => <Option key={d?.value}>{d?.label}</Option>));
    setOptionDoiTuong(dataDoiTuong?.map((d) => <Option key={d?.value}>{d?.label}</Option>));
    setOptionNhanVien(dataNhanVien?.map((d) => <Option key={d?.value}>{d?.label}</Option>));
    
    setTongSoLuongXuat(_?.sumBy(dataEditCt, 'SoLuongXuat'))    
    setTongThanhTienXuat(_?.sumBy(dataEditCt, 'ThanhTienXuat'))

    form.setFieldsValue({
        NgayCt: moment(dataEdit?.NgayCt, 'YYYY/MM/DD'),
        SoCt: dataEdit?.SoCt,
        MaKho : dataEdit?.MaKho,
        MaDoiTuong: dataEdit?.MaDoiTuong,
        MaNhanVien: cookies.id,
        DienGiai: dataEdit?.DienGiai,
        users: dataEditCt
    })
  }, [dataEdit])


  function openCreateMode(){
    setEditMode(false)
    setViewMode(true)
    setOpenModalContact(!openModalContact)

    setOptionVatTu(dataVatTu?.map((d) => <Option key={d?.value}>{d?.label}</Option>));
    setOptionKho(dataKho?.map((d) => <Option key={d?.value}>{d?.label}</Option>));
    setOptionDoiTuong(dataDoiTuong?.map((d) => <Option key={d?.value}>{d?.label}</Option>));
    setOptionNhanVien(dataNhanVien?.map((d) => <Option key={d?.value}>{d?.label}</Option>));

    setTongSoLuongXuat(0)
    setTongThanhTienXuat(0)

    const currentNumber = Stt[0]?.CurrentNumberRecord + 1

    form.setFieldsValue({
        NgayCt: moment(),
        SoCt: moment().year().toString() + moment().month().toString()+ '-'+ currentNumber.toString(),
        MaDoiTuong: "",
        MaNhanVien: "",
        MaKho : "",
        DienGiai : "",
        users:[]
    })
  }

  const onDonGiaChange = (name) => {
    
    const fields = form.getFieldsValue()
    const { users } = fields

    Object.assign(users[name], { ThanhTienXuat: fields.users[name].SoLuongXuat * fields.users[name].DonGiaXuat })
    form.setFieldsValue({users})
    setTongSoLuongXuat(_?.sumBy(users, 'SoLuongXuat'))    
    setTongThanhTienXuat(_?.sumBy(users, 'ThanhTienXuat'))
  }

  const onMaVatTuChange = (name) => {
    
    const fields = form.getFieldsValue()
    const { users } = fields
    const selectedVatTu = dataGiaVatTu.filter(item => item.id === fields.users[name].MaVatTu)
    
    Object.assign(users[name], { DonGiaXuat: selectedVatTu[0]?.GiaBan})
    Object.assign(users[name], { Dvt: selectedVatTu[0]?.Dvt})
    form.setFieldsValue({users})
  }

  async function loadPhieuXuat(){
    const header = getHeader()
    setLoading(true)
    return await axios
      .get(`https://testkhaothi.ufm.edu.vn:3002/PhieuXuat?type=${type}`,{headers:header})
      .then((res) => {
        const result = {
          status: res.data.status,
          data: res.data.result.recordsets,
        }
        setData(result.data[0])
        setDataKho(result.data[1])
        setDataVatTu(result.data[2])
        setDataGiaVatTu(result.data[3])
        setDataNhanVien(result.data[4])
        setDataDoiTuong(result.data[5])
        setStt(result.data[6])
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

  async function GetPhieuXuatEdit(MaPhieuXuat, isEdit){
    setEditMode(isEdit)
    setViewMode(isEdit)
    return await axios
      .get(`https://testkhaothi.ufm.edu.vn:3002/PhieuXuat/${MaPhieuXuat}`)
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

  async function CreatePhieuXuat(values){
    const header = getHeader()
    return await axios
      .post('https://testkhaothi.ufm.edu.vn:3002/PhieuXuat/create', {
        Ident: Ident,
        NgayCt: values.NgayCt.format("YYYY-MM-DD"),
        MaCt: maCt,
        LoaiCt: '2',
        SoCt: values.SoCt, 
        MaKho: values.MaKho, 
        MaSach: values.MaSach, 
        MaDoiTuong: values.MaDoiTuong,
        MaNhanVien: cookies.id,
        DienGiai: values.DienGiai,
        ctPhieuXuat: values.users  
      },{header})
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

  async function UpdatePhieuXuat(values){
    console.log('run update')
    return await axios
      .post(`https://testkhaothi.ufm.edu.vn:3002/PhieuXuat/${dataEdit?.Ident}`, {
        NgayCt: values.NgayCt.format('YYYY-MM-DD'), 
        SoCt: values.SoCt, 
        MaCt: maCt,
        MaKho: values.MaKho, 
        MaDoiTuong: values.MaDoiTuong,
        MaNhanVien: cookies.id,
        DienGiai: values.DienGiai,
        ctPhieuXuat: values.users})
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

  async function DeletePhieuXuat(MaPhieuXuat){
    return await axios
      .post(`https://testkhaothi.ufm.edu.vn:3002/PhieuXuat/delete/${MaPhieuXuat}`,{
      
          // NgayCt: values.NgayCt.format('YYYY-MM-DD')
      })
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

  async function filterPhieuXuat(values){
    const header = getHeader()
    
    console.log('value filter', values)
    setLoading(true)
    return await axios
      .post('https://testkhaothi.ufm.edu.vn:3002/baocao/filter', {
        NgayCt1: values?.ngayPhieu === undefined || values?.ngayPhieu === null ? '' : values?.ngayPhieu[0].format("YYYY-MM-DD"),
        NgayCt2: values?.ngayPhieu === undefined || values?.ngayPhieu === null ? '' :values?.ngayPhieu[1].format("YYYY-MM-DD") ,
        MaCt: 'XB',
        MaNhanVien: cookies.id,      
      },{header})
      .then((res) => {
        const result = {
          status: res.status,
          data: res.data?.result?.recordsets,
        }
        result?.data[0].status === 200 ? toast.success(result?.data[0].message): toast.error(result?.data[0].message)
        setData(result.data[0])
        setDataKho(result.data[1])
        setDataVatTu(result.data[2])
        setDataGiaVatTu(result.data[3])
        setDataNhanVien(result.data[4])
        setDataDoiTuong(result.data[5])
        setStt(result.data[6])
        setTimeout(() => {      
          setLoading(false)
        }, 500);
        return(result)
      })
      .catch(function (error) {
        // handle error
        console.log(error.response)
        toast.error(error?.response)
      })
  };
  const rangePresets = [
    {
      label: 'Last 7 Days',
      value: [dayjs().add(-7, 'd'), dayjs()],
    },
    {
      label: 'Last 14 Days',
      value: [dayjs().add(-14, 'd'), dayjs()],
    },
    {
      label: 'Last 30 Days',
      value: [dayjs().add(-30, 'd'), dayjs()],
    },
    {
      label: 'Last 90 Days',
      value: [dayjs().add(-90, 'd'), dayjs()],
    },
  ];
  const columns = [
    {
      title: 'Ng??y phi???u',
      dataIndex: 'NgayCt',
      key: 'NgayCt',
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
      title: 'T???ng th??nh ti??n',
      dataIndex: 'TongThanhTien',
      key: 'TongThanhTien',
      align:'right'
    },
    {
      title: 'T??nh tr???ng',
      key: 'Is_Locked',
      dataIndex: 'Is_Locked',
      render: (_, record) => (                   
          <Tag color={record.TinhTrang ? 'green' :'volcano'} key={record.Ident}>
            {record.TinhTrang ? 'HO??N TH??NH': ''}
          </Tag>         
      )
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <>
          <Space size="middle">
            {<Button key={record.Ident} type="link" onClick= {() => navigate(`/phieuxuat/print/${record.Ident}`)}>Xem</Button>}
          </Space>
         <Space size="middle">
            {!record.TinhTrang && <Button key={record.Ident} type="link" onClick= {() =>{GetPhieuXuatEdit(record.Ident, true)}}>C???p nh???t</Button>}
          </Space>
          <Space size="middle">
          {!record.TinhTrang && <>
              <Popconfirm
                title="B???n c?? ch???c x??a phi???u kh??ng?"
                onConfirm={()=>{DeletePhieuXuat(record.Ident)}}
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
  const columnsPrint = [
    {
      title: 'STT',
      dataIndex: 'STT',
      key: 'STT',
    },
    {
      title: 'T??n v???t t??',
      dataIndex: 'TenVatTu',
      key: 'TenVatTu',
    },
    {
      title: 'S??? l?????ng xu???t',
      dataIndex: 'SoLuongXuat',
      key: 'SoLuongXuat',
    },
    {
      title: '????n gi??',
      dataIndex: 'DonGiaXuat',
      key: 'DonGiaXuat',
      align:'right'
    },
    {
      title: 'Th??nh ti??n',
      dataIndex: 'ThanhTienXuat',
      key: 'ThanhTienXuat',
      align:'right'
    }
  ];
const ComponentToPrint = React.forwardRef((props, ref) => {
  useEffect(()=>{
    // GetPhieuXuatPrint(props.id)
console.log('props', props)
  },[ref])
  return(
  <Table columns={columnsPrint} ref={ref} dataSource={dataPrint}/>
  );
});

  return(
    <>
      <Title level={3}>Phi???u {title}</Title>
      <Divider />
      <VStack justifyContent={"start"} alignItems="start">
      <Form 
        form={formFilter} 
        name="horizontal" 
        layout="inline" 
        onFinish={filterPhieuXuat}>
        <Form.Item
          name="ngayPhieu" 
          label="Ng??y phi???u"         
        >
          <RangePicker format="DD/MM/YYYY"/>
        </Form.Item>
        {/* <Form.Item
          label={"?????i t?????ng: "}
          name= {"MaDoiTuong"}
          style={{
            width: 250,
          }}
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
        </Form.Item>    */}
        <HStack>
          <Button htmlType="submit" icon={<SearchOutlined />}>
                T??m ki???m
          </Button> 
          <Button type="default" onClick={loadPhieuXuat} icon={<ReloadOutlined />}>
                Reset
          </Button>
        </HStack>
             
      </Form>
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
        title={!editMode ? `Th??m m???i phi???u ${title}` : `C???p nh???t phi???u ${title}`}
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
              onFinish={!editMode? CreatePhieuXuat: UpdatePhieuXuat}
            >
              <Row
                gutter={{
                  xs: 8,
                  sm: 16,
                  md: 24,
                  lg: 32,
                }}
              >
                <Col span={8}>
                  <Form.Item
                    label="Ng??y phi???u: "
                    name="NgayCt"
                    rules={[
                      {
                        required: true,
                        message: 'Vui l??ng nh???p ng??y phi???u!'
                      },
                    ]}
                  >
                  <DatePicker  format={"DD-MM-YYYY"} disabled = {!viewMode}  />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                      label="S??? phi???u: "
                      name="SoCt"
                      rules={[
                        {
                          required: true,
                          message: 'Vui l??ng nh???p s??? phi???u!'
                        },
                      ]}
                    >
                    <Input readOnly = {!viewMode}   />
                  </Form.Item>
                </Col>
                <Col  span={8}>
                  <Form.Item
                    label={"?????i t?????ng: "}
                    name= {"MaDoiTuong"}
                    rules={[
                      {
                        required: true,
                        message: 'Vui l??ng ch???n ?????i t?????ng!'
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
                        {optionsDoiTuong}
                      </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
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
              <Col className="gutter-row" span={8}>
                  <Form.Item
                      label="Kho: "
                      name="MaKho"
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
                        {optionsKho}
                      </Select>
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={8}>
                  <Form.Item
                  label="Di???n gi???i: "
                  name="DienGiai"
                  
                  >
                    <Input readOnly = {!viewMode} />
                  </Form.Item>
                </Col>  
              </Row>
              <Divider plain>Chi ti???t phi???u xu???t</Divider>
              <Form.List name="users">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => {
                      const deleteRow = () =>{
                        remove(name)
                        const fields = form.getFieldsValue()
                        const { users } = fields
                        
                        setTongSoLuongXuat(_?.sumBy(users, 'SoLuongXuat'))    
                        setTongThanhTienXuat(_?.sumBy(users, 'ThanhTienXuat'))
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
                      name={[name, 'MaVatTu']}
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
                    name={[name, 'SoLuongXuat']}
                    rules={[
                      {
                        required: true,
                        message: 'Nh???p s??? l?????ng',
                      },
                    ]}
                  >
                  <InputNumber 
                    readOnly = {!viewMode} 
                    placeholder="S??? l?????ng"
                      style={{
                        width: 80,
                      }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                      min={0}  
                      onChange={() =>onDonGiaChange(name)}/>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'DonGiaXuat']}
                    rules={[
                      {
                        required: true,
                        message: 'Nh???p ????n gi??',
                      },
                    ]}
                  >
                  <InputNumber
                    readOnly = {!viewMode} 
                    placeholder="????n gi??"                  
                      style={{
                        width: 150,
                      }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                      min={0}  
                      onChange={() =>onDonGiaChange(name)}/>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'ThanhTienXuat']}                    
                  >
                    <InputNumber
                      readOnly
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      placeholder="Th??nh ti???n"
                        style={{
                          width: 150,
                          textAlign: "right"
                        }}                        
                        />
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
              <Row
                gutter={{
                  xs: 8,
                  sm: 16,
                  md: 24,
                  lg: 32,
                }}
              >
                <Col className="gutter-row" span={6}>                  
                  <Title level={5} >T???ng s??? l?????ng: </Title>
                  <InputNumber size="large" readOnly formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
                    value = {tongSoLuongXuat}/>
                </Col>
                <Col className="gutter-row" span={6}>                  
                  <Title level={5} >T???ng th??nh ti???n: </Title>
                  <InputNumber size="large" readOnly formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
                    value = {tongThanhTienXuat}
                    style={{
                      width: 200,
                      textAlign:"right"
                    }}
                    />
                </Col>
              </Row>
                                        
              <HStack justifyContent="end">
                <Button key="back" onClick={toogleModalFormContact}>Tho??t</Button>
                <Button key="save" type="primary" disabled = {!viewMode}  htmlType="submit">L??u</Button>
              </HStack>
            </Form>
      </Modal>
    </>
  )
}

export default PhieuXuat;
