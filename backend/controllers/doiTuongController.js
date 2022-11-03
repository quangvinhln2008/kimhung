const {sql, poolPromise } = require('../config/db.js')
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");

async function create(req, res) {
  try{
    const MaDoiTuong = uuidv4()
    const TenDoiTuong = req.body.TenDoiTuong
    const MaNhomDoiTuong = req.body.MaNhomDoiTuong
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
    .input('MaDoiTuong', MaDoiTuong)
    .input('TenDoiTuong', TenDoiTuong)
    .input('MaNhomDoiTuong', MaNhomDoiTuong)
    .execute('sp_CreateDoiTuong', (err, result)=>{
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
      const TenDoiTuong = req.body.TenDoiTuong
      const MaNhomDoiTuong = req.body.MaNhomDoiTuong

      const pool = await poolPromise
      await pool.request()
      .input('MaDoiTuong', id)
      .input('TenDoiTuong', TenDoiTuong)
      .input('MaNhomDoiTuong', MaNhomDoiTuong)
      .execute('sp_UpdateDoiTuong', (err, result)=>{
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

async function deleteDoiTuong(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('MaDoiTuong', id)
      .execute('sp_DeleteDoiTuong', (err, result)=>{
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
async function getDoiTuong(req, res) {
  try{
      const pool = await poolPromise
      await pool.request()
      .execute('sp_GetDoiTuong', (err, result)=>{
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

async function getDoiTuongById(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('MaDoiTuong', id)
      .execute('sp_GetDoiTuongById', (err, result)=>{
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
  deleteDoiTuong,
  getDoiTuongById,
  getDoiTuong
}