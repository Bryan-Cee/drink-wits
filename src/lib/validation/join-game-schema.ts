import * as yup from 'yup';

export const joinGameSchema = yup.object({
  joinCode: yup
    .string()
    .required('Join code is required')
    .min(6, 'Join code must be at least 6 characters'),
  playerName: yup
    .string()
    .required('Your name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(20, 'Name must be less than 20 characters'),
});
