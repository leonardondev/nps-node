import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { SurveyController } from './controllers/SurveyController';
import { SendMailController } from './controllers/SendMailController';
import { AnswerController } from './controllers/AnswerController';
import { NpsController } from './controllers/NpsController';

const router = Router()

const userController = new UserController();
const surveysController = new SurveyController();
const sendMailController = new SendMailController();
const answersController = new AnswerController();
const npsController = new NpsController();

router.post('/users', userController.create);

router.get('/surveys', surveysController.show);
router.post('/surveys', surveysController.create);

router.post('/sendMail', sendMailController.execute);

router.get('/answers/:value', answersController.execute);
router.get('/nps/:survey_id', npsController.execute);

export { router };
