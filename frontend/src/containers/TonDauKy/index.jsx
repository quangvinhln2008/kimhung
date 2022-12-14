import React, {useState, useEffect} from "react";
import axios from 'axios'
import moment from 'moment'
import { toast } from 'react-toastify'
import { Divider, Typography, Tabs, Button, Select, Modal, Space, DatePicker, InputNumber, Input, Table, Form, Tag, Popconfirm , Alert, Spin} from 'antd';
import { ImportOutlined, PlusCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import {VStack, HStack} from  '@chakra-ui/react';
import { read, utils, writeFile } from 'xlsx';

const { Title } = Typography;
const { Option } = Select;

const TonDauKy = () =>{
  
  const [form] = Form.useForm();
  const [data, setData] = useState()
  const [editMode, setEditMode] = useState(false)
  const [dataEdit, setDataEdit] = useState()
  const [dataVatTu, setDataVatTu] = useState()
  const [dataKho, setDataKho] = useState()
  const [dataKichThuoc, setDataKichThuoc] = useState()
  const [dataImportTonDauKy, setDataImportTonDauKy] = useState()
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false)
  const [openModalContact, setOpenModalContact] = useState(false)
  const [openModalImportTonDauKy, setOpenModalImportTonDauKyu] = useState(false)
  const [dataCheckNhomVatTu, setDataCheckNhomVatTu] = useState()
  const [optionsVatTu, setOptionVatTu] = useState()
  const [optionsKichThuoc, setOptionKichThuoc] = useState()
  const [optionsKho, setOptionKho] = useState()
  const [dataNhomVtFilter, setDataNhomVtFilter] = useState()
  const [dataVatTuFilter, setDataVatTuFilter] = useState()

  function toogleModalFormContact(){
    setOpenModalContact(!openModalContact)
  }

  function toogleModalFormImportTonDauKy(){
    setOpenModalImportTonDauKyu(!openModalImportTonDauKy)
  }

  const handleImportTonDauKy = ($event) => {
    const files = $event.target.files;
    if (files.length) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const wb = read(event.target.result);
            const sheets = wb.SheetNames;

            if (sheets.length) {
                const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                setDataImportTonDauKy(rows)
                setDataCheckNhomVatTu(null)
            }
        }
        reader.readAsArrayBuffer(file);
    }
}
  useEffect(()=>{
    setTimeout(() => {      
    loadTonDauKy()
    }, 500);
    
  },[refresh])


  useEffect(()=>{
    
    setOptionVatTu(dataVatTu?.map((d) => <Option key={d?.value}>{d?.label}</Option>));
    setOptionKho(dataKho?.map((d) => <Option key={d?.value}>{d?.label}</Option>));
    setOptionKichThuoc(dataKichThuoc?.map((d) => <Option key={d?.value}>{d?.label}</Option>));

    form.setFieldsValue({
        NgayCt: moment(dataEdit?.NgayCt, 'YYYY/MM/DD'),
        MaVatTu: dataEdit?.MaVatTu,
        MaKichThuoc: dataEdit?.MaKichThuoc,
        MaKho : dataEdit?.MaKho,
        SoLuongTon : dataEdit?.SoLuongTon,
        DonGiaTon: dataEdit?.DonGiaTon
    })
  }, [dataEdit])

  function toogleModalFormContact(){
    setOpenModalContact(!openModalContact)
  }

  function refreshData()
  {
    setLoading(true)

    setTimeout(() => {
      loadTonDauKy()
    }, 500);
  }

  function openCreateMode(){
    setEditMode(false)
    setOpenModalContact(!openModalContact)

    setOptionVatTu(dataVatTu?.map((d) => <Option key={d?.value}>{d?.label}</Option>));
    setOptionKho(dataKho?.map((d) => <Option key={d?.value}>{d?.label}</Option>));
    setOptionKichThuoc(dataKichThuoc?.map((d) => <Option key={d?.value}>{d?.label}</Option>));

    form.setFieldsValue({
        NgayCt: "",
        MaVatTu: "",
        MaKichThuoc: "",
        MaKho : "",
        SoLuongTon : "",
        DonGiaTon: ""
    })
  }

  async function loadTonDauKy(){
    return await axios
      .get('https://testkhaothi.ufm.edu.vn:3002/TonDauKy')
      .then((res) => {
        const result = {
          status: res.data.status,
          data: res.data.result.recordsets,
        }
        setData(result.data[0])
        setDataKho(result.data[1])
        setDataKichThuoc(result.data[2])
        setDataVatTu(result.data[3])
        setDataNhomVtFilter(result.data[4])
        setDataVatTuFilter(result.data[5])
        setLoading(false)
        return(result)
      })
      .catch(function (error) {
        // handle error
        console.log(error.response)
      })
  }

  async function GetTonDauKyEdit(MaTonDauKy){
    console.log('id', MaTonDauKy)
    setEditMode(true)
    return await axios
      .get(`https://testkhaothi.ufm.edu.vn:3002/TonDauKy/${MaTonDauKy}`)
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

  async function CreateTonDauKy(values){
    return await axios
      .post('https://testkhaothi.ufm.edu.vn:3002/TonDauKy/create', {
        NgayCt: values.NgayCt, 
        MaKho: values.MaKho, 
        MaVatTu: values.MaVatTu, 
        SoLuongTon: values.SoLuongTon, 
        DonGiaTon: values.DonGiaTon})
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

  async function UpdateTonDauKy(values){
    console.log('run update')
    return await axios
      .post(`https://testkhaothi.ufm.edu.vn:3002/TonDauKy/${dataEdit?.Id}`, {
        NgayCt: values.NgayCt.format('YYYY-MM-DD'), 
        MaKho: values.MaKho, 
        MaVatTu: values.MaVatTu, 
        SoLuongTon: values.SoLuongTon, 
        DonGiaTon: values.DonGiaTon})
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

  async function DeleteTonDauKy(MaTonDauKy){
    return await axios
      .post(`https://testkhaothi.ufm.edu.vn:3002/TonDauKy/delete/${MaTonDauKy}`)
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

  async function importTonDauKy(){
    return await axios
      .post('https://testkhaothi.ufm.edu.vn:3002/import/tondauky', {
        DataImportTonDauKy: dataImportTonDauKy
      })
      .then((res) => {
        const result = {
          status: res.status,
          data: res.data.result.recordsets,
        }
        setDataCheckNhomVatTu(result?.data[1])
        setRefresh(!refresh)
        result?.data[0][0].status === 200 ? toast.success(result?.data[0][0].message): toast.error(result?.data[0][0].message)
        return(result)
      })
      .catch(function (error) {
        // handle error
        console.log(error.response)
        toast.error(error?.response)
      })
  };

  const onChange = (pagination, filters, sorter, extra) => {
    // const filterNhom = dataVatTuFilter.filters(item => item.TenNhomVatTu === filters?.TenNhomVatTu[0])
    // setFilterVt(filterNhom)
    console.log('params', pagination, filters, sorter, extra);
  };
  const columns = [
    {
      title: 'Ng??y t???n',
      dataIndex: 'NgayCt',
      key: 'NgayCt',
    },
    {
      title: 'Kho',
      dataIndex: 'TenKho',
      key: 'TenKho',
    },
    {
      title: 'Nh??m v???t t??',
      dataIndex: 'TenNhomVatTu',
      key: 'TenNhomVatTu',filters: dataNhomVtFilter,
      filterMode: 'tree',
      onFilter: (value, record) => record.TenNhomVatTu.includes(value),
      ellipsis: true,
    },{
      title: 'M?? v???t t??',
      dataIndex: 'MaVT',
      key: 'MaVT',
      filters: dataVatTuFilter,
      onFilter: (value, record) => record.MaVT.includes(value),
      filterSearch: true,
    },
    {
      title: 'T??n v???t t??',
      dataIndex: 'TenVatTu',
      key: 'TenVatTu',
    },
    {
      title: 'S??? l?????ng t???n',
      dataIndex: 'SoLuongTon',
      key: 'SoLuongTon',
      align:'right'
    },
    {
      title: '????n gi?? t???n',
      dataIndex: 'DonGiaTon',
      key: 'DonGiaTon',
      align:'right'
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <>
          <Space size="middle">
            {!record.Is_Deleted && <Button key={record.id} type="link" onClick= {() =>{GetTonDauKyEdit(record.Id)}}>C???p nh???t</Button>}
          </Space>
        </>
      ),
    },
  ];

  const columnsImportTonDauKy = [
    {
      title: 'M?? v???t t??',
      dataIndex: 'MaVatTu',
      key: 'MaVatTu',
    },
    {
      title: 'T??n v???t t??',
      dataIndex: 'TenVatTu',
      key: 'TenVatTu',
    },
    {
      title: 'S??? l?????ng t???n',
      dataIndex: 'SoLuongTon',
      align:'right',
      key: 'SoLuongTon',
    },
    {
      title: '????n gi?? t???n',
      dataIndex: 'DonGiaTon',
      align:'right',
      key: 'DonGiaTon',
    }
  ];

  return(
    <>
      <Title level={3}>T???n kho v???t t?? ?????u k???</Title>
      <Divider />
      <VStack justifyContent={"start"} alignItems="start">
        <Space align="left" style={{ marginBottom: 16 }}>
          <Button  onClick={openCreateMode}  type="primary" icon={<PlusCircleOutlined />}>
              Th??m m???i
          </Button>
          <Button onClick={toogleModalFormImportTonDauKy} icon={<ImportOutlined />}>
              Th??m m???i t???n kho v???t t?? b???ng file Excel
          </Button>
          <Button  onClick={refreshData}  type="default" icon={<ReloadOutlined />}>
              Refresh d??? li???u
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
              <Table columns={columns} dataSource={data}  onChange={onChange}/>}
      </VStack>

      {/* Modal th??m m???i */}
      <Modal
        open={openModalContact}
        title={!editMode ? "Th??m m???i t???n ?????u k???" : "C???p nh???t t???n ?????u k???"}
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
          onFinish={!editMode? CreateTonDauKy: UpdateTonDauKy}
        >
          <Form.Item
            label="Ng??y t???n: "
            name="NgayCt"
            rules={[
              {
                required: true,
                message: 'Vui l??ng nh???p ng??y t???n kho!'
              },
            ]}
          >
            <DatePicker format={"DD-MM-YYYY"}   />
          </Form.Item>
          
          <Form.Item
            label="Kho: "
            name="MaKho"
            rules={[
              {
                required: true,
                message: 'Vui l??ng ch???n kho th?? vi???n!'
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
                {optionsKho}
              </Select>
          </Form.Item>          
          <Form.Item
            label="T??n v???t t??: "
            name="MaVatTu"
            rules={[
              {
                required: true,
                message: 'Vui l??ng ch???n t??n v???t t??!'
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
                {optionsVatTu}
              </Select>
          </Form.Item>
          <Form.Item
            label="S??? l?????ng t???n: "
            name="SoLuongTon"
            rules={[
              {
                required: true,
                message: 'Vui l??ng nh???p s??? l?????ng t???n kho!'
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
          <Form.Item
            label="????n gi?? t???n: "
            name="DonGiaTon"
            rules={[
              {
                required: true,
                message: 'Vui l??ng nh???p ????n gi?? t???n!'
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
            <Button key="back" onClick={toogleModalFormContact}>Tho??t</Button>
            <Button key="save" type="primary"  htmlType="submit">L??u</Button>
          </HStack>
        </Form>
      </Modal>

      {/* Modal th??m m???i b???ng file excel */}
      <Modal 
        open={openModalImportTonDauKy}
        title={"Th??m m???i t???n ?????u k??? b???ng file Excel"}
        onCancel={toogleModalFormImportTonDauKy}
        footer={null}
        width={1000}
      >
      <Form form={form} 
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 20,
          }}
          // onFinish={importVatTu}
        >          
          <Form.Item
            name="upload"
            label="Ch???n file"
          >
            <input type="file" name="file" className="custom-file-input" id="inputGroupFile" required onChange={handleImportTonDauKy}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
            <label className="custom-file-label" htmlFor="inputGroupFile">Ch???n file import</label>           
            
          </Form.Item>
          <Tabs
            defaultActiveKey="1"
            onChange={onChange}
            items={[
              {
                label: `D??? li???u import`,
                key: '1',
                children: (<>
                  <Table columns={columnsImportTonDauKy} dataSource={dataImportTonDauKy} />
                </>),
              },
              {
                label: `L???i`,
                key: '2',
                children: (<>
                  <Table columns={columnsImportTonDauKy} dataSource={dataCheckNhomVatTu} />
                </>),
              }
            ]}
          />
          
        </Form>
        
        <HStack justifyContent="end">
            <Button key="back" onClick={toogleModalFormImportTonDauKy}>Tho??t</Button>
            <Button key="save" type="primary"  onClick={importTonDauKy}>Import t???n ?????u k???</Button>
          </HStack>
      </Modal>
    </>
  )
}

export default TonDauKy;