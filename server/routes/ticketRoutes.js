import express from 'express'
import auth from '../middleware/auth.js'
import authorizeRoles from '../middleware/authorize.js'

import {
    createTickets,
    getTickets,
    updateTicket
} from '../controllers/ticketController.js'

const router = express.Router();

router.post("/",auth,createTickets);
router.get("/",auth,getTickets);
router.put("/:id",auth,authorizeRoles('admin'),updateTicket);

export default router;