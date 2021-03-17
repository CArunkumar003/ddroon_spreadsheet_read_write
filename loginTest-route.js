const express = require('express');
const router = express.Router();
let loginTestController = require('../controllers/loginTest-controller')
const jwtHelper = require('../config/jwtHelper');

// CRUD
// user -> /user
router.get('/', [jwtHelper.verifyJwtToken2], loginTestController.get)

router.get('/getSkuData', loginTestController.getSkuData)

router.post('/saveSkuData', loginTestController.SaveSkuData)



router.post('/', jwtHelper.verifyJwtToken, loginTestController.post)

router.put('/', jwtHelper.verifyJwtToken, loginTestController.put)

router.delete('/:id', jwtHelper.verifyJwtToken, loginTestController.delete)

module.exports = router