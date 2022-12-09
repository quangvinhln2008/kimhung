const {sql, poolPromise } = require('../config/db.js')
const { jwtConfig } = require('../config/vars')
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");
const moment = require("moment")

getTokenFromHeaders = (req, res) => {
  const { headers: { authorization } } = req;

  if(authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1];
  }
  return null;
};


async function create(req, res) {
  try{
    const id = uuidv4()
    const Ident = req.body.Ident
    const NgayCt = req.body.NgayCt
    const MaCt = req.body.MaCt
    const LoaiCt = req.body.LoaiCt
    const SoCt = req.body.SoCt
    const MaNhanVien = req.body.MaNhanVien
    const MaVatTu = req.body.MaVatTu
    const MaKho = req.body.MaKho
    const MaDoiTuong = req.body.MaDoiTuong
    const DienGiai = req.body.DienGiai
    const ctPhieuXuat = req.body.ctPhieuXuat
    const CreatedBy = req.body.MaNhanVien
    const CreatedDate = moment().format()
    
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
    const ctPhieuXuatTable = new sql.Table()
    ctPhieuXuatTable.columns.add('MaVatTu', sql.VarChar(50));
    ctPhieuXuatTable.columns.add('SoLuongXuat', sql.Money);
    ctPhieuXuatTable.columns.add('DonGiaXuat', sql.Money);

    ctPhieuXuat.forEach(detail => {
      ctPhieuXuatTable.rows.add(
        detail.MaVatTu,
        detail.SoLuongXuat,
        detail.DonGiaXuat
      )
  });

    await pool.request()
    .input('Id', id)
    .input('Ident', Ident)
    .input('NgayCt', NgayCt)
    .input('MaCt', MaCt)
    .input('LoaiCt', LoaiCt)
    .input('SoCt', SoCt)
    .input('MaNhanVien', MaNhanVien)
    .input('MaCoSo', MaCoSo)
    .input('MaDoiTuong', MaDoiTuong)
    .input('DienGiai', DienGiai)
    .input('ctPhieuXuat', ctPhieuXuatTable)
    .input('CreatedBy', CreatedBy)
    .input('CreatedDate', CreatedDate)
    .execute('sp_CreatePhieuXuat', (err, result)=>{
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
      const MaCt = req.body.MaCt
      const SoCt = req.body.SoCt
      const LoaiCt = req.body.LoaiCt
      const MaNhanVien = req.body.MaNhanVien
      const MaKho = req.body.MaKho
      const MaDoiTuong = req.body.MaDoiTuong
      const DienGiai = req.body.DienGiai      
      const ctPhieuXuat = req.body.ctPhieuXuat      
      const CreatedBy = req.body.MaNhanVien
      const CreatedDate = moment().format()

      const pool = await poolPromise
      const ctPhieuXuatTable = new sql.Table()
      ctPhieuXuatTable.columns.add('MaVatTu', sql.VarChar(50));
      ctPhieuXuatTable.columns.add('SoLuongXuat', sql.Money);
      ctPhieuXuatTable.columns.add('DonGiaXuat', sql.Money);
console.log('ngayct', NgayCt)
      ctPhieuXuat.forEach(detail => {
        ctPhieuXuatTable.rows.add(
          detail.MaVatTu,
          detail.SoLuongXuat,
          detail.DonGiaXuat
        )
    });
    
      await pool.request()
      .input('Ident', id)
      .input('NgayCt', NgayCt)
      .input('MaCt', MaCt)
      .input('LoaiCt', LoaiCt)
      .input('SoCt', SoCt)
      .input('MaNhanVien', MaNhanVien)
      .input('MaKho', MaKho)
      .input('MaDoiTuong', MaDoiTuong)
      .input('DienGiai', DienGiai)
      .input('ctPhieuXuat', ctPhieuXuatTable)
      .input('CreatedBy', CreatedBy)
      .input('CreatedDate', CreatedDate)
      .execute('sp_UpdatePhieuXuat', (err, result)=>{
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

async function deletePhieuXuat(req, res) {
  try{
    const {id} = req.params
     
    const DeletedBy = req.body.MaNhanVien
    const DeletedDate = moment().format()

      const pool = await poolPromise
      await pool.request()
      .input('Id', id)
      .input('DeletedBy', DeletedBy)
      .input('DeletedDate', DeletedDate)
      .execute('sp_DeletedPhieuXuat', (err, result)=>{
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

function getMaCt (type)
  {
    switch (type.toLowerCase()) {
      case 'xuatban':
        return "XB";
      case 'xuatphathanh':
        return "XPH";
      case 'xuatkygui':
         return "XKG";
      case 'xuattang':
        return "XT";
      case 'xuatthanhly':
        return "XTL";
      case 'xuattrain':
          return "XTI";
      case 'xuatphongban':
        return "XPB";
      case 'xuatmat':
        return "XM";
      case 'xuatkhac':
        return "XK";
      default: 
        return ''
    }
  }

async function getPhieuXuat(req, res) {
  
  var token
  const { headers: { authorization } } = req;

  if(authorization && authorization.split(' ')[0] === 'Bearer') {
    token = authorization.split(' ')[1];
  }else{
    token = null
  }

   const type = req.query.type
   const maCt = getMaCt(type)

   //Check authorized
    var roles
    var manv

    jwt.verify(token, jwtConfig.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      roles = decoded.roles
      manv = decoded.manv
    });

  try{
      const pool = await poolPromise
      await pool.request()
      .input('MaCt', maCt)
      .input('MaNhanVien', manv)
      .execute('sp_GetPhieuXuat', (err, result)=>{
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

async function getPhieuXuatById(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('Id', id)
      .execute('sp_GetPhieuXuatById', (err, result)=>{
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
async function printPhieuXuatById(req, res) {
  try{
    const {id} = req.params
      const pool = await poolPromise
      await pool.request()
      .input('Id', id)
      .execute('sp_GetPhieuXuatPrintById', (err, result)=>{
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
  deletePhieuXuat,
  getPhieuXuatById,
  getPhieuXuat,
  printPhieuXuatById
}