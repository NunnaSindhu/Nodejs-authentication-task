var bcrypt = require("bcryptjs");
var saltRound = 10;
var JWT = require("jsonwebtoken");
var JWTD = require("jwt-decode");
var secret = "Gpy6tX9ypFAYi7d4";

var hashpassword = async (pwd) => {
  let salt = await bcrypt.genSalt(saltRound);
  let hash = await bcrypt.hash(pwd, salt);
  return hash;
};
//hash compare
var hashCompare = async (pwd, hash) => {
  let result = await bcrypt.compare(pwd, hash);
  return result;
};
var createToken = async (email, firstname, role) => {
  let token = await JWT.sign(
    {
      email,
      firstname,
      role,
    },
    secret,
    {
      expiresIn: "1m",
    }
  );
  return token;
};
//Verification of token
var verifyToken = async (req, res, next) => {
  let decodeData = JWTD(rq.headers, token);
  console.log(decodeData);
};
//Verification of token
var verifyToken = async (req, res, next) => {
  let decodeData = JWTD(req.headers.token);
  console.log(decodeData);
  if (new Date() / 1000 < decodeData.exp) {
    next();
  } else {
    res.json({
      statusCode: 400,
      message: "Session Expired. Login again",
    });
  }
  return true;
};

var verifyAdminRole = async (req, res, next) => {
  let decodeData = JWTD(req.headers.token);
  console.log(decodeData);
  if (decodeData.role == 5) {
    next();
    res.json({
      statusCode:200,
      message:"Admin"
    })
  } else {
    res.json({
      statusCode: 400,
      message: "Only Admin can access to the site",
    });
  }
  return true;
};
module.exports = {
  hashpassword,
  hashCompare,
  createToken,
  verifyToken,
  verifyAdminRole,
};
