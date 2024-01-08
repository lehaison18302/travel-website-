const userRouter = require("./user.router");
const rootRouter = require("express").Router();

rootRouter.use(userRouter);

module.exports = rootRouter;

