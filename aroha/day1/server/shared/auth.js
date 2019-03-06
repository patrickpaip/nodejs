exports.passport = require("passport");
let BasicStrategy  = require("passport-http").BasicStrategy;
const bcrypt = require("bcrypt");
const saltRounds = 10;
const userModel = require("../models/userModel");

let randtoken = require('rand-token');
let jwt = require('jsonwebtoken');
const JWT_EXPIRATION= (60*60)

let uuidv4 = require('uuid/v4')
const SERVER_SECRET=uuidv4();  // Secret key

exports.registerUser = (req, res) => {
  const userName = req.body.username; // Mandatory
  const plainPassword = req.body.password; // Mandatory
  const fullName = req.body.fullname; // Mandatory
  const mobileNo = req.body.mobileno; // Mandatory
  if (
    userName !== undefined &&
    plainPassword !== undefined &&
    fullName !== undefined &&
    mobileNo !== undefined
  ) {
    bcrypt
      .hash(plainPassword, saltRounds)
      .then(hash => {
        const userData = new userModel({
          username: userName,
          password: hash,
          fullname: fullName,
          mobileno: mobileNo,
          version: 1
        });
        // Promise Version
        userData
          .save()
          .then(data => {
            res.json({ err: false, err_msg: "Successfully Written to the DB" });
          })
          .catch(err => {
            res.json({ err: true, err_msg: "Failed to Write to the DB" + err });
          });
      })
      .catch(err => {
        return res.json({ err: true, err_msg: "BCrypt Error" });
      });
  } else {
    return res.json({ err: true, err_msg: "Parameter is missing" });
  }
};



// Used for Login, Not to be called directly
exports.passport.use(new BasicStrategy(
    function(username, password, done) {
    userModel.findOne({ username: username }, { _id: 0 }, (err, data) => {
      if (err) {
        done(err, null);
      } else {
        if (data != null) {
          data = data.toObject();
          bcrypt
            .compare(password, data.password)
            .then(result => {
              if (result) {
                let user = {
                  firstname: data.fullname,
                  mobile: data.mobileno
                };
                // Password is correct
                done(null, user);
              } else {
                  console.log('here')
                  // Password is wrong
                done(null, false);
              }
            })
            .catch(err => {
                // Error
              done(err, null);
            });
        } else {
            // user not Present
          done(err, false);
        }
      }
    });
  })
);

// To Autheticate using Passport Module
exports.authenticateViaPassport = function (req, res, next) {
    exports.passport.authenticate('basic', { session: false },
      function (err, user, info) {
        
        if (!user) {
          res.set('WWW-Authenticate', 'x' + info); // change to xBasic
          res.status(401).json({
            "err": true, "err_code": 401, "alert": true, "alertdetails": ["User Not Registered"],
          });
        } else {
          req.user = user;
          next();
        }
      }
    )(req, res, next);
  };


  
// generate JWT
exports.generateJWT = function (req, res, next) {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + JWT_EXPIRATION
    , mobile: req.user.mobile
  };
  req.token = jwt.sign(payload, SERVER_SECRET);
  next();
}


exports.returnAuthResponse = function (req, res) {
  res.status(200).json({
    "err": false, "err_code": 200, "alert": false, "alertdetails": [], data: {
      user: req.user,
      token: req.token,
    }
  });
}
  
exports.ensureAuthenticatedElseError = function (req, res, next) {

  const token = getToken(req.headers);
  if (token) {
    try {
      const payload = jwt.verify(token, SERVER_SECRET);
      res.locals.mobile = payload.mobile;
      next();
    } catch (err) {
      if (err.name == "JsonWebTokenError") {
        res.status(401).json({
          "err": true, "err_code": 401, "alert": true, "alertdetails": ["Please Login Again"]
        });
      }
      else {
        res.status(401).json({
          "err": true, "err_code": 401, "alert": true, "alertdetails": ["Please Login Again"]
        });
      }
    }
  } else {
    res.status(401).json({
      "err": true, "err_code": 401, "alert": true, "alertdetails": ["Missing Headers"]
    });
  }
}

function getToken(headers) {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};