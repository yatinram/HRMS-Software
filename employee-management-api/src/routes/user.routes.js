const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');
const { createUserSchema, updateUserSchema, updateUserStatusSchema, changeRoleSchema } = require('../validators/user.validator');

const router = express.Router();

router.use(authMiddleware);
router.get('/', requireRole('admin', 'hr'), userController.listUsers);
router.get('/:id', requireRole('admin', 'hr'), userController.getUserById);
router.post('/', requireRole('admin'), validate(createUserSchema), userController.createUser);
router.put('/:id', requireRole('admin', 'hr'), validate(updateUserSchema), userController.updateUser);
router.patch('/:id/status', requireRole('admin'), validate(updateUserStatusSchema), userController.updateUserStatus);
router.patch('/:id/role', requireRole('admin'), validate(changeRoleSchema), userController.changeRole);
router.delete('/:id', requireRole('admin'), userController.deleteUser);

module.exports = router;
