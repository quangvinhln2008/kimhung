const express = require("express");

const baoCaoController = require("../controllers/baoCaoController");

const baoCaoRouter = express.Router();

baoCaoRouter.get("/bangkenhap", baoCaoController.bangKeNhap);
baoCaoRouter.get("/bangkexuat", baoCaoController.bangKeXuat);
baoCaoRouter.post("/nhapxuatton", baoCaoController.nhapXuatTon);
baoCaoRouter.get("/list", baoCaoController.getList);

module.exports = phieuXuatRouter;
