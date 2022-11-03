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
    const MaSach = req.body.MaSach
    const MaLoaiHinhSach = req.body.MaLoaiHinhSach
    const MaCoSo = req.body.MaCoSo
    const MaDoiTuong = req.body.MaDoiTuong
    const HTThanhToan = req.body.HTThanhToan
    const DienGiai = req.body.DienGiai
    const ctPhieuNhap = req.body.ctPhieuNhap
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
    const ctPhieuNhapTable = new sql.Table()
    ctPhieuNhapTable.columns.add('MaSach', sql.VarChar(50));
    ctPhieuNhapTable.columns.add('SoLuongNhap', sql.Money);
    ctPhieuNhapTable.columns.add('DonGiaNhap', sql.Money);

    ctPhieuNhap.forEach(detail => {
      ctPhieuNhapTable.rows.add(
        detail.MaSach,
        detail.SoLuongNhap,
        detail.DonGiaNhap
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
    .input('MaLoaiHinhSach', MaLoaiHinhSach)
    .input('MaDoiTuong', MaDoiTuong)
    .input('HTThanhToan', HTThanhToan)
    .input('DienGiai', DienGiai)
    .input('ctPhieuNhap', ctPhieuNhapTable)
    .input('CreatedBy', CreatedBy)
    .input('CreatedDate', CreatedDate)
    .execute('sp_CreatePhieuNhap', (err, result)=>{
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
      const MaSach = req.body.MaSach
      const MaLoaiHinhSach = req.body.MaLoaiHinhSach
      const MaCoSo = req.body.MaCoSo
      const MaDoiTuong = req.body.MaDoiTuong
      const HTThanhToan = req.body.HTThanhToan
      const DienGiai = req.body.DienGiai      
      const ctPhieuNhap = req.body.ctPhieuNhap      
    const CreatedBy = req.body.MaNhanVien
    const CreatedDate = moment().format()

      const pool = await poolPromise
      const ctPhieuNhapTable = new sql.Table()
      ctPhieuNhapTable.columns.add('MaSach', sql.VarChar(50));
      ctPhieuNhapTable.columns.add('SoLuongNhap', sql.Money);
      ctPhieuNhapTable.columns.add('DonGiaNhap', sql.Money);

      ctPhieuNhap.forEach(detail => {
        ctPhieuNhapTable.rows.add(
          detail.MaSach,
          detail.SoLuongNhap,
          detail.DonGiaNhap
        )
    });
    
      await pool.request()
      .input('Ident', id)
      .input('NgayCt', NgayCt)
      .input('MaCt', MaCt)
      .input('LoaiCt', LoaiCt)
      .input('SoCt', SoCt)
      .input('MaNhanVien', MaNhanVien)
      .input('MaCoSo', MaCoSo)
      .input('MaLoaiHinhSach', MaLoaiHinhSach)
      .input('MaDoiTuong', MaDoiTuong)
      .input('HTThanhToan', HTThanhToan)
      .input('DienGiai', DienGiai)
      .input('ctPhieuNhap', ctPhieuNhapTable)
      .input('CreatedBy', CreatedBy)
      .input('CreatedDate', CreatedDate)
      .execute('sp_UpdatePhieuNhap', (err, result)=>{
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

async function deletePhieuNhap(req, res) {
  try{
    const {id} = req.params
     
    const DeletedBy = req.body.MaNhanVien
    const DeletedDate = moment().format()

      const pool = await poolPromise
      await pool.request()
      .input('Id', id)
      .input('DeletedBy', DeletedBy)
      .input('DeletedDate', DeletedDate)
      .execute('sp_DeletedPhieuNhap', (err, result)=>{
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
      case 'nhapmua':
        return "NM";
      case 'nhapin':
        return "NI";
      case 'nhapcoso':
         return "NCS";
      case 'nhapphongban':
        return "NPB";
      default: 
        return ''
    }
  }

async function getPhieuNhap(req, res) {
  
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
      .execute('sp_GetPhieuNhap', (err, result)=>{
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

async function getPhieuNhapById(req, res) {
  try{
    const {id} = req.params

      const pool = await poolPromise
      await pool.request()
      .input('Id', id)
      .execute('sp_GetPhieuNhapById', (err, result)=>{
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
  deletePhieuNhap,
  getPhieuNhapById,
  getPhieuNhap
}