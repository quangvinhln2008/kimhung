import React, {useState, useEffect} from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import { Divider, Typography, Tabs, Button, Select, Modal, Space, Switch, Input, InputNumber, Table, Form, Tag, Popconfirm , Alert, Spin, Upload, message} from 'antd';
import { SearchOutlined, PlusCircleOutlined, ImportOutlined, ReloadOutlined } from '@ant-design/icons';
import {VStack, HStack} from  '@chakra-ui/react';
import { read, utils, writeFile } from 'xlsx';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const VatTu = () =>{
  
  const [form] = Form.useForm();
  const [formImport] = Form.useForm();
  const [formUpdateGia] = Form.useForm();
  const [data, setData] = useState()
  const [dataNhomVtFilter, setDataNhomVtFilter] = useState()
  const [dataVatTuFilter, setDataVatTuFilter] = useState()
  const [editMode, setEditMode] = useState(false)
  const [dataEdit, setDataEdit] = useState()
  const [dataImportVatTu, setDataImportVatTu] = useState()
  const [dataUpdateGiaVatTu, setDataUpdateGiaVatTu] = useState()
  const [dataCheckNhomVatTu, setDataCheckNhomVatTu] = useState()
  const [dataDoiTuong, setDataDoiTuong] = useState()
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false)
  const [quyDoi, setQuyDoi] = useState(false)
  const [openModalContact, setOpenModalContact] = useState(false)
  const [openModalImportVatTu, setOpenModalImportVatTu] = useState(false)
  const [openModalUpdateGiaVatTu, setOpenModalUpdatetGiaVatTu] = useState(false)
  const [options, setOption] = useState()
  const [filterVt, setFilterVt] = useState({});

  function toogleModalFormContact(){
    setOpenModalContact(!openModalContact)
  }

  function toogleModalFormImportVatTu(){
    setOpenModalImportVatTu(!openModalImportVatTu)
  }

  function toogleModalFormGiaVatTu(){
    setOpenModalUpdatetGiaVatTu(!openModalUpdateGiaVatTu)
  }
  
  function toogleQuyDoiDvt(){
    setQuyDoi(!quyDoi)
  }

  const onChange = (pagination, filters, sorter, extra) => {
    // const filterNhom = dataVatTuFilter.filters(item => item.TenNhomVatTu === filters?.TenNhomVatTu[0])
    // setFilterVt(filterNhom)
    console.log('params', pagination, filters, sorter, extra);
  };

  const handleImportVatTu = ($event) => {
    const files = $event.target.files;
    if (files.length) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const wb = read(event.target.result);
            const sheets = wb.SheetNames;

            if (sheets.length) {
                const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                setDataImportVatTu(rows)
                setDataCheckNhomVatTu(null)
            }
        }
        reader.readAsArrayBuffer(file);
    }
}

