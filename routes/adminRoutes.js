const express=require('express');
const { isAuthenticatedUser , authorizeRoles } = require('../middlewares/auth');
const router=express.Router();
const {retriveFeedbacks,
    retriveFeedbacksById,
    updateFeeback}
    =require('../controllers/adminController');

    
router.get('/feedback',isAuthenticatedUser ,authorizeRoles("admin"),retriveFeedbacks);

router.get('/feedback/:id',retriveFeedbacksById);

router.post('/feedback/update/:id',updateFeeback);

module.exports=router;
