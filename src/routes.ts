import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { SurveyController } from './controllers/SurveyController';

const router = Router()

const userController = new UserController();
const surveysController = new SurveyController();

router.post('/users', userController.create);

router.get('/survey', surveysController.show);
router.post('/survey', surveysController.create);

export { router };
