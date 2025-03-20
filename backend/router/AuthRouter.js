require('dotenv').config();
const express = require('express');
const router = express.Router();

router.route('/login').post(require('../controller/Auth').login);
router.route('/register').post(require('../controller/Auth').register);
router.route('/users').get(require('../controller/Auth').getUsers);

router.route('/generate-otp').post(require('../controller/Auth').getOtp);
router.route('/verify-otp').post(require('../controller/Auth').Verifyotp);
router.route('/reset-password').post(require('../controller/Auth').resetPassword);
router.route('/resetpass-otp').patch(require('../controller/Auth').respassword);


module.exports = router;