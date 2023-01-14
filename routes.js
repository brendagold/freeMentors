import express  from 'express';
import multer from 'multer';
import UserController from './controllers/UserController.js'
import LoginController from './controllers/LoginController.js'
import { authenticateToken } from './middleware/authorization.js';
import {isAdmin, isMentor, isUser} from './middleware/roleAuth.js';
import MentorController from './controllers/MentorController.js';
import SessionController from './controllers/SessionController.js';
import AdminController from './controllers/AdminController.js';
import { cloudStorage } from './utils/upload.js';

const routes = express.Router();

const parser = multer({ storage: cloudStorage });

routes.get('/', (req, res) => {
    res.send('Hello from Free Mentors API');
  });

routes.get('/api/users',  UserController.allUsers);
routes.post('/auth/signup', parser.single('profile_img'), UserController.createUser);
routes.get('/users/:userid', UserController.getUserById );
routes.get('/user/edit/:userid', UserController.editProfile );
routes.patch('/users/:userid', authenticateToken, isAdmin, UserController.upgradeUserById )

routes.post('/auth/signin', LoginController.login);

routes.get('/mentors',  MentorController.allMentors)
routes.get('/mentors/:mentorid', authenticateToken, MentorController.getMentorById)


routes.get('/api/sessions', SessionController.allSessions)
routes.patch('/sessions/:sessionid/accept', authenticateToken, isMentor, SessionController.acceptSession)
routes.patch('/sessions/:sessionid/reject', authenticateToken, isMentor, SessionController.rejectSession)
routes.patch('/sessions/:sessionid/review', authenticateToken, isUser, SessionController.reviewSession)
routes.delete('/sessions/:sessionid/review', authenticateToken, isAdmin, SessionController.deleteReview)
routes.post('/sessions', authenticateToken, SessionController.createSession)
routes.get('/sessions', authenticateToken, SessionController.viewSessions);

routes.patch('/admin/auth/:id', isAdmin, AdminController.createAdmin)
routes.get('/api/admins', authenticateToken, isAdmin, AdminController.allAdmins);




export default routes;