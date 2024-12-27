const userRouter = require("./user.router");;
const loginRouter = require("./login.router");
const tripsRouter = require("./trips.router");
const contactRouter = require("./contact.router");
const adminRouter = require("./admin");
const hotelRouter = require("./hotel.router");
const restaurantRouter = require("./restaurant.router");
const commentRouter = require("./comment.router");
const rootRouter = require("express").Router();


rootRouter.use(userRouter);
rootRouter.use(loginRouter);
rootRouter.use(tripsRouter);
rootRouter.use(contactRouter);
rootRouter.use(adminRouter);
rootRouter.use(hotelRouter);
rootRouter.use(restaurantRouter);
rootRouter.use(commentRouter);

module.exports = rootRouter;

