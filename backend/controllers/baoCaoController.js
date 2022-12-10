const {sql, poolPromise } = require('../config/db.js')
const { jwtConfig } = require('../config/vars')
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");
const moment = require("moment")

getTokenFromHeaders = (req, res) => {
  const { headers: { authorization } } = req;

  if(authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1];
  }
  return null;
};


async function bangKeNhap(req, res) {
  try{
      const NgayCt0 = req.body.NgayCt0
      const NgayCt1 = req.body.NgayCt1
      const MaDoiTuong = req.body.MaDoiTuong
      const MaVatTu = req.body.MaVatTu

      const pool = await poolPromise
      
      await pool.request()
      .input('LoaiCt', '1')
      .input('Ngay_Ct1', NgayCt0)
      .input('Ngay_Ct2', NgayCt1)
      .input('MaDoiTuong', MaDoiTuong)
      .input('MaVatTu', MaVatTu)
      .execute('sp_rptTKC01', (err, result)=>{
        if (err) {
            res.status(500).send({ message: err });
            return;
          }

          return res.status(200).send({
            result
          });
    })
  }catch(error){
    res.status(500).send(error.message)
  }
}

async function getList(req, res) {
  try{

      const pool = await poolPromise
      
      await pool.request()
      .execute('sp_GetFilterReport', (err, result)=>{
        if (err) {
            res.status(500).send({ message: err });
            return;
          }

          return res.status(200).send({
            result
          });
    })
  }catch(error){
    res.status(500).send(error.message)
  }
}


module.exports = {
  bangKeNhap,
  getList
}