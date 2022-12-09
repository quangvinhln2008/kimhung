import React, {useState, useEffect, useRef} from "react";
import {useSearchParams, useParams, useNavigate, Link } from "react-router-dom";
import axios from 'axios'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify'
import { Divider,Modal, Typography, Button, Select, Space, DatePicker, InputNumber, Input, Table, Form, Tag, Popconfirm , Alert, Spin, Col, Row} from 'antd';
// import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter  } from "@chakra-ui/react";
import { SearchOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {VStack, HStack, Text , Heading, SimpleGrid } from  '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import ReactToPrint from "react-to-print";
import { useReactToPrint } from 'react-to-print';

const { Title } = Typography;

const PrintPhieuXuat = (props) =>{

  const [cookies, setCookie] = useCookies(['user']);
  
  const [dataPrint, setDataPrint] = useState()
  const [dataPrintChiTiet, setDataPrintChiTiet] = useState()
  const [loading, setLoading] = useState(true);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const {Ident} = useParams ()
  
  let componentRef = useRef()

  const getHeader = function () {
    const rToken = cookies.rToken
    return {
      Authorization: 'Bearer ' + rToken,
    }
  }

  async function GetPhieuXuatPrint(MaPhieuXuat){
    console.log('run print')
    return await axios
      .get(`https://testkhaothi.ufm.edu.vn:3002/PhieuXuat/print/${MaPhieuXuat}`)
      .then((res) => {
        const result = {
          status: res.status,
          data: res.data.result.recordsets,
          dataPrint: res.data.result.recordset[0]
        }
        
        setDataPrint(result.dataPrint)
        setDataPrintChiTiet(result.data[1])
        return(result)
      })
      .catch(function (error) {
        // handle error
        console.log(error.response)
        toast.error(error?.response)
      })
  };

  const columnsPrint = [
    {
      title: 'STT',
      dataIndex: 'Stt',
      key: 'Stt',
    },
    {
      title: 'Tên vật tư',
      dataIndex: 'TenVatTu',
      key: 'TenVatTu',
    },
    {
      title: 'Số lượng xuất',
      dataIndex: 'SoLuongXuat',
      key: 'SoLuongXuat',
      align:'right'
    },
    {
      title: 'Đơn giá',
      dataIndex: 'DonGiaXuat',
      key: 'DonGiaXuat',
      align:'right'
    },
    {
      title: 'Thành tiền',
      dataIndex: 'ThanhTienXuat',
      key: 'ThanhTienXuat',
      align:'right'
    }
  ];
  useEffect(()=>{
    GetPhieuXuatPrint(Ident)
  },[])

const ComponentToPrint = React.forwardRef((props, ref) => (
    <VStack marginTop={"10px"} ref={ref}>
      <VStack alignSelf={"flex-start"} margin={"10px"}>
        <Heading as ='h6' size='xs' textAlign={'left'}>Cửa hàng Kim Hưng</Heading >
        <Heading as ='h6' size='xs'>Địa chỉ: Số 514 Phạm Văn Chí, Phường 8, Quận 6, TP.HCM</Heading>
        <Heading as ='h6' size='xs'>Điện thoại: 0903310291</Heading>
      </VStack>
      <Title level={4}>PHIẾU XUẤT KHO</Title>
      <Heading as ='h6' size='xs'>Ngày: {dataPrint?.NgayCt}</Heading>
      <Heading as ='h6' size='xs'>Số chứng từ: {dataPrint?.SoCt}</Heading>
      <SimpleGrid columns={2} spacing={1}>
        <Text fontSize='sm'>Khách hàng:</Text>
        <Text fontSize='sm'>{dataPrint?.TenDoiTuong}</Text>
        <Text fontSize='sm'>Diễn Giải:</Text>
        <Text fontSize='sm'>{dataPrint?.DienGiai}</Text>
      </SimpleGrid>
      
    <Table columns={columnsPrint} pagination={false} dataSource={dataPrintChiTiet}/>
    <SimpleGrid columns={1} spacing={1}>
        <Text fontSize='sm'>Tổng số lượng: <b>{dataPrint?.TongSoLuong}</b></Text>
        <Text fontSize='sm'>Tổng thành tiền: <b>{dataPrint?.TongThanhTien}</b></Text>
        <Text fontSize='sm'>Bằng chữ: <b>{dataPrint?.DocTien}</b></Text>
      </SimpleGrid>
      <SimpleGrid columns={4}>
        <Text fontSize='sm'></Text>
        <Text fontSize='sm'></Text>
        <Text fontSize='sm'></Text>
        <Text fontSize='sm' fontWeight={"bold"}>NGƯỜI LẬP</Text>
      </SimpleGrid>
    </VStack>
));

  return(
    <>
      <div>
      <Space align="left" style={{ marginBottom: 16 }}>
        <ReactToPrint 
            trigger={() => <Button>In phiếu</Button>}
            content={() => componentRef.current}
            />
            <Button onClick= {() => navigate(`/phieuxuat?type=xuatban`)}>Trở về danh sách</Button>
                      
              <ComponentToPrint ref= {componentRef} />  
        </Space>                                 
      </div>
    </>
  )
}

export default PrintPhieuXuat;
