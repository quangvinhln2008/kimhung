const express = require("express");

const doiTuongController = require("../controllers/doiTuongController");

const doiTuongRouter = express.Router();

doiTuongRouter.get("/", doiTuongController.getDoiTuong);
doiTuongRouter.get("/:id", doiTuongController.getDoiTuongById);
doiTuongRouter.post("/create", doiTuongController.create);
doiTuongRouter.post("/:id", doiTuongController.update);
doiTuongRouter.post("/delete/:id", doiTuongController.deleteDoiTuong);

module.exports = doiTuongRouter;
