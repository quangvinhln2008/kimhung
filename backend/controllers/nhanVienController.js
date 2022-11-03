const {sql, poolPromise } = require('../config/db.js')
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");

async function creKichThuocate(req, res) {
  try{
    const MaNhanVien = req.body.MaNhanVien
    const TenNhanVien = req.body.TenNhanVien
    const MaKho = req.body.MaKho
    const TenDangNhap = req.body.TenDangNhap
    const MatKhauDangNhap = req.body.MatKhauDangNhap
    const Role = req.body.Role
    
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
    .input('MaNhanVien', MaNhanVien)
    .input('TenNhanVien', TenNhanVien)
    .input('MaKho', MaKho)
    .input('TenDangNhap', TenDangNhap)
    .input('MatKhauDangNhap', MatKhauDangNhap)
    .input('Role', Role)
    .execute('sp_CreateNhanVien', (err, result)=>{
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
      const TenNhanVien = req.body.TenNhanVien
      const MaKho = req.body.MaKho
      const TenDangNhap = req.body.TenDangNhap
      const MatKhauDangNhap = req.body.MatKhauDangNhap
      const Role = req.body.Role

      const pool = await poolPromise
      await pool.request()
      .input('MaNhanVien', id)
      .input('TenNhanVien', TenNhanVien)
      .input('MaKho', MaKho)
      .input('TenDangNhap', TenDangNhap)
      .input('MatKhauDangNhap', MatKhauDangNhap)
      .input('Role', Role)
      .execute('sp_UpdateNhanVien', (err, result)=>{
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

async function deleteNhanVien(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('MaNhanVien', id)
      .execute('sp_DeleteNhanVien', (err, result)=>{
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
async function getNhanVien(req, res) {
  try{
      const pool = await poolPromise
      await pool.request()
      .execute('sp_GetNhanVien', (err, result)=>{
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

async function getNhanVienById(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('MaNhanVien', id)
      .execute('sp_GetNhanVienById', (err, result)=>{
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
  deleteNhanVien,
  getNhanVienById,
  getNhanVien
}