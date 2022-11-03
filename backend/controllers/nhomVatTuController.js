const {sql, poolPromise } = require('../config/db.js')
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");

async function create(req, res) {
  try{
    const id = uuidv4()
    const MaNhomVatTu = req.body.MaNhomVatTu
    const TenNhomVatTu = req.body.TenNhomVatTu

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
    .input('MaNhomVatTu', MaNhomVatTu)
    .input('TenNhomVatTu', TenNhomVatTu)
    .execute('sp_CreateNhomVt', (err, result)=>{
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
      const MaNhomVatTu = req.body.MaNhomVatTu
      const TenNhomVatTu = req.body.TenNhomVatTu

      const pool = await poolPromise
      await pool.request()
      .input('id', id)
      .input('MaNhomVatTu', MaNhomVatTu)
      .input('TenNhomVatTu', TenNhomVatTu)
      .execute('sp_UpdateNhomVt', (err, result)=>{
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

async function deleteNhomVatTu(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('id', id)
      .execute('sp_DeleteNhomVt', (err, result)=>{
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
async function getNhomVatTu(req, res) {
  try{
      const pool = await poolPromise
      await pool.request()
      .execute('sp_GetNhomVt', (err, result)=>{
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

async function getNhomVatTuById(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('id', id)
      .execute('sp_GetNhomVtById', (err, result)=>{
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
  deleteNhomVatTu,
  getNhomVatTuById,
  getNhomVatTu
}