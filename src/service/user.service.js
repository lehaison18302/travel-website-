
const { BadRequestError } = require("../core/error.response");
const { User } = require("../models/user");

const getAllUser = async () => { 
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const login = async (username, password) => {
  try {
    const userLogin = await User.findOne({
      where: { userName: username },
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
