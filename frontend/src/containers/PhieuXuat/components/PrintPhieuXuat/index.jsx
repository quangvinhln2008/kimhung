import React, {useState, useEffect, useRef} from "react";
import {useSearchParams, useParams, useNavigate, Link } from "react-router-dom";
import axios from 'axios'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify'
import { Divider,Modal, Typography, Button, Select, Space, DatePicker, InputNumber, Input, Table, Form, Tag, Popconfirm , Alert, Spin, Col, Row} from 'antd';
// import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter  } from "@chakra-ui/react";
import { SearchOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {VStack, HStack, Text , Heading, SimpleGrid, Stack } from  '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import ReactToPrint from "react-to-print";
import { useReactToPrint } from 'react-to-print';
import TablePrint from "./components/TablePrint";

const { Title } = Typography;

const PrintPhieuXuat = (props) =>{

  const [cookies, setCookie] = useCookies(['user']);
  
  const [dataPrint, setDataPrint] = useState()
  const [dataPrintChiTiet, setDataPrintChiTiet] = useState()
  const [loading, setLoading] = useState(true);
  const [pageStyle, setPageStyle] = useState("")
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

  async function lockPhieu(){
    const header = getHeader()
    console.log('run lock')
    return await axios
    .post(`https://testkhaothi.ufm.edu.vn:3002/PhieuXuat/lock/${Ident}`, {
        Ident: Ident,
      },{header})
      .then((res) => {
        const result = {
          status: res.status,
          data: res.data.result.recordset,
        }
        result?.data[0].status === 200 ? toast.success(result?.data[0].message): toast.error(result?.data[0].message)
        navigate(`/phieuxuat?type=xuatban`)
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
      title: 'Đơn vị tính',
      dataIndex: 'Dvt',
      key: 'Dvt',
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
    
    <VStack  ref={ref}>
      <div></div>
      <table>
        <tr>
          <th  style={{width: '50px', textAlign:'left'}}>CỬA HÀNG KIM HƯNG</th>
          {/* <th></th>
          <th></th>
          <th></th>
          <th></th> */}
          <th>PHIẾU XUẤT</th>
        </tr>
        <tr>
          <td style={{width: '450px'}}>514 Phạm Văn Chí P8 Q6</td>
          {/* <td></td>
          <td></td>
          <td></td>
          <td></td> */}
          <td>Ngày: {dataPrint?.NgayCt}</td>
        </tr>
        <tr>
          <td style={{width: '450px'}}>Đt: 0903310291</td>
          {/* <td style={{color: '#fff'}} >Francisco Chang</td>
          <td style={{color: '#fff'}}>Maria Anders</td>
          <td style={{color: '#fff'}}>Maria Anders</td>
          <td style={{color: '#fff'}}>Maria Anders</td> */}
          <td >Số chứng từ: {dataPrint?.SoCt}</td>
        </tr>
      </table>
      
      <SimpleGrid marginBottom={'10px'} columns={2} >
        <Text textAlign={'right'} fontSize='sm' fontWeight={'bold'}>Khách hàng:</Text>
        <Text fontSize='sm' marginLeft={'5px'} fontWeight={'bold'}>{dataPrint?.TenDoiTuong}</Text>
        <Text textAlign={'right'} fontSize='sm'>Diễn Giải:</Text>
        <Text fontSize='sm' marginLeft={'5px'}>{dataPrint?.DienGiai}</Text>
      </SimpleGrid>
      <Stack>
        <table style={{border: '1px solid #000', fontSize:'13pt', padding: '1px'}}>
          <thead style={{border: '1px solid #000', fontSize:'13pt', padding: '1px'}}>
            <tr style={{border: '1px solid #000', fontSize:'13pt', padding: '1px'}}>
              <th style={{border: '1px solid #000', fontSize:'13pt', padding: '0px 1px'}} >Stt</th>
              <th tyle={{border: '1px solid #000', fontSize:'13pt', padding: '0px 1px'}}>Tên vật tư</th>
              <th style={{border: '1px solid #000', fontSize:'13pt', padding: '0px 1px'}}>Đvt</th>
              <th style={{border: '1px solid #000', fontSize:'13pt', padding: '0px 1px'}}>SL</th>
              <th style={{border: '1px solid #000', fontSize:'13pt', padding: '0px 1px'}}>Đơn giá</th>
              <th style={{border: '1px solid #000', fontSize:'13pt', padding: '0px 1px'}}>Thành tiền</th>
            </tr>
          </thead>
          <tbody>          
            <TablePrint dataChiTiet = {dataPrintChiTiet}/>
          </tbody>
          <tfoot>
            <tr>
              <td style={{border: '1px solid #000', fontSize:'12pt', padding: '1px'}}></td>
              <td style={{border: '1px solid #000', fontSize:'12pt', padding: '1px'}}></td>            
              <td style={{border: '1px solid #000', fontSize:'12pt', padding: '2px', fontWeight:'bold'}}>Tổng cộng</td>
              <td style={{border: '1px solid #000', fontSize:'12pt', padding: '1px'}}></td>
              <td style={{border: '1px solid #000', fontSize:'12pt', padding: '1px'}}></td>
              <td style={{border: '1px solid #000', fontSize:'12pt', padding: '1px',fontWeight:'bold', textAlign:'right'}}>{dataPrint?.TongThanhTien}</td>
            </tr>
          </tfoot>
        </table>
      </Stack>
      
    {/* <Table 
      columns={columnsPrint} 
      pagination={false} 
      dataSource={dataPrintChiTiet} 
      bordered 
      summary={() => {    
        return (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}></Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <Text type="danger"></Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <Text fontWeight={'bold'} textAlign={'center'}>Tổng cộng</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                <Text fontWeight={'bold'} textAlign={'right'}>{dataPrint?.TongSoLuong}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                <Text></Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5}>
                <Text fontWeight={'bold'} textAlign={'right'}>{dataPrint?.TongThanhTien}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        );
      }}
      /> */}
      <SimpleGrid columns={6}>
        <Text fontSize='lg'>Người mua</Text>
        <Text fontSize='sm'></Text>
        <Text fontSize='sm'></Text>
        <Text fontSize='sm'></Text>
        <Text fontSize='sm'></Text>
        <Text fontSize='lg'>Người bán</Text>
      </SimpleGrid>
    </VStack>
));

  return(
    <>
      <div>
      <Space align="left" style={{ marginBottom: 16 }}>
        <ReactToPrint 
            pageStyle={pageStyle}
            trigger={() => <Button>In phiếu</Button>}
            content={() => componentRef.current}
            />
            <Button onClick= {() => navigate(`/phieuxuat?type=xuatban`)}>Trở về danh sách</Button>
            <Button type="primary" onClick= {lockPhieu}>Hoàn thành</Button>
        </Space>                          
                      
        <ComponentToPrint ref= {componentRef} />                
      </div>
    </>
  )
}

export default PrintPhieuXuat;
