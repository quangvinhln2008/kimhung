const express = require("express");

const nhomDoiTuongController = require("../controllers/nhomDoiTuongController");

const nhomDoiTuongRouter = express.Router();

nhomDoiTuongRouter.get("/", nhomDoiTuongController.getNhomDt);
nhomDoiTuongRouter.get("/:id", nhomDoiTuongController.getNhomDtById);
nhomDoiTuongRouter.post("/create", nhomDoiTuongController.create);
nhomDoiTuongRouter.post("/:id", nhomDoiTuongController.update);
nhomDoiTuongRouter.post("/delete/:id", nhomDoiTuongController.deleteNhomDt);

module.exports = nhomDoiTuongRouter;
