import React,  { useEffect, useState } from "react";

import {useSearchParams, setSearchParams, useNavigate} from "react-router-dom";

import { useCookies } from 'react-cookie';

import { Divider, Typography, Spin, Result, Button } from 'antd';

const { Title } = Typography;

const Dashboard = () =>{
  
  const [isLogin, setIsLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [title, setTitle] = useState('Đang tải dữ liệu.....')
  const [cookies, setCookie] = useCookies(['user']);
  const navigate = useNavigate();

  useEffect(()=>{
    setTimeout(() => {
      setIsLogin(cookies?.TenNhanVien !== undefined ? true : false)
      setTitle('Kiểm tra tình trạng đăng nhập')
      setIsLoading(false)
      }, 1000);
    }, []);
    
  function navigateLoginPage(){
    navigate(`/login`)
  }

  if(!isLogin){
    return (
      <div>        
        {isLoading && <>
          <Spin  size="large"/>
          <Result
            status="success"
            title= {title}            
          />
        </>}
        {!isLoading && <Result
          status="403"
          title=""
          subTitle="Phiên đăng nhập đã hết. Vui lòng đăng nhập lại"
          extra={<Button onClick={()=>navigateLoginPage()} type="primary">Đăng nhập</Button>}
        /> }
      </div>
    )} 
    return(
      <>        
         <Title level={3}>Dashboard</Title>
          <Divider />
      </>
    )

  // return(
  //   <>
  //     <Title level={3}>Dashboard</Title>
  //     <Divider />
  //   </>
  // )
}

export default Dashboard;