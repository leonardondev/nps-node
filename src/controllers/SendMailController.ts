import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import { sendMailSchema } from '../validators/yupSchemas';
import SendMailService from '../services/SendMailService';
import path from 'path';
import { AppError } from '../errors/AppError';

class SendMailController {
  async execute(request: Request, response: Response) {
    const {email, survey_id } = request.body;

    try {
      await sendMailSchema.validate(request.body, {
        abortEarly: false,
      });
    } catch (error) {
        console.log(error);
        return response.status(400).json({error});
    }

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({ email });

    if(!user) {
      throw new AppError("User does not exists!");
    }

    const survey = await surveysRepository.findOne({ id: survey_id });

    if(!survey) {
      throw new AppError("Survey does not exists!");
    }

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: {
        user_id: user.id,
        survey_id: survey_id,
        value: null,
      },
      relations: ['user', 'survey']
    })

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: "",
      link: process.env.URL_MAIL
    }
    const npsPath = path.resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

    if(surveyUserAlreadyExists) {
      variables.id = surveyUserAlreadyExists.id;
      await SendMailService.execute(email, survey.title, variables, npsPath);
      return response.status(200).json(surveyUserAlreadyExists);
    }

    const surveyUser = surveysUsersRepository.create({
      survey_id,
      user_id: user.id,
    })
    await surveysUsersRepository.save(surveyUser);
    variables.id = surveyUser.id;

    /* Send email */
    await SendMailService.execute(email, survey.title, variables, npsPath);
    return response.status(201).json(surveyUser);
  }
}


export { SendMailController };
