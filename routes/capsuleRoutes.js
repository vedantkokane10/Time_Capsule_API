import express from "express"
import {createCapsule, getCapsule, listAllCapsules, updateCapsule, deleteCapsule} from "../controllers/capsuleController.js"
import validateToken from "../middleware/validateTokenHandle.js"; 

const router = express.Router()

router.post('/', validateToken, createCapsule);
router.get('/', validateToken, listAllCapsules);
router.get('/:id', validateToken, getCapsule);
router.put('/:id', validateToken, updateCapsule);
router.delete('/:id', validateToken, deleteCapsule);


export default router;

