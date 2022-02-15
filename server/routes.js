import express  from 'express';
import UserController from './controllers/UserController.js'
import LoginController from './controllers/LoginController.js'

const routes = express.Router();

routes.get('/', (req, res) => {
    res.send('Hello from Express');
  });

routes.get('/api/users', UserController.allUsers);
routes.post('/user/register', UserController.createUser);

routes.post('/user/login', LoginController.login);

export default routes;