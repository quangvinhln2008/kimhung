var express = require('express');
const cors = require('cors');

const authRouter = require('./routes/authRouter');
const nhomDoiTuongRouter = require('./routes/nhomDoiTuongRouter');
const loaiHinhSachRouter = require('./routes/loaiHinhSachRouter');
const coSoRouter = require('./routes/coSoRouter');
const hocKyRouter = require('./routes/hocKyRouter');
const doiTuongRouter = require('./routes/doiTuongRouter');
const sachRouter = require('./routes/sachRouter');
const nhanVienRouter = require('./routes/nhanVienRouter');
const tonDauKyRouter = require('./routes/tonDauKyRouter')

const phieuNhapRouter = require('./routes/phieuNhapRouter')
const phieuXuatRouter = require('./routes/phieuXuatRouter')
 
const port = process.env.PORT === 'production' ? (dotenv.PORT || 80) : 3001;
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.listen(process.env.PORT || port , (err) => {
    if(err)
  console.log('Unable to start the server!')
  else
  console.log('Server started running on : ' + port)
  })
//user login router in /routes/loginRouter.js
app.use('/user/', authRouter)
app.use('/nhomdoituong/', nhomDoiTuongRouter)
app.use('/loaihinhsach/', loaiHinhSachRouter)
app.use('/coso/', coSoRouter)
app.use('/hocky/', hocKyRouter)
app.use('/doituong/', doiTuongRouter)
app.use('/sach/', sachRouter)
app.use('/nhanvien/', nhanVienRouter)
app.use('/tondauky/', tonDauKyRouter)
app.use('/phieunhap/', phieuNhapRouter)
app.use('/phieuxuat/', phieuXuatRouter)
