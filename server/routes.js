import express  from 'express';
import UserController from './controllers/UserController.js'
import LoginController from './controllers/LoginController.js'
import { authenticateToken } from './middleware/authorization.js';
import {isAdmin, isMentor} from './middleware/roleAuth.js';
import MentorController from './controllers/MentorController.js';
import SessionController from './controllers/SessionController.js';
import AdminController from './controllers/AdminController.js';

const routes = express.Router();

routes.get('/', (req, res) => {
    res.send('Hello from Express');
  });

routes.get('/api/users',  UserController.allUsers);
routes.post('/auth/signup', UserController.createUser);
routes.get('/users/:userid', UserController.getUserById )
routes.get('/api/users/sessions', authenticateToken, UserController.viewSessions);
routes.patch('/users/:userid', authenticateToken, isAdmin, UserController.upgradeUserById )

routes.post('/auth/signin', LoginController.login);

routes.get('/mentors', authenticateToken, MentorController.allMentors)
routes.get('/mentors/:mentorid', authenticateToken, MentorController.getMentorById)


routes.get('/sessions', SessionController.allSessions)
routes.patch('/sessions/:sessionid/accept', authenticateToken, isMentor, SessionController.acceptSession)
routes.patch('/sessions/:sessionid/reject', authenticateToken, isMentor, SessionController.rejectSession)
routes.post('/sessions', authenticateToken, SessionController.createSession)

routes.patch('/admin/auth/:id', AdminController.createAdmin)
routes.get('/api/admins',  AdminController.allAdmins);




export default routes;