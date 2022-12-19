import React,  { useEffect, useState } from "react";

const TablePrint = (props) =>{
  const dataChiTiet = props.dataChiTiet
  console.log('datachitiet', dataChiTiet)
  return(
    <>
    {dataChiTiet?.map((item, index) => {
      return (
        <tr key={item.Stt}>
            <td style={{border: '1px solid #000', width: '50px',fontSize:'13pt', fontWeight:'700', padding: '0px 5px', textAlign:'center'}} >{item?.Stt}</td>
            <td style={{border: '1px solid #000', width: '250px', fontSize:'13pt', fontWeight:'700', padding: '0px 5px' ,wordWrap: 'break-word'}}>{item?.TenVatTu}</td>
            <td style={{border: '1px solid #000', width: '100px',fontSize:'13pt', fontWeight:'700', padding: '0px 5px', textAlign:'center'}}>{item?.Dvt}</td>
            <td style={{border: '1px solid #000', width: '100px',fontSize:'13pt', fontWeight:'700', padding: '0px 5px', textAlign:'center'}}>{item?.SoLuongXuat}</td>
            <td style={{border: '1px solid #000', width: '100px',fontSize:'13pt', fontWeight:'700', padding: '0px 5px', textAlign:'right'}}>{item?.DonGiaXuat}</td>
            <td style={{border: '1px solid #000', width: '150px',fontSize:'13pt', fontWeight:'700', padding: '0px 5px', textAlign:'right'}}>{item?.ThanhTienXuat}</td>
          </tr>
      );
    })}        
        
    </>
  )
}
export default TablePrint;