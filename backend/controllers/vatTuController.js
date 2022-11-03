const {sql, poolPromise } = require('../config/db.js')
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");

async function create(req, res) {
  try{
    const id = uuidv4()
    const MaVatTu = req.body.MaVatTu
    const TenVatTu = req.body.TenVatTu
    const MaNhomVatTu = req.body.MaNhomVatTu
    const GiaBan = req.body.GiaBan
    
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
    .input('MaVatTu', MaVatTu)
    .input('TenVatTu', TenVatTu)
    .input('MaNhomVatTu', MaNhomVatTu)
    .input('GiaBan', GiaBan)
    .execute('sp_CreateVatTu', (err, result)=>{
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
      const MaVatTu = req.body.MaVatTu
      const TenVatTu = req.body.TenVatTu
      const MaNhomVatTu = req.body.MaNhomVatTu
      const NamXuatBan = req.body.NamXuatBan
      const DienGiaiVatTu = req.body.DienGiaiVatTu
      const Barcode = req.body.Barcode
      const GiaBan = req.body.GiaBan

      const pool = await poolPromise
      await pool.request()
      .input('id', id)
      .input('MaVatTu', MaVatTu)
      .input('TenVatTu', TenVatTu)
      .input('MaNhomVatTu', MaNhomVatTu)
      .input('GiaBan', GiaBan)
      .execute('sp_UpdateVatTu', (err, result)=>{
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

async function deleteVatTu(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('id', id)
      .execute('sp_DeleteVatTu', (err, result)=>{
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
async function getVatTu(req, res) {
  try{
      const pool = await poolPromise
      await pool.request()
      .execute('sp_GetVatTu', (err, result)=>{
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

async function getVatTuById(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('id', id)
      .execute('sp_GetVatTuById', (err, result)=>{
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
  deleteVatTu,
  getVatTuById,
  getVatTu
}