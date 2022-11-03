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
import NhomVatTu from './containers/List/NhomVatTu';
import Kho from './containers/List/Kho';
import KichThuoc from './containers/List/KichThuoc';
import DoiTuong from './containers/List/DoiTuong';
import VatTu from './containers/List/VatTu';
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
          <Route path='nhomvattu' element ={<LayoutApp component ={<NhomVatTu />} />}/>
          <Route path='kho' element ={<LayoutApp component ={<Kho />} />}/>
          <Route path='kichthuoc' element ={<LayoutApp component ={<KichThuoc />} />}/>
          <Route path='doituong' element ={<LayoutApp component ={<DoiTuong />} />}/>
          <Route path='vattu' element ={<LayoutApp component ={<VatTu />} />}/>
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
