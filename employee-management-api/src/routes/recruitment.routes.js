const express = require('express');
const RecruitmentController = require('../controllers/recruitment.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(authMiddleware);

router.get('/', requireRole([ROLES.ADMIN, ROLES.HR]), RecruitmentController.getAll);
router.post('/', requireRole([ROLES.ADMIN, ROLES.HR]), RecruitmentController.create);
router.patch('/:id/status', requireRole([ROLES.ADMIN, ROLES.HR]), RecruitmentController.updateStatus);
router.delete('/:id', requireRole([ROLES.ADMIN, ROLES.HR]), RecruitmentController.delete);

module.exports = router;
