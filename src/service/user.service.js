const { BadRequestError } = require("../core/error.response");
const { Users } = require("../models");

const getAllUser = async () => { /*lay thong tin user tu csdl*/
  try {
    const users = await Users.findAll();
    return users;
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const login = async (username, password) => {
  try {
    const userLogin = await Users.findOne({
      where: { username: username },
    });
    return userLogin;
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

module.exports = {
  getAllUser,
  login,
};
