const express = require("express");

const hocKyController = require("../controllers/hocKyController");

const hocKyRouter = express.Router();

hocKyRouter.get("/", hocKyController.getHocKy);
hocKyRouter.get("/:id", hocKyController.getHocKyById);
hocKyRouter.post("/create", hocKyController.create);
hocKyRouter.post("/:id", hocKyController.update);
hocKyRouter.post("/delete/:id", hocKyController.deleteHocKy);

module.exports = hocKyRouter;
