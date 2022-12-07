const {sql, poolPromise } = require('../config/db.js')
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");

async function create(req, res) {
  try{
    const id = uuidv4()
    const NgayCt = req.body.NgayCt
    const MaVatTu = req.body.MaVatTu
    const MaKho = req.body.MaKho
    const SoLuongTon = req.body.SoLuongTon
    const DonGiaTon = req.body.DonGiaTon
    
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
    .input('Id', id)
    .input('NgayCt', NgayCt)
    .input('MaKho', MaKho)
    .input('MaVatTu', MaVatTu)
    .input('SoLuongTon', SoLuongTon)
    .input('DonGiaTon', DonGiaTon)
    .execute('sp_CreateTonDauKy', (err, result)=>{
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
      const NgayCt = req.body.NgayCt
      const MaVatTu = req.body.MaVatTu
      const MaKho = req.body.MaKho
      const SoLuongTon = req.body.SoLuongTon
      const DonGiaTon = req.body.DonGiaTon

      const pool = await poolPromise
      await pool.request()
      .input('Id', id)
      .input('NgayCt', NgayCt)
      .input('MaKho', MaKho)
      .input('MaVatTu', MaVatTu)
      .input('SoLuongTon', SoLuongTon)
      .input('DonGiaTon', DonGiaTon)
      .execute('sp_UpdateTonDauKy', (err, result)=>{
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

async function deleteTonDauKy(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('Id', id)
      .execute('sp_DeleteTonDauKy', (err, result)=>{
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
async function getTonDauKy(req, res) {
  try{
      const pool = await poolPromise
      await pool.request()
      .execute('sp_GetTonDauKy', (err, result)=>{
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

async function getTonDauKyById(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('Id', id)
      .execute('sp_GetTonDauKyById', (err, result)=>{
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
  deleteTonDauKy,
  getTonDauKyById,
  getTonDauKy
}