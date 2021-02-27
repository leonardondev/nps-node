import * as Yup from 'yup';

const userSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
});

const surveySchema = Yup.object().shape({
  title: Yup.string().required(),
  description: Yup.string().required(),
});

const sendMailSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  survey_id: Yup.string().required().length(36),
});

const answersSchema = Yup.object().shape({
  value: Yup.number().integer().min(1).max(10).required(),
  u: Yup.string().required().length(36),
});

const npsSchema = Yup.object().shape({
  survey_id: Yup.string().required().length(36),
});

export { userSchema, surveySchema, sendMailSchema, answersSchema, npsSchema };
