import { Request, Response } from 'express';
import { getCustomRepository, IsNull, Not } from 'typeorm';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { npsSchema } from '../validators/yupSchemas';

class NpsController {
  /**
   *  1 2 3 4 5 6 7 8 9 10
   *  Detratores => 0 - 6
   *  Passivos => 7 - 8
   *  Promotores => 9 - 10
   */

  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    try {
      await npsSchema.validate(request.params, {
        abortEarly: false,
      });
    } catch (error) {
        console.log(error);
        return response.status(400).json({error});
    }

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull())
    })

    const detractors = surveyUsers.filter(survey => {
      return (survey.value >= 0 && survey.value <= 6);
    }).length;

    const passives = surveyUsers.filter(survey => {
      return (survey.value >= 7 && survey.value <= 8);
    }).length;

    const promoters = surveyUsers.filter(survey => {
      return (survey.value >= 9 && survey.value <= 10);
    }).length;

    const totalAnswers = surveyUsers.length;

    const nps = Number(
      ((promoters - detractors) * 100 / totalAnswers).toFixed(2)
    );

    return response.status(200).json({
      detractors,
      promoters,
      passives,
      totalAnswers,
      nps
    });
  }

}

export { NpsController };
