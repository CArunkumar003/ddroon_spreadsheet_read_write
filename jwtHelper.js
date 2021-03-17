const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const User = require('../models/login');
const Role = require('../models/it');


module.exports.verifyJwtToken = async (req, res, next) => {
    var token;
    if ('authorization' in req.headers)
        token = req.headers['authorization'].split(' ')[1];

    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    else {
      // var decoded = jwt_decode(token, {headers : true});
      // console.log(decoded.user_id);


        jwt.verify(token, process.env.JWT_SECRET,
            (err, decoded) => {

                if (err)
                    return res.status(500).send({ auth: false, message: 'Token authentication failed.' });
                else {


                  // console.log(decoded._id)
                    req._id = decoded._id;
                  
                    next();
                }
            }
        )
    }
}

module.exports.verifyJwtToken2 = async (req, res, next) => {

  var token;
  if ('authorization' in req.headers)
      token = req.headers['authorization'].split(' ')[1];

  if (!token)
      return res.status(403).send({ auth: false, message: 'No token provided.' });
  else {
    var decoded = jwt_decode(token, {headers : true});
    raildUserId = decoded.user_id.$oid
    raildUserExp = new Date ((decoded.exp)*1000)
    var currentdate = new Date();


    User.findOne({ _id: raildUserId },
      (err, user) => {
          if (!user){
              return res.status(404).json({ status: false, message: 'User not found.' });
            }

else if (raildUserExp < currentdate) {
  return res.status(404).json({ status: false, message: 'Token Expired.' });
  
}
      else{

          next();
        }

          // return res.status(200).json({ status: true, message: 'Authenication Passed.'});
              }
          
      )
  }
  
}




// const jwt = require("jsonwebtoken");
// const config = require("../config/config.js");
// const User = require('../models/login');
// const Role = require('../models/it');
// const User = db.user;
// const Role = db.role;

// verifyToken = (req, res, next) => {
//   let token = req.headers["x-access-token"];

//   if (!token) {
//     return res.status(403).send({ message: "No token provided!" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).send({ message: "Unauthorized!" });
//     }
//     req.userId = decoded.id;
//     next();
//   });
// };

module.exports.isContentProducer = async  (req, res, next) => {

  let roleid = await this.verifyJwtToken()

  User.findById(roleid).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};



// const authJwt = {
//   // verifyToken,
//   isContentProducer,
// };
// module.exports = authJwt;


