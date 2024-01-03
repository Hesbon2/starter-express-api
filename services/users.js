const User = require("../models/users.js");
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/auth.js");

async function login({ phoneNumber, password }, callback) {
  try {
    console.log('Attempting login for phoneNumber:', phoneNumber);

    // Find a user in the database based on the provided phone number
    const user = await User.findOne({ phoneNumber });

    console.log('User found:', user);

    // Check if the user exists
    if (user != null) {
      // If the user exists, compare the provided password with the stored hashed password
      console.log('Comparing passwords...');
      if (bcrypt.compareSync(password, user.password)) {
        // If passwords match, generate an access token using the provided phone number
        const token = auth.generateAccessToken(phoneNumber);

        console.log('Login successful. Returning user data with token:', { ...user.toJSON(), token });

        // Return the user data (converted to JSON) along with the generated token
        return callback(null, { ...user.toJSON(), token });
      } else {
        // If passwords don't match, return an error indicating invalid credentials
        console.log('Invalid User credentials. Passwords do not match.');
        return callback({
          message: 'Invalid User credentials',
        });
      }
    } else {
      // If the user doesn't exist, return an error indicating that the account does not exist
      console.log('Invalid User: Account does not exist!');
      return callback({
        message: 'Invalid User: Account does not exist!',
      });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return callback({
      message: 'Error during login',
    });
  }
}


async function signup(params, callback) {
  if (params.phoneNumber === undefined) {
    console.log(params.phoneNumber);
    return callback(
      {
        message: "Phone Number Required",
      },
      ""
    );
  }

  const user = new User(params);
  user
    .save()
    .then((response) => {
      return callback(null, response);
    })
    .catch((error) => {
      return callback(error);
    });
}

async function userDetails({ phoneNumber }, callback) {
  const user = await User.findOne({ phoneNumber });

  if (user != null) {
    if (bcrypt.compareSync(password, user.password)) {
      const token = auth.generateAccessToken(phoneNumber);
      // call toJSON method applied during model instantiation
      return callback(null, { ...user.toJSON(), token });
    } else {
      return callback({
        message: "Invalid User credentials",
      });
    }
  } else {
    return callback({
      message: "Invalid User: Account does not exist!",
    });
  }
}

module.exports = {
  login,
  signup,
  userDetails,
};
