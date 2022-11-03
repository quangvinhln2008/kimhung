const {sql, poolPromise } = require('../config/db.js')
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");

async function create(req, res) {
  try{
    const MaCoSo = uuidv4()
    const TenCoSo = req.body.TenCoSo
    const DiaChiCoSo = req.body.DiaChiCoSo
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
    .input('MaCoSo', MaCoSo)
    .input('TenCoSo', TenCoSo)
    .input('DiaChiCoSo', DiaChiCoSo)
    .execute('sp_CreateCoSo', (err, result)=>{
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
      const TenCoSo = req.body.TenCoSo
      const DiaChiCoSo = req.body.DiaChiCoSo

      const pool = await poolPromise
      await pool.request()
      .input('MaCoSo', id)
      .input('TenCoSo', TenCoSo)
      .input('DiaChiCoSo', DiaChiCoSo)
      .execute('sp_UpdateCoSo', (err, result)=>{
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

async function deleteCoSo(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('MaCoSo', id)
      .execute('sp_DeleteCoSo', (err, result)=>{
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
async function getCoSo(req, res) {
  try{
      const pool = await poolPromise
      await pool.request()
      .execute('sp_GetCoSo', (err, result)=>{
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

async function getCoSoById(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('MaCoSo', id)
      .execute('sp_GetCoSoById', (err, result)=>{
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
  deleteCoSo,
  getCoSoById,
  getCoSo
}