var express = require("express");
var router = express.Router();
var { mongodb, MongoClient, dbUrl, hashCompare } = require("../dbSchema");
var { hashpassword, hashCompare,createToken,verifyToken,verifyAdminRole } = require("../auth");
// const res = require("D:Nodejs/express/lib/response");
/* GET users listing. */

router.post("/signup", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    let db = await client.db("authentication");
    let user = db.collection("users").find({ email: req.body.email });
    if (user.length > 0) {
      res.json({
        status: 400,
        message: "User already exists",
      });
    } else {
      let hashedpassword = await hashpassword(req.body.password);
      req.body.password = hashedpassword;
      let user = await db.collection("users").insertOne(req.body);
      res.json({
        statuscode: 200,
        message: "user signedup successfully",
        hashedpassword,
      });
    }
  } catch (error) {
    res.json({
      statuscode: 500,
      message: "Internal server message",
    });
  } finally {
    client.close();
  }
});
//login
router.post("/login", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    let db = await client.db("authentication");
    let user = await db.collection("users").findOne({ email: req.body.email });
    if (user) {
      let compare = await hashCompare(req.body.password, user.password);
      if (compare) {
        let token= await createToken(user.email,user.firstname,user.role);
        console.log(token);
        res.json({
          statusCode: 200,
          role: user.role,
          email: user.email,
          firstname: user.firstname,
          token,
          
        });
      } else {
        res.json({
          statusCode: 400,
          message: "Invalid Password",
        });
      }
    } else {
      res.json({
        statusCode: 404,
        message: "User Not Found",
      });
    }
  } catch (err) {
    res.json({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

//validation of Token
// router.post('/auth',verifyToken,verifyAdminRole,async(req, res)=>{
router.post('/auth',verifyToken,verifyAdminRole,async(req, res)=>{
  console.log(req.headers.token);
  res.json({
    statusCode: 200,
    message: req.body.purpose
  })
})

module.exports = router;
