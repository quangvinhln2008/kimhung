const {sql, poolPromise } = require('../config/db.js')
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");

async function create(req, res) {
  try{
    const MaNhomDoiTuong = uuidv4()
    const TenNhomDoiTuong = req.body.TenNhomDoiTuong

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
    .input('MaNhomDoiTuong', MaNhomDoiTuong)
    .input('TenNhomDoiTuong', TenNhomDoiTuong)
    .execute('sp_CreateNhomDoiTuong', (err, result)=>{
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
      const TenNhomDoiTuong = req.body.TenNhomDoiTuong
      const Is_Deleted = req.body.Is_Deleted

      const pool = await poolPromise
      await pool.request()
      .input('MaNhomDoiTuong', id)
      .input('TenNhomDoiTuong', TenNhomDoiTuong)
      .input('Is_Deleted', Is_Deleted)
      .execute('sp_UpdateNhomDoiTuong', (err, result)=>{
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

async function deleteNhomDt(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('MaNhomDoiTuong', id)
      .execute('sp_DeleteNhomDoiTuong', (err, result)=>{
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
async function getNhomDt(req, res) {
  try{
      const pool = await poolPromise
      await pool.request()
      .execute('sp_GetNhomDoiTuong', (err, result)=>{
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

async function getNhomDtById(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('MaNhomDoiTuong', id)
      .execute('sp_GetNhomDoiTuongById', (err, result)=>{
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
  deleteNhomDt,
  getNhomDtById,
  getNhomDt
}