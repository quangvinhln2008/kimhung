const {sql, poolPromise } = require('../config/db.js')
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");
const moment = require("moment")

async function create(req, res) {
  try{
    const MaHocKy = uuidv4()
    const TenHocKy = req.body.TenHocKy
    const TuNgay = req.body.TuNgay
    const DenNgay = req.body.DenNgay

    // //Check authorized
    // var roles
    // jwt.verify(token, 'tracuu', (err, decoded) => {
    //   if (err) {
    //     return res.status(401).send({ message: "Unauthorized!" });
    //   }
    //   roles = decoded.roles;
    // });
    
    // if(roles.toLowerCase().trim() === 'user'){
    //   return res.status(500).send({
    //     message: 'Không có quyền truy cập!'
    //   })
    // } 

    const pool = await poolPromise
    await pool.request()
    .input('MaHocKy', MaHocKy)
    .input('TenHocKy', TenHocKy)
    .input('TuNgay', TuNgay)
    .input('DenNgay', DenNgay)
    .execute('sp_CreateHocKy', (err, result)=>{
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

async function update(req, res) {
  try{
      const {id} = req.params
      const TenHocKy = req.body.TenHocKy
    const TuNgay = req.body.TuNgay
    const DenNgay = req.body.DenNgay

      const pool = await poolPromise
      await pool.request()
      .input('MaHocKy', id)
      .input('TenHocKy', TenHocKy)
      .input('TuNgay', TuNgay)
      .input('DenNgay', DenNgay)
      .execute('sp_UpdateHocKy', (err, result)=>{
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

async function deleteHocKy(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('MaHocKy', id)
      .execute('sp_DeleteHocKy', (err, result)=>{
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
async function getHocKy(req, res) {
  try{
      const pool = await poolPromise
      await pool.request()
      .execute('sp_GetHocKy', (err, result)=>{
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

function responseHocKyToFE(HocKy){
  console.log(HocKy)
  return{
    MaHocKy:HocKy.MaHocKy,
    TenHocKy:HocKy.TenHocKy,
    TuNgay: moment(HocKy.TuNgay).format("YYYY-MM-DD"),
    DenNgay: moment(HocKy.DenNgay).format("YYYY-MM-DD")
  }
}
async function getHocKyById(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('MaHocKy', id)
      .execute('sp_GetHocKyById', (err, result)=>{
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
  create,
  update,
  deleteHocKy,
  getHocKyById,
  getHocKy
}