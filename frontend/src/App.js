import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@chakra-ui/react';
import 'antd/dist/antd.min.css';
import './styles/globals.css'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import RoutesApp from './routes';
import LayoutApp from './components/Layout';

import Login from './containers/Login';

import Dashboard from './containers/Dashboard';
import TonDauKy from './containers/TonDauKy';

import NhomDoiTuong from './containers/List/NhomDoiTuong';
import LoaiHinhSach from './containers/List/LoaiHinhSach';
import CoSo from './containers/List/CoSo';
import HocKy from './containers/List/HocKy';
import DoiTuong from './containers/List/DoiTuong';
import Sach from './containers/List/Sach';
import NhanVien from './containers/List/NhanVien';

import PhieuNhap from './containers/PhieuNhap';
import PhieuXuat from './containers/PhieuXuat';

const App = (props) => {
  
  console.log('RoutesApp',RoutesApp['admin'])
  return (
    <ChakraProvider theme={theme}>
      <Router>        
        <Routes>
        <Route path='/login' element ={<Login />}/>
          <Route path='/' element ={<LayoutApp component ={<Dashboard />} />}/>
          <Route path='nhomdoituong' element ={<LayoutApp component ={<NhomDoiTuong />} />}/>
          <Route path='loaisach' element ={<LayoutApp component ={<LoaiHinhSach />} />}/>
          <Route path='coso' element ={<LayoutApp component ={<CoSo />} />}/>
          <Route path='hocky' element ={<LayoutApp component ={<HocKy />} />}/>
          <Route path='doituong' element ={<LayoutApp component ={<DoiTuong />} />}/>
          <Route path='sach' element ={<LayoutApp component ={<Sach />} />}/>
          <Route path='nhanvien' element ={<LayoutApp component ={<NhanVien />} />}/>
          <Route path='tondauky' element ={<LayoutApp component ={<TonDauKy />} />}/>
          <Route path='phieunhap' element ={<LayoutApp component ={<PhieuNhap />} />} />
          <Route path='phieuxuat' element ={<LayoutApp component ={<PhieuXuat />} />} />
        {/* {RoutesApp['admin'].map((item) =>(
          <Route 
            key ={item.key}
            path = {item.key}
            element = {<LayoutApp component = {item.component} />}
            // render = {(props)=(
              
            //   <LayoutApp 
            //     component ={item.component}
            //     {...props}
            //   />
              
            // )}
          />
        ))
        } */}
        </Routes>
      </Router>
      <ToastContainer autoClose={1000} theme="colored" />
    </ChakraProvider>
  );
  
}

export default App;
