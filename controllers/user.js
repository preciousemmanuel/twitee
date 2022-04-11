const Users = require('../models/user');
//const { sendQueue } = require('../queues/index');

exports.createUser = async (user) => {
  try {
    Users.create(
      {
        user_id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
       // profile_image: user.profile_image
      },
      (err, post) => {
        if (err) {
          return false;
        }
        return true;
      }
    );
  } catch (error) {
    return false;
    console.log(error);
  }
};

exports.updateUser = async (user) => {
  try {
    await Posts.findOneAndUpdate(
      { _id: user.id },
      {
        user_id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        profile_image: user.profile_image
      },

      (err, post) => {
        if (err) {
          return false;
        }
        return true;
      }
    );
  } catch (error) {
    return false;
    console.log(error);
  }
};
