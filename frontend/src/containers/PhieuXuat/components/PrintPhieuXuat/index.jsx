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
      title: 'T??n v???t t??',
      dataIndex: 'TenVatTu',
      key: 'TenVatTu',
    },
    {
      title: '????n v??? t??nh',
      dataIndex: 'Dvt',
      key: 'Dvt',
    },
    {
      title: 'S??? l?????ng xu???t',
      dataIndex: 'SoLuongXuat',
      key: 'SoLuongXuat',
      align:'right'
    },
    {
      title: '????n gi??',
      dataIndex: 'DonGiaXuat',
      key: 'DonGiaXuat',
      align:'right'
    },
    {
      title: 'Th??nh ti???n',
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
          <th  style={{width: '50px', textAlign:'left'}}>C???A H??NG KIM H??NG</th>
          {/* <th></th>
          <th></th>
          <th></th>
          <th></th> */}
          <th>PHI???U XU???T</th>
        </tr>
        <tr>
          <td style={{width: '450px'}}>514 Ph???m V??n Ch?? P8 Q6</td>
          {/* <td></td>
          <td></td>
          <td></td>
          <td></td> */}
          <td>Ng??y: {dataPrint?.NgayCt}</td>
        </tr>
        <tr>
          <td style={{width: '450px'}}>??t: 0903310291</td>
          {/* <td style={{color: '#fff'}} >Francisco Chang</td>
          <td style={{color: '#fff'}}>Maria Anders</td>
          <td style={{color: '#fff'}}>Maria Anders</td>
          <td style={{color: '#fff'}}>Maria Anders</td> */}
          <td >S??? ch???ng t???: {dataPrint?.SoCt}</td>
        </tr>
      </table>
      
      <SimpleGrid marginBottom={'10px'} columns={2} >
        <Text textAlign={'right'} fontSize='sm' fontWeight={'bold'}>Kh??ch h??ng:</Text>
        <Text fontSize='sm' marginLeft={'5px'} fontWeight={'bold'}>{dataPrint?.TenDoiTuong}</Text>
        <Text textAlign={'right'} fontSize='sm'>Di???n Gi???i:</Text>
        <Text fontSize='sm' marginLeft={'5px'}>{dataPrint?.DienGiai}</Text>
      </SimpleGrid>
      <Stack>
        <table style={{border: '1px solid #000', fontSize:'13pt', padding: '1px'}}>
          <thead style={{border: '1px solid #000', fontSize:'13pt', padding: '1px'}}>
            <tr style={{border: '1px solid #000', fontSize:'13pt', padding: '1px'}}>
              <th style={{border: '1px solid #000', fontSize:'13pt', padding: '0px 1px'}} >Stt</th>
              <th tyle={{border: '1px solid #000', fontSize:'13pt', padding: '0px 1px'}}>T??n v???t t??</th>
              <th style={{border: '1px solid #000', fontSize:'13pt', padding: '0px 1px'}}>??vt</th>
              <th style={{border: '1px solid #000', fontSize:'13pt', padding: '0px 1px'}}>SL</th>
              <th style={{border: '1px solid #000', fontSize:'13pt', padding: '0px 1px'}}>????n gi??</th>
              <th style={{border: '1px solid #000', fontSize:'13pt', padding: '0px 1px'}}>Th??nh ti???n</th>
            </tr>
          </thead>
          <tbody>          
            <TablePrint dataChiTiet = {dataPrintChiTiet}/>
          </tbody>
          <tfoot>
            <tr>
              <td style={{border: '1px solid #000', fontSize:'12pt', padding: '1px'}}></td>
              <td style={{border: '1px solid #000', fontSize:'12pt', padding: '1px'}}></td>            
              <td style={{border: '1px solid #000', fontSize:'12pt', padding: '2px', fontWeight:'bold'}}>T???ng c???ng</td>
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
                <Text fontWeight={'bold'} textAlign={'center'}>T???ng c???ng</Text>
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
        <Text fontSize='lg'>Ng?????i mua</Text>
        <Text fontSize='sm'></Text>
        <Text fontSize='sm'></Text>
        <Text fontSize='sm'></Text>
        <Text fontSize='sm'></Text>
        <Text fontSize='lg'>Ng?????i b??n</Text>
      </SimpleGrid>
    </VStack>
));

  return(
    <>
      <div>
      <Space align="left" style={{ marginBottom: 16 }}>
        <ReactToPrint 
            pageStyle={pageStyle}
            trigger={() => <Button>In phi???u</Button>}
            content={() => componentRef.current}
            />
            <Button onClick= {() => navigate(`/phieuxuat?type=xuatban`)}>Tr??? v??? danh s??ch</Button>
            <Button type="primary" onClick= {lockPhieu}>Ho??n th??nh</Button>
        </Space>                          
                      
        <ComponentToPrint ref= {componentRef} />                
      </div>
    </>
  )
}

export default PrintPhieuXuat;
