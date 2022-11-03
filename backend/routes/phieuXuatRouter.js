const express = require("express");

const phieuXuatController = require("../controllers/phieuXuatController");

const phieuXuatRouter = express.Router();

phieuXuatRouter.get("/", phieuXuatController.getPhieuXuat);
phieuXuatRouter.get("/:id", phieuXuatController.getPhieuXuatById);
phieuXuatRouter.post("/create", phieuXuatController.create);
phieuXuatRouter.post("/:id", phieuXuatController.update);
phieuXuatRouter.post("/delete/:id", phieuXuatController.deletePhieuXuat);

module.exports = phieuXuatRouter;
