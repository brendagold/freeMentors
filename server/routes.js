import express  from 'express';
import UserController from './controllers/UserController.js'
import LoginController from './controllers/LoginController.js'
import { authenticateToken } from './middleware/authorization.js';
import MentorController from './controllers/MentorController.js';
import SessionController from './controllers/SessionController.js';

const routes = express.Router();

routes.get('/', (req, res) => {
    res.send('Hello from Express');
  });

routes.get('/api/users',  UserController.allUsers);
routes.post('/auth/signup', UserController.createUser);
routes.get('/users/:userid', UserController.getUserById )
routes.patch('/users/:userid', UserController.upgradeUserById )

routes.post('/auth/signin', LoginController.login);

routes.get('/mentors', MentorController.allMentors)
routes.get('/mentors/:mentorid', MentorController.getMentorById)


routes.get('/sessions', SessionController.allSessions)
routes.patch('/sessions/:sessionid/accept', SessionController.acceptSession)
routes.patch('/sessions/:sessionid/reject', SessionController.rejectSession)
routes.post('/sessions', authenticateToken, SessionController.createSession)


export default routes;