const express = require('express');
const DesignationController = require('../controllers/designation.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(authMiddleware);

router.get('/', DesignationController.getAll);
router.post('/', requireRole([ROLES.ADMIN, ROLES.HR]), DesignationController.create);
router.put('/:id', requireRole([ROLES.ADMIN, ROLES.HR]), DesignationController.update);
router.delete('/:id', requireRole([ROLES.ADMIN]), DesignationController.delete);

module.exports = router;
