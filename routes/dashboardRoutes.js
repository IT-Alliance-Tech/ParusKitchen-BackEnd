const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/authMiddleware');

router.get('/current-subscription', auth, dashboardController.getCurrentSubscription);
router.get('/upcoming-menu', auth, dashboardController.getUpcomingMenu);

router.post('/subscription/pause', auth, dashboardController.pauseSubscription);
router.post('/subscription/resume', auth, dashboardController.resumeSubscription);
router.post('/subscription/cancel', auth, dashboardController.cancelSubscription);
router.post('/subscription/renew', auth, dashboardController.renewSubscription);

router.get('/invoices', auth, dashboardController.getInvoices);
router.put('/update-profile', auth, dashboardController.updateProfile);

module.exports = router;
