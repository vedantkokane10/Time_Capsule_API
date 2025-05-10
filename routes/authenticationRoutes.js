import express from "express";
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: "Time Capsule Authentication API" });
});




router.post('/register', register);
router.post('/login', login);

export default router;
