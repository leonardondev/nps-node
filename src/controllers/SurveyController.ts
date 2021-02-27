import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { surveySchema } from '../validators/yupSchemas';

class SurveyController {
  async create(request: Request, response: Response) {

    const { title, description } = request.body;

    try {
      await surveySchema.validate(request.body, {
        abortEarly: false,
      });
    } catch (error) {
        console.log(error);
        return response.status(400).json({error});
    }

    const surveysRepository = getCustomRepository(SurveysRepository);

    const survey = surveysRepository.create({ title, description })

    await surveysRepository.save(survey);

    return response.status(201).json(survey);
  }

  async show(request: Request, response: Response) {

    const surveysRepository = getCustomRepository(SurveysRepository);

    const all = await surveysRepository.find()

    response.json(all);
  }
};

export { SurveyController };
