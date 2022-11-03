const express = require("express");

const coSoController = require("../controllers/CoSoController");

const coSoRouter = express.Router();

coSoRouter.get("/", coSoController.getCoSo);
coSoRouter.get("/:id", coSoController.getCoSoById);
coSoRouter.post("/create", coSoController.create);
coSoRouter.post("/:id", coSoController.update);
coSoRouter.post("/delete/:id", coSoController.deleteCoSo);

module.exports = coSoRouter;
