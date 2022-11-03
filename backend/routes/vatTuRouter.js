const express = require("express");

const vatTuController = require("../controllers/VatTuController");

const vatTuRouter = express.Router();

vatTuRouter.get("/", vatTuController.getVatTu);
vatTuRouter.get("/:id", vatTuController.getVatTuById);
vatTuRouter.post("/create", vatTuController.create);
vatTuRouter.post("/:id", vatTuController.update);
vatTuRouter.post("/delete/:id", vatTuController.deleteVatTu);

module.exports = vatTuRouter;
