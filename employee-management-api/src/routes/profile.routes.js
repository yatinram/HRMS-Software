const express = require('express');
const profileController = require('../controllers/profile.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { updateProfileSchema, changePasswordSchema } = require('../validators/user.validator');

const router = express.Router();

router.use(authMiddleware);
router.get('/', profileController.getProfile);
router.put('/', validate(updateProfileSchema), profileController.updateProfile);
router.patch('/password', validate(changePasswordSchema), profileController.changePassword);

module.exports = router;
