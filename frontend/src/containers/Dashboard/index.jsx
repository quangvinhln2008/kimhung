import React,  { useEffect, useState } from "react";

import {useSearchParams, setSearchParams, useNavigate} from "react-router-dom";

import { useCookies } from 'react-cookie';

import { Divider, Typography, Spin } from 'antd';

const { Title } = Typography;

const Dashboard = () =>{
  
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

  function navigateLoginPage(){
    navigate(`/login`)
  }

  if(!isLogin){
    return (
      <div>        
        {isLoading && <Spin  size="large"/>}
        {navigateLoginPage()}
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