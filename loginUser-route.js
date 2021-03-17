const express = require('express');
const router = express.Router();

const loginController = require('../controllers/login-controller');

const jwtHelper = require('../config/jwtHelper');

// CRUD
// user -> /user
router.get('/', loginController.get)

// router.post('/', loginController.post)

router.put('/', loginController.put)

router.delete('/:id', loginController.delete)

router.post('/register', loginController.register);

router.post('/auth', loginController.authenticate);

// router.get('/token',jwtHelper.verifyJwtToken, loginController.userProfile);



module.exports = router