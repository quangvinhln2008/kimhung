const {sql, poolPromise } = require('../config/db.js')
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");

async function create(req, res) {
  try{
    const MaLoaiHinhSach = uuidv4()
    const TenLoaiHinhSach = req.body.TenLoaiHinhSach

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
    .input('MaLoaiHinhSach', MaLoaiHinhSach)
    .input('TenLoaiHinhSach', TenLoaiHinhSach)
    .execute('sp_CreateLoaiHinhSach', (err, result)=>{
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
      const TenLoaiHinhSach = req.body.TenLoaiHinhSach

      const pool = await poolPromise
      await pool.request()
      .input('MaLoaiHinhSach', id)
      .input('TenLoaiHinhSach', TenLoaiHinhSach)
      .execute('sp_UpdateLoaiHinhSach', (err, result)=>{
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

async function deleteLoaiHinhSach(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('MaLoaiHinhSach', id)
      .execute('sp_DeleteLoaiHinhSach', (err, result)=>{
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
async function getLoaiHinhSach(req, res) {
  try{
      const pool = await poolPromise
      await pool.request()
      .execute('sp_GetLoaiHinhSach', (err, result)=>{
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

async function getLoaiHinhSachById(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('MaLoaiHinhSach', id)
      .execute('sp_GetLoaiHinhSachById', (err, result)=>{
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
  deleteLoaiHinhSach,
  getLoaiHinhSachById,
  getLoaiHinhSach
}