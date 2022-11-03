const {sql, poolPromise } = require('../config/db.js')
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");

async function create(req, res) {
  try{
    const MaSach = uuidv4()
    const TenSach = req.body.TenSach
    const MaDoiTuong = req.body.MaDoiTuong
    const NamXuatBan = req.body.NamXuatBan
    const DienGiaiSach = req.body.DienGiaiSach
    const Barcode = req.body.Barcode
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
    .input('MaSach', MaSach)
    .input('TenSach', TenSach)
    .input('MaDoiTuong', MaDoiTuong)
    .input('NamXuatBan', NamXuatBan)
    .input('DienGiaiSach', DienGiaiSach)
    .input('Barcode', Barcode)
    .input('GiaBan', GiaBan)
    .execute('sp_CreateSach', (err, result)=>{
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
      const TenSach = req.body.TenSach
      const MaDoiTuong = req.body.MaDoiTuong
      const NamXuatBan = req.body.NamXuatBan
      const DienGiaiSach = req.body.DienGiaiSach
      const Barcode = req.body.Barcode
      const GiaBan = req.body.GiaBan

      const pool = await poolPromise
      await pool.request()
      .input('MaSach', id)
      .input('TenSach', TenSach)
      .input('MaDoiTuong', MaDoiTuong)
      .input('NamXuatBan', NamXuatBan)
      .input('DienGiaiSach', DienGiaiSach)
      .input('Barcode', Barcode)
      .input('GiaBan', GiaBan)
      .execute('sp_UpdateSach', (err, result)=>{
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

async function deleteSach(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('MaSach', id)
      .execute('sp_DeleteSach', (err, result)=>{
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
async function getSach(req, res) {
  try{
      const pool = await poolPromise
      await pool.request()
      .execute('sp_GetSach', (err, result)=>{
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

async function getSachById(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('MaSach', id)
      .execute('sp_GetSachById', (err, result)=>{
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
  deleteSach,
  getSachById,
  getSach
}