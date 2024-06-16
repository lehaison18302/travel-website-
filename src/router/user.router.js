const userRouter = require("express").Router();
const asyncHandler = require("../middlewares/handleError");
const userController = require("./../controller/user.controller");
userRouter.get("/users", asyncHandler(userController.getAllUser));
userRouter.post("/login", asyncHandler(userController.login));

module.exports = userRouter;