const handleUpdateGiaVatTu = ($event) => {
  const files = $event.target.files;
  if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
          const wb = read(event.target.result);
          const sheets = wb.SheetNames;

          if (sheets.length) {
              const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
              setDataUpdateGiaVatTu(rows)
              setDataCheckNhomVatTu(null)
          }
      }
      reader.readAsArrayBuffer(file);
  }
}

  useEffect(()=>{
    setTimeout(() => {
      loadVatTu()
    }, 500);
    
  },[refresh])

  useEffect(()=>{
    
    setOption(dataDoiTuong?.map((d) => <Option key={d?.value}>{d?.label}</Option>));

    form.setFieldsValue({
      MaVatTu: dataEdit?.MaVatTu,  
      TenVatTu: dataEdit?.TenVatTu,
      Dvt: dataEdit?.Dvt,
      MaNhomVatTu: dataEdit?.MaNhomVatTu,
      GiaBan : dataEdit?.GiaBan
    })
  }, [dataEdit])

  function toogleModalFormContact(){
    setOpenModalContact(!openModalContact)
  }

  function openCreateMode(){
    setEditMode(false)
    setOpenModalContact(!openModalContact)

    setOption(dataDoiTuong?.map((d) => <Option key={d?.value}>{d?.label}</Option>));
    form.setFieldsValue({
      MaVatTu: "",
      TenVatTu: "",
      MaNhomVatTu: "",
      GiaBan : 0
    })
  }
  function refreshData()
  {
    setLoading(true)

    setTimeout(() => {
      loadVatTu()
    }, 500);
  }
  async function loadVatTu(){
    return await axios
      .get('https://testkhaothi.ufm.edu.vn:3002/vattu')
      .then((res) => {
        const result = {
          status: res.data.status,
          data: res.data.result.recordsets,
        }
        setData(result.data[0])
        setDataDoiTuong(result.data[1])
        setDataNhomVtFilter(result.data[2])
        setDataVatTuFilter(result.data[3])
        
        setLoading(false)
        return(result)
      })
      .catch(function (error) {
        // handle error
        console.log(error.response)
      })
  }

  async function GetVatTuEdit(MaVatTu){
    setEditMode(true)
    return await axios
      .get(`https://testkhaothi.ufm.edu.vn:3002/vattu/${MaVatTu}`)
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

  async function CreateVatTu(values){
    return await axios
      .post('https://testkhaothi.ufm.edu.vn:3002/VatTu/create', {
        MaVatTu: values.MaVatTu,
        TenVatTu: values.TenVatTu,
        Dvt: values.Dvt, 
        MaNhomVatTu: values.MaNhomVatTu, 
        GiaBan: values.GiaBan,
        Is_QDoi: values.Is_QDoi,
        Dvt_QDoi: values.Dvt_QDoi,
        HSo_QDoi: values.HSo_QDoi
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

  async function UpdateVatTu(values){
    console.log('run update')
    return await axios
      .post(`https://testkhaothi.ufm.edu.vn:3002/vattu/${dataEdit?.Id}`, {
        MaVatTu: values.MaVatTu,
        TenVatTu: values.TenVatTu, 
        Dvt: values.Dvt,
        MaNhomVatTu: values.MaNhomVatTu, 
        GiaBan: values.GiaBan,
        Is_QDoi: values.Is_QDoi,
        Dvt_QDoi: values.Dvt_QDoi,
        HSo_QDoi: values.HSo_QDoi
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

  async function DeleteVatTu(MaVatTu){
    return await axios
      .post(`https://testkhaothi.ufm.edu.vn:3002/vattu/delete/${MaVatTu}`)
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
  
  async function importVatTu(){
    return await axios
      .post('https://testkhaothi.ufm.edu.vn:3002/import/vattu', {
        DataImportVatTu: dataImportVatTu
      })
      .then((res) => {
        const result = {
          status: res.status,
          data: res.data.result.recordsets,
        }
        setDataCheckNhomVatTu(result?.data[1])
        result?.data[0][0].status === 200 ? toast.success(result?.data[0][0].message): toast.error(result?.data[0][0].message)
        return(result)
      })
      .catch(function (error) {
        // handle error
        console.log(error.response)
        toast.error(error?.response)
      })
  };
  async function updateGiaVatTu(){
    return await axios
      .post('https://testkhaothi.ufm.edu.vn:3002/import/giavattu', {
        DataImportVatTu: dataUpdateGiaVatTu
      })
      .then((res) => {
        const result = {
          status: res.status,
          data: res.data.result.recordsets,
        }
        setDataCheckNhomVatTu(result?.data[1])
        result?.data[0][0].status === 200 ? toast.success(result?.data[0][0].message): toast.error(result?.data[0][0].message)
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
      title: 'Nh??m v???t t??',
      dataIndex: 'TenNhomVatTu',
      key: 'TenNhomVatTu',
      filters: dataNhomVtFilter,
      filterMode: 'tree',
      onFilter: (value, record) => record.TenNhomVatTu.includes(value),
      ellipsis: true,
    },
    {
      title: 'M?? v???t t??',
      dataIndex: 'MaVatTu',
      key: 'MaVatTu',
      filters: dataVatTuFilter,
      onFilter: (value, record) => record.MaVatTu.includes(value),
      filterSearch: true,
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
      title: 'Gi?? b??n',
      dataIndex: 'GiaBan',
      align:'right',
      key: 'GiaBan',
    },
    {
      title: 'T??nh tr???ng',
      key: 'Is_Deleted',
      dataIndex: 'Is_Deleted',
      render: (_, record) => (                   
          <Tag color={record.Is_Deleted ? 'volcano' :'green'} key={record.Id}>
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
            {!record.Is_Deleted && <Button key={record.Id} type="link" onClick= {() =>{GetVatTuEdit(record.Id)}}>C???p nh???t</Button>}
          </Space>
          <Space size="middle">
          {!record.Is_Deleted && <>
              <Popconfirm
                title="B???n c?? ch???c x??a v???t t?? kh??ng?"
                onConfirm={()=>{DeleteVatTu(record.Id)}}
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
  const columnsImportVatTu = [
    {
      title: 'Nh??m v???t t??',
      dataIndex: 'MaNhomVatTu',
      key: 'MaNhomVatTu',      
    },
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
      title: '????n v??? t??nh',
      dataIndex: 'Dvt',
      key: 'Dvt',
    },
    {
      title: 'Gi?? b??n',
      dataIndex: 'GiaBan',
      align:'right',
      key: 'GiaBan',
    }
  ];

  return(
    <>
      <Title level={3}>V???t t??</Title>
      <Divider />
      <VStack justifyContent={"start"} alignItems="start">
        <Space align="left" style={{ marginBottom: 16 }}>
          <Button  onClick={openCreateMode}  type="primary" icon={<PlusCircleOutlined />}>
              Th??m m???i
          </Button>
          <Button onClick={toogleModalFormImportVatTu} icon={<ImportOutlined />}>
              Th??m m???i v???t t?? b???ng file Excel
          </Button>
          <Button  onClick={toogleModalFormGiaVatTu} icon={<ImportOutlined />}>
              C???p nh???t gi?? v???t t?? b???ng file Excel
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
              <Table columns={columns} dataSource={data} onChange={onChange}/>}
      </VStack>

      {/* Modal th??m m???i */}
      <Modal 
        open={openModalContact}
        title={!editMode ? "Th??m m???i v???t t??" : "C???p nh???t v???t t??"}
        // onOk={submitChangeEmail}
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
          onFinish={!editMode? CreateVatTu: UpdateVatTu}
        >
          
          <Form.Item
            label="Nh??m v???t t??: "
            name="MaNhomVatTu"
            rules={[
              {
                required: true,
                message: 'Vui l??ng ch???n nh??m v???t t??!'
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
              {options}
            </Select>
          </Form.Item>
          <Form.Item
            label="M?? v???t t??: "
            name="MaVatTu"
            rules={[
              {
                required: true,
                message: 'Vui l??ng nh???p m?? v???t t??!'
              },
            ]}
          >
          <Input  />
          </Form.Item>
          <Form.Item
            label="T??n v???t t??: "
            name="TenVatTu"
            rules={[
              {
                required: true,
                message: 'Vui l??ng nh???p t??n v???t t??!'
              },
            ]}
          >
          <Input  />
          </Form.Item>
          <Form.Item
            label="????n v??? t??nh: "
            name="Dvt"
            rules={[
              {
                required: true,
                message: 'Vui l??ng nh???p ????n v??? t??nh!'
              },
            ]}
          >
          <Input  />
          </Form.Item>
          <Form.Item
            label="Gi?? b??n:"
            name="GiaBan"
            rules={[
              {
                required: true,
                message: 'Vui l??ng nh???p gi?? b??n!'
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
            label="Quy ?????i:"
            name="Is_QDoi"            
          >
          <Switch onChange={toogleQuyDoiDvt} />
          </Form.Item>
          <Form.Item
            label="????n v??? t??nh quy ?????i: "
            name="Dvt_QDoi"
            rules={[
              {
                required: quyDoi,
                message: 'Vui l??ng nh???p ????n v??? t??nh!'
              },
            ]}
          >
          <Input disabled ={!quyDoi} />
          </Form.Item>
          <Form.Item
            label="H??? s??? quy ?????i:"
            name="HSo_QDoi"
            rules={[
              {
                required: quyDoi,
                message: 'Vui l??ng nh???p h??? s???!'
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
            defaultValue={0}
            disabled ={!quyDoi} />
          </Form.Item>
          <HStack justifyContent="end">
            <Button key="back" onClick={toogleModalFormContact}>Tho??t</Button>
            <Button key="save" type="primary"  htmlType="submit">L??u</Button>
          </HStack>
        </Form>
      </Modal>

      {/* Modal th??m m???i b???ng file excel */}
      <Modal 
        open={openModalImportVatTu}
        title={"Th??m m???i v???t t?? b???ng file Excel"}
        onCancel={toogleModalFormImportVatTu}
        footer={null}
        width={1000}
      >
      <Form form={formImport} 
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
            <input type="file" name="file" className="custom-file-input" id="inputGroupFile" required onChange={handleImportVatTu}
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
                  <Table columns={columnsImportVatTu} dataSource={dataImportVatTu} />
                </>),
              },
              {
                label: `L???i`,
                key: '2',
                children: (<>
                  <Table columns={columnsImportVatTu} dataSource={dataCheckNhomVatTu} />
                </>),
              }
            ]}
          />
          
        </Form>
        
        <HStack justifyContent="end">
            <Button key="back" onClick={toogleModalFormImportVatTu}>Tho??t</Button>
            <Button key="save" type="primary"  onClick={importVatTu}>Import v???t t??</Button>
          </HStack>
      </Modal>

      {/* Modal update gia vat tu b???ng file excel */}
      <Modal 
        open={openModalUpdateGiaVatTu}
        title={"C???p nh???t gi?? v???t t?? b???ng file Excel"}
        onCancel={toogleModalFormGiaVatTu}
        footer={null}
        width={1000}
      >
      <Form form={formUpdateGia} 
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
            <input type="file" name="file" className="custom-file-input" id="inputGroupFile" required onChange={handleUpdateGiaVatTu}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
            <label className="custom-file-label" htmlFor="inputGroupFile">Ch???n file excel ????? c???p nh???t gi??</label>           
            
          </Form.Item>
          <Tabs
            defaultActiveKey="1"
            onChange={onChange}
            items={[
              {
                label: `D??? li???u c???p nh???t`,
                key: '1',
                children: (<>
                  <Table columns={columnsImportVatTu} dataSource={dataUpdateGiaVatTu} />
                </>),
              },
              {
                label: `L???i`,
                key: '2',
                children: (<>
                  <Table columns={columnsImportVatTu} dataSource={dataCheckNhomVatTu} />
                </>),
              }
            ]}
          />
          
        </Form>
        
        <HStack justifyContent="end">
            <Button key="back" onClick={toogleModalFormGiaVatTu}>Tho??t</Button>
            <Button key="save" type="primary"  onClick={updateGiaVatTu}>C???p nh???t gi??</Button>
          </HStack>
      </Modal>
    </>
  )
}

export default VatTu;