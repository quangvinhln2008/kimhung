const {sql, poolPromise } = require('../config/db.js')
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");
const moment = require("moment")

async function create(req, res) {
  try{
    const id = uuidv4()
    const MaKichThuoc = req.body.MaKichThuoc
    const TenKichThuoc = req.body.TenKichThuoc

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
    .input('id', id)
    .input('MaKichThuoc', MaKichThuoc)
    .input('TenKichThuoc', TenKichThuoc)
    .execute('sp_CreateKichThuoc', (err, result)=>{
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
      const TenKichThuoc = req.body.TenKichThuoc
      const MaKichThuoc = req.body.MaKichThuoc

      const pool = await poolPromise
      await pool.request()
      .input('id', id)
      .input('MaKichThuoc', MaKichThuoc)
      .input('TenKichThuoc', TenKichThuoc)
      .execute('sp_UpdateKichThuoc', (err, result)=>{
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

async function deleteKichThuoc(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('id', id)
      .execute('sp_DeleteKichThuoc', (err, result)=>{
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
async function getKichThuoc(req, res) {
  try{
      const pool = await poolPromise
      await pool.request()
      .execute('sp_GetKichThuoc', (err, result)=>{
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

async function getKichThuocById(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('id', id)
      .execute('sp_GetKichThuocById', (err, result)=>{
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
  deleteKichThuoc,
  getKichThuocById,
  getKichThuoc
}