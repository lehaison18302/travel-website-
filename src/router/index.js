const userRouter = require("./user.router");;
const loginRouter = require("./login.router");
const tripsRouter = require("./trips.router");
const contactRouter = require("./contact.router");
const rootRouter = require("express").Router();


rootRouter.use(userRouter);
rootRouter.use(loginRouter);
rootRouter.use(tripsRouter);
rootRouter.use(contactRouter);

module.exports = rootRouter;

