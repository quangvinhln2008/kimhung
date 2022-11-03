const {sql, poolPromise } = require('../config/db.js')
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");

async function create(req, res) {
  try{
    const id = uuidv4()
    const MaKho = req.body.MaKho
    const TenKho = req.body.TenKho
    const DiaChiKho = req.body.DiaChiKho
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
    .input('MaKho', MaKho)
    .input('TenKho', TenKho)
    .input('DiaChiKho', DiaChiKho)
    .execute('sp_CreateKho', (err, result)=>{
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
      const MaKho = req.body.MaKho
      const TenKho = req.body.TenKho
      const DiaChiKho = req.body.DiaChiKho

      const pool = await poolPromise
      await pool.request()
      .input('id', id)
      .input('MaKho', MaKho)
      .input('TenKho', TenKho)
      .input('DiaChiKho', DiaChiKho)
      .execute('sp_UpdateKho', (err, result)=>{
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

async function deleteKho(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('MaKho', id)
      .execute('sp_DeleteKho', (err, result)=>{
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
async function getKho(req, res) {
  try{
      const pool = await poolPromise
      await pool.request()
      .execute('sp_GetKho', (err, result)=>{
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

async function getKhoById(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('id', id)
      .execute('sp_GetKhoById', (err, result)=>{
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
  deleteKho,
  getKhoById,
  getKho
}