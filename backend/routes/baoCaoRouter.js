const express = require("express");

const baoCaoController = require("../controllers/baoCaoController");

const baoCaoRouter = express.Router();

baoCaoRouter.get("/bangkenhap", baoCaoController.bangKeNhap);
baoCaoRouter.get("/list", baoCaoController.getList);

module.exports = phieuXuatRouter;
