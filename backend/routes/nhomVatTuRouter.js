const express = require("express");

const nhomVatTuController = require("../controllers/NhomVatTuController");

const nhomVatTuRouter = express.Router();

nhomVatTuRouter.get("/", nhomVatTuController.getNhomVatTu);
nhomVatTuRouter.get("/:id", nhomVatTuController.getNhomVatTuById);
nhomVatTuRouter.post("/create", nhomVatTuController.create);
nhomVatTuRouter.post("/:id", nhomVatTuController.update);
nhomVatTuRouter.post("/delete/:id", nhomVatTuController.deleteNhomVatTu);

module.exports = nhomVatTuRouter;
