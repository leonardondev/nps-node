import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { SurveyController } from './controllers/SurveyController';

const router = Router()

const userController = new UserController();
const surveysController = new SurveyController();

router.post('/users', userController.create);

router.get('/surveys', surveysController.show);
router.post('/surveys', surveysController.create);

export { router };
