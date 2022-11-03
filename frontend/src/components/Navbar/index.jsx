import React, {useState, useEffect} from "react";
import {Text} from '@chakra-ui/react'
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";
import {
  ContainerOutlined,
  PicRightOutlined,
  AppstoreOutlined,
  SettingOutlined,
  HomeOutlined,
  BarChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import { Divider, Layout, Menu } from 'antd';
import styles from './index.module.css'

const {Sider } = Layout;
const rootSubmenuKeys = ['dashboard', 'danhmuc', 'quanlynhap','quanlyxuat', 'baocao', 'quantri', 'caidat'];

const Navbar = (props) =>{
  const {collapsed} = props
  const [role, setRole] = useState('user')
  const [openKeys, setOpenKeys] = useState(['dashboard']);

  useEffect(()=>{
    setRole(window.localStorage.getItem('rolesTracuu'))
    }, []);

  function logout(){
    const isRememberMe = window.localStorage.getItem('rememberTracuu')
    if (isRememberMe === 'true') {
      window.localStorage.removeItem('passwordTracuu')
      window.localStorage.removeItem('emailTracuu')
      window.localStorage.removeItem('fullNameTracuu')
      window.localStorage.removeItem('emailTracuu')
      window.localStorage.removeItem('rTokenTracuu')
      window.localStorage.removeItem('rolesTracuu')
    } else {
      window.localStorage.clear()
    }
  }

  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }

  function onOpenChange(keys){
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const items = [
    getItem(<Link to={'/'}>Dashboard</Link>, 'dashboard', <AppstoreOutlined />),
    getItem(<Link to ={'/tondauky'}>Tồn kho vật tư đầu kỳ</Link>, 'tondauky', <HomeOutlined />),
    getItem('Danh mục', 'danhmuc', <PicRightOutlined />, [
      getItem(<Link to={'/kichthuoc'}>Kích thước</Link>, 'hocky'),
      getItem(<Link to={'/nhomdoituong'}>Nhóm đối tượng</Link>, 'nhomdoituong'),
      getItem(<Link to={'/doituong'}>Đối tượng</Link>, 'doituong'), 
      getItem(<Link to={'/nhomvattu'}>Nhóm vật tư</Link>, 'loaisach'), 
      getItem(<Link to={'/vattu'}>Vật tư</Link>, 'sach'), 
      getItem(<Link to={'/nhanvien'}>Nhân viên</Link>, 'nhanvien'), 
      getItem(<Link to={'/kho'}>Kho</Link>, 'coso'), 
    ]),
    getItem('Quản lý nhập', 'quanlynhap', <ContainerOutlined />, [
      getItem(<Link to={'/phieunhap?type=nhapmua'}>Nhập mua</Link>, 'phieunhapmua'),
      // getItem(<Link to={'/phieunhap?type=nhapin'}>Nhập In-Photo</Link>, 'phieunhapin'),
      // getItem(<Link to={'/phieunhap?type=nhapcoso'}>Nhập cơ sở thư viện</Link>, 'phieunhapcoso'),
      // getItem(<Link to={'/phieunhap?type=nhapphongban'}>Nhập từ phòng ban</Link>, 'phieunhapphongban'),
    ]),
    getItem('Quản lý xuất', 'quanlyxuat', <ContainerOutlined />, [
      getItem(<Link to={'/phieuxuat?type=xuatban'}>Xuất bán</Link>, 'xuatcoso'),
      // getItem(<Link to={'/phieuxuat?type=xuatphathanh'}>Xuất phát hành</Link>, 'xuatphathanh'),
      // getItem(<Link to={'/phieuxuat?type=xuatkygui'}>Xuất ký gửi</Link>, 'xuatkygui'),
      // getItem(<Link to={'/phieuxuat?type=xuattang'}>Xuất tặng</Link>, 'xuattang'),
      // getItem(<Link to={'/phieuxuat?type=xuatthanhly'}>Xuất thanh lý</Link>, 'xuatthanhly'),
      // getItem(<Link to={'/phieuxuat?type=xuattrain'}>Xuất trả nhà In-Photo</Link>, 'xuattra'),
      // getItem(<Link to={'/phieuxuat?type=xuatphongban'}>Xuất phòng ban</Link>, 'xuatphongban'),
      // getItem(<Link to={'/phieuxuat?type=xuatmat'}>Xuất mất</Link>, 'xuatmat'),
      // getItem(<Link to={'/phieuxuat?type=xuatkhac'}>Xuất khác</Link>, 'xuatkhac'),
    ]),
    getItem('Báo cáo-Thống kê', 'baocao', <PieChartOutlined />, [
      getItem(<Link to={'/bangkenhap'}>Bảng kê nhập</Link>, 'bangkenhap'),
      getItem(<Link to={'/bangkexuat'}>Bảng kê xuất</Link>, 'bangkexuat'),
      getItem(<Link to={'/baocao-nhapxuatton'}>Báo cáo Nhập-Xuất-Tồn</Link>, 'baocao-nhapxuatton'),
      getItem(<Link to={'/baocao-phanphoichenhlech'}>Bảng phân phối chênh lệch</Link>, 'baocao-phanphoichenhlech'),
    ]),
    getItem('Quản trị', 'quantri', <BarChartOutlined />, [
      getItem(<Link to={'/member'}>Người dùng</Link>, 'member'),
      getItem(<Link to={'/permission'}>Phân quyền</Link>, 'permission'),
    ]), 
    getItem('Cài đặt', 'caidat', <SettingOutlined />, [
      getItem(<Link to={'/profile'}>Tài khoản</Link>, 'profile'),
      getItem(<Link to={'/logout'}>Đăng xuất</Link>, '6'), 
    ]), 
  ];

  return(
    <Sider width={'30vh'} trigger={null} collapsible collapsed={collapsed}>
      {/* <div className={styles.logo}>
        Trung tâm học liệu
      </div> */}
      <Menu
        theme="dark"
        mode="inline"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        defaultSelectedKeys = {['dashboard']}
        items={items}
      />
      <div className={styles.version}>
        {/* <Text>Version: 1.0.0</Text> */}
        <Divider/>
        {/* <Link href={'/help'}><a onClick={() => router.push('/help') }>Hướng dẫn sử dụng</a></Link> */}
      </div>
  </Sider>
  )
}

export default Navbar