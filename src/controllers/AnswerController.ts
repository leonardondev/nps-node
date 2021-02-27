import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { answersSchema } from '../validators/yupSchemas';

class AnswerController {

  //"http://localhost:3333/answers/8?u=7c77ea73-3370-48d7-bfad-1588050c5d40"

  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { u } = request.query;

    try {
      await answersSchema.validate({ value, u }, {
        abortEarly: false,
      });
    } catch (error) {
        console.log(error);
        return response.status(400).json({error});
    }

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveysUsersRepository.findOne({
      id: String(u)
    })

    if(!surveyUser) {
      return response.status(400).json({
        error: "Survey User does not exists!"
      })
    }

    surveyUser.value = Number(value);
    await surveysUsersRepository.save(surveyUser);

    return response.status(200).json(surveyUser);
  }

}

export { AnswerController };
