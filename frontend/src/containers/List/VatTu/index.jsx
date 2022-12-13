import React, {useState, useEffect} from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import { Divider, Typography, Tabs, Button, Select, Modal, Space, Input, InputNumber, Table, Form, Tag, Popconfirm , Alert, Spin, Upload, message} from 'antd';
import { SearchOutlined, PlusCircleOutlined, ImportOutlined, ReloadOutlined } from '@ant-design/icons';
import {VStack, HStack} from  '@chakra-ui/react';
import { read, utils, writeFile } from 'xlsx';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const VatTu = () =>{
  
  const [form] = Form.useForm();
  const [formImport] = Form.useForm();
  const [data, setData] = useState()
  const [dataNhomVtFilter, setDataNhomVtFilter] = useState()
  const [dataVatTuFilter, setDataVatTuFilter] = useState()
  const [editMode, setEditMode] = useState(false)
  const [dataEdit, setDataEdit] = useState()
  const [dataImportVatTu, setDataImportVatTu] = useState()
  const [dataCheckNhomVatTu, setDataCheckNhomVatTu] = useState()
  const [dataCheckVatTu, setDataCheckVatTu] = useState()
  const [dataDoiTuong, setDataDoiTuong] = useState()
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false)
  const [openModalContact, setOpenModalContact] = useState(false)
  const [openModalImportVatTu, setOpenModalImportVatTu] = useState(false)
  const [openModalImportGiaVatTu, setOpenModalImportGiaVatTu] = useState(false)
  const [options, setOption] = useState()
  const [filterVt, setFilterVt] = useState({});

  function toogleModalFormContact(){
    setOpenModalContact(!openModalContact)
  }

  function toogleModalFormImportVatTu(){
    setOpenModalImportVatTu(!openModalImportVatTu)
  }

  function toogleModalFormGiaVatTu(){
    setOpenModalImportGiaVatTu(!openModalImportGiaVatTu)
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
  // const propsImportVatTu = {
  //   onChange(info) {
  //     if (info.file.status !== 'uploading') {
  //       console.log(info.file, info.fileList);
  //     }
  //     if (info.file.status === 'done') {
  //       message.success(`${info.file.name} file uploaded successfully`);
  //     } else if (info.file.status === 'error') {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  // };

  useEffect(()=>{
    setTimeout(() => {
      loadVatTu()
    }, 1000);
    
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
    }, 1000);
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
        GiaBan: values.GiaBan
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
        GiaBan: values.GiaBan
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


  const columns = [
    {
      title: 'Nhóm vật tư',
      dataIndex: 'TenNhomVatTu',
      key: 'TenNhomVatTu',
      filters: dataNhomVtFilter,
      filterMode: 'tree',
      onFilter: (value, record) => record.TenNhomVatTu.includes(value),
      ellipsis: true,
    },
    {
      title: 'Mã vật tư',
      dataIndex: 'MaVatTu',
      key: 'MaVatTu',
      filters: dataVatTuFilter,
      onFilter: (value, record) => record.MaVatTu.includes(value),
      filterSearch: true,
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
      title: 'Giá bán',
      dataIndex: 'GiaBan',
      align:'right',
      key: 'GiaBan',
    },
    {
      title: 'Tình trạng',
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
            {!record.Is_Deleted && <Button key={record.Id} type="link" onClick= {() =>{GetVatTuEdit(record.Id)}}>Cập nhật</Button>}
          </Space>
          <Space size="middle">
          {!record.Is_Deleted && <>
              <Popconfirm
                title="Bạn có chắc xóa vật tư không?"
                onConfirm={()=>{DeleteVatTu(record.Id)}}
                okText="Yes"
                cancelText="No"
              >
                <Button key={record.Id} type="link" danger >Xóa</Button>
              </Popconfirm>
            </>}
          </Space>
        </>
        
      ),
    },
  ];
  const columnsImportVatTu = [
    {
      title: 'Nhóm vật tư',
      dataIndex: 'MaNhomVatTu',
      key: 'MaNhomVatTu',      
    },
    {
      title: 'Mã vật tư',
      dataIndex: 'MaVatTu',
      key: 'MaVatTu',
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
      title: 'Giá bán',
      dataIndex: 'GiaBan',
      align:'right',
      key: 'GiaBan',
    }
  ];

  return(
    <>
      <Title level={3}>Vật tư</Title>
      <Divider />
      <VStack justifyContent={"start"} alignItems="start">
        <Space align="left" style={{ marginBottom: 16 }}>
          <Button  onClick={openCreateMode}  type="primary" icon={<PlusCircleOutlined />}>
              Thêm mới
          </Button>
          <Button onClick={toogleModalFormImportVatTu} icon={<ImportOutlined />}>
              Thêm mới vật tư bằng file Excel
          </Button>
          <Button   icon={<ImportOutlined />}>
              Cập nhật giá vật tư bằng file Excel
          </Button>
          <Button  onClick={refreshData}  type="default" icon={<ReloadOutlined />}>
              Refresh dữ liệu
          </Button>
        </Space>
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
              <Table columns={columns} dataSource={data} onChange={onChange}/>}
      </VStack>

      {/* Modal thêm mới */}
      <Modal 
        open={openModalContact}
        title={!editMode ? "Thêm mới vật tư" : "Cập nhật vật tư"}
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
            label="Nhóm vật tư: "
            name="MaNhomVatTu"
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn nhóm vật tư!'
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
            label="Mã vật tư: "
            name="MaVatTu"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mã vật tư!'
              },
            ]}
          >
          <Input  />
          </Form.Item>
          <Form.Item
            label="Tên vật tư: "
            name="TenVatTu"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên vật tư!'
              },
            ]}
          >
          <Input  />
          </Form.Item>
          <Form.Item
            label="Đơn vị tính: "
            name="Dvt"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập đơn vị tính!'
              },
            ]}
          >
          <Input  />
          </Form.Item>
          <Form.Item
            label="Giá bán:"
            name="GiaBan"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập giá bán!'
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
            <Button key="back" onClick={toogleModalFormContact}>Thoát</Button>
            <Button key="save" type="primary"  htmlType="submit">Lưu</Button>
          </HStack>
        </Form>
      </Modal>

      {/* Modal thêm mới bằng file excel */}
      <Modal 
        open={openModalImportVatTu}
        title={"Thêm mới vật tư bằng file Excel"}
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
            label="Chọn file"
          >
            <input type="file" name="file" className="custom-file-input" id="inputGroupFile" required onChange={handleImportVatTu}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
            <label className="custom-file-label" htmlFor="inputGroupFile">Chọn file import</label>           
            
          </Form.Item>
          <Tabs
            defaultActiveKey="1"
            onChange={onChange}
            items={[
              {
                label: `Dữ liệu import`,
                key: '1',
                children: (<>
                  <Table columns={columnsImportVatTu} dataSource={dataImportVatTu} />
                </>),
              },
              {
                label: `Lỗi`,
                key: '2',
                children: (<>
                  <Table columns={columnsImportVatTu} dataSource={dataCheckNhomVatTu} />
                </>),
              }
            ]}
          />
          
        </Form>
        
        <HStack justifyContent="end">
            <Button key="back" onClick={toogleModalFormImportVatTu}>Thoát</Button>
            <Button key="save" type="primary"  onClick={importVatTu}>Import vật tư mới</Button>
          </HStack>
      </Modal>
    </>
  )
}

export default VatTu;