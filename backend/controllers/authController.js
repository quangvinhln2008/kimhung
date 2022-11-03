const {sql, poolPromise } = require('../config/db.js')
const { jwtConfig } = require('../config/vars')
const helper = require('../ultility/helper');
const jwt = require("jsonwebtoken");
const  { expressjwt }  = require('express-jwt');

async function login(req, res) {
  try{
    const userName = req.body.id
    const password = req.body.password
    const pool = await poolPromise
    console.log('user name', req.body)
    await pool.request()
    .input('USERNAME', sql.VarChar, userName)
    .query('SELECT * FROM DMNHANVIEN WHERE TenDangNhap = @USERNAME', (err, user)=>{
      if (err) {
          res.status(500).send({ message: err });
          return;
        }
      if (user.recordset.length===0) {      
          return res.status(404).send({ message: "Tên đăng nhập không đúng." });
        }

      // var passwordIsValid = user?.recordset[0]?.MatKhauDangNhap === helper.hashPassword(req.body.password) ? true : false;
      var passwordIsValid = user?.recordset[0]?.MatKhauDangNhap === req.body.password ? true : false;

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Mật khẩu không đúng!"
        });
      }
      // res.status(200).send(user)
      if(user.recordset.length !==0 ){
        var token = jwt.sign({ 
          userName: user?.recordset[0]?.TenDangNhap, 
          manv: user?.recordset[0]?.MaNhanVien, 
          roles: user?.recordset[0]?.Role}, jwtConfig.secret, {
          expiresIn: 86400 // 24 hours
        });

        res.status(200).send({
          id: user.recordset[0]?.MaNhanVien,
          userName: user.recordset[0]?.TenNhanVien,
          MaCoSo:user.recordset[0]?.MaCoSo,
          roles: user.recordset[0]?.Role.trim(),
          accessToken: token
        });
      }
    })
  }catch(error){
    res.status(500).send(error.message)
  }
};

getTokenFromHeaders = (req, res) => {
  const { headers: { authorization } } = req;

  if(authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1];
  }
  return null;
};

const authenticate = expressjwt({
  secret: jwtConfig.secret,
  algorithms: ["HS256"],
  userProperty: 'payload',
  getToken: getTokenFromHeaders,
})

  // async function changePassword(req, res){
  //   const pool = await poolPromise
  //   const token = req.body.token
  //   const newPassword = req.body.newPassword

  //   var manv
  //   jwt.verify(token, 'tracuu', (err, decoded) => {
  //     if (err) {
  //       return res.status(401).send({ message: "Unauthorized!" });
  //     }
  //     manv = decoded.manv;
  //   });

  //   await pool.request()
  //     .input('MANV',  manv)
  //     .input('NEWPASSWORD',  helper.hashPassword(newPassword))
  //     .execute('sp_ChangePassword', (err, result)=>{
  //       if (err) {
  //           res.status(500).send({ message: err });
  //           return;
  //         }
  //         res.status(200).send({
  //           result
  //         });
  //       });
  // }

  // async function changeEmail(req, res){
  //   const pool = await poolPromise
  //   const token = req.body.token
  //   const emailNew = req.body.emailNew

  //   var manv
  //   jwt.verify(token, 'tracuu', (err, decoded) => {
  //     if (err) {
  //       return res.status(401).send({ message: "Unauthorized!" });
  //     }
  //     manv = decoded.manv;
  //   });

  //   await pool.request()
  //     .input('MANV',  manv)
  //     .input('NEWEMAIL',  emailNew)
  //     .execute('sp_ChangeEmail', (err, result)=>{
  //       if (err) {
  //           res.status(500).send({ message: err });
  //           return;
  //         }
  //         res.status(200).send({
  //           result
  //         });
  //       });
  // }
  // async function changeId(req, res){
  //   const pool = await poolPromise
  //   const token = req.body.token
  //   const idNew = req.body.idNew

  //   var manv
  //   jwt.verify(token, 'tracuu', (err, decoded) => {
  //     if (err) {
  //       return res.status(401).send({ message: "Unauthorized!" });
  //     }
  //     manv = decoded.manv;
  //   });

  //   await pool.request()
  //     .input('MANV',  manv)
  //     .input('NEWID',  idNew)
  //     .execute('sp_ChangeId', (err, result)=>{
  //       if (err) {
  //           res.status(500).send({ message: err });
  //           return;
  //         }
  //         res.status(200).send({
  //           result
  //         });
  //       });
  // }

  // async function changePhone(req, res){
  //   const pool = await poolPromise
  //   const token = req.body.token
  //   const phoneNew = req.body.phoneNew

  //   var manv
  //   jwt.verify(token, 'tracuu', (err, decoded) => {
  //     if (err) {
  //       return res.status(401).send({ message: "Unauthorized!" });
  //     }
  //     manv = decoded.manv;
  //   });

  //   await pool.request()
  //     .input('MANV',  manv)
  //     .input('NEWPHONE',  phoneNew)
  //     .execute('sp_ChangePhone', (err, result)=>{
  //       if (err) {
  //           res.status(500).send({ message: err });
  //           return;
  //         }
  //         res.status(200).send({
  //           result
  //         });
  //       });
  // }
  // function getFilePdf (req, res) {
  //   try {
  //       res.contentType("application/pdf");
  //       res.sendFile(path.join(__dirname + `HDSD.pdf`))

  //   } catch (error) {
  //     ErrorHandler(res, 500, error.message)
  //   }
  // }
  // async function profile(req, res){
  //   const pool = await poolPromise
  //   const token = req.body.token
  //   var manv
  //   jwt.verify(token, 'tracuu', (err, decoded) => {
  //     if (err) {
  //       return res.status(401).send({ message: "Unauthorized!" });
  //     }
  //     manv = decoded.manv;
  //   });

  //   await pool.request()
  //     .input('MANV',  manv)
  //     .execute('sp_LoadProfile', (err, result)=>{
  //       if (err) {
  //           res.status(500).send({ message: err });
  //           return;
  //         }
  //         res.status(200).send({
  //           result
  //         });
  //       });
  // }

  module.exports = {
    login,
    authenticate
    // profile,
    // changePassword,
    // changeEmail,
    // changePhone,
    // changeId,
    // getFilePdf
  }