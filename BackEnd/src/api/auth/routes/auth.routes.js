import express from "express";
import { register ,login,verifyEmail, searchUsers} from "../controllers/auth.controller.js";
const app = express();
app.use(express.json());

const router = express.Router();

// Assuming you have already defined and imported your User model
// Make sure this is the correct path to your model
router.post('/signup', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.get('/search', searchUsers);

export default router;