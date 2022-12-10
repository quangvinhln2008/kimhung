import React, {Component, useEffect, useState} from 'react'
import {
  useNavigate
} from "react-router-dom";

import { useCookies } from 'react-cookie';

import { Button, Result, Spin } from 'antd';
import HeaderApp from '../Header'
import Navbar from "../Navbar";
import Footer from "../Footer";

import Dashboard from '../../containers/Dashboard';
import NhomDoiTuong from '../../containers/List/NhomDoiTuong';

import { Layout } from 'antd';

const { Header, Content } = Layout;

const LayoutApp = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isLogin, setIsLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const [cookies, setCookie] = useCookies(['user']);
  const navigate = useNavigate();

  useEffect(()=>{
    
    setTimeout(() => {
      setIsLogin(cookies?.TenNhanVien !== undefined ? true : false)
      setIsLoading(false)
      }, 1000);
    }, []);

  function toogleMenu(){
    setCollapsed(!collapsed)
  }
  if(!isLogin){
    return (
      <div>        
        {isLoading && <>
          <Spin  size="large"/>
          <Result
            status="success"
            title= {'Kiểm tra tình trạng đăng nhập'}            
          />
        </>}
        {!isLoading && <Result
          status="403"
          title=""
          subTitle="Phiên đăng nhập đã hết. Vui lòng đăng nhập lại"
          extra={<Button onClick={()=>navigate('/login')} type="primary">Đăng nhập</Button>}
        /> }
      </div>
    )} 
  return (
    <>
    {isLoading ? <Spin  size="large"/> :
      <Layout style={{height: "100%"}} >
      <Navbar collapsed ={collapsed} />
      <Layout className="site-layout" style={{width: "auto", minHeight:"667px"}} >
          <HeaderApp collapsed = {collapsed} onClickHandle = {toogleMenu} />
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 20,
              minHeight: 280,
              background:'#fff'
            }}
          >
            {props.component}
          </Content>
        <Footer />
      </Layout>
      </Layout>
      }
    </>
      
  );
}

export default LayoutApp;