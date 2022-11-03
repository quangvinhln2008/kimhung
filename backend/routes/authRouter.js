const express = require("express");

const authController = require("../controllers/authController");

const authRouter = express.Router();

authRouter.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

authRouter.post("/login", authController.login);
// authRouter.post("/profile", authController.profile);
// authRouter.post("/changePassword", authController.changePassword);
// authRouter.post("/changeEmail", authController.changeEmail);
// authRouter.post("/changePhone", authController.changePhone);
// authRouter.post("/changeId", authController.changeId);
// authRouter.get("/HDSD.pdf", authController.getFilePdf);

module.exports = authRouter;
