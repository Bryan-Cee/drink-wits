import * as yup from 'yup';

export const createGameSchema = yup.object({
  gameName: yup
    .string()
    .required('Game name is required')
    .min(3, 'Game name must be at least 3 characters')
    .max(30, 'Game name must not exceed 30 characters'),
  players: yup
    .array()
    .of(
      yup
        .object({
          name: yup
            .string()
            .required('Player name is required')
            .min(2, 'Player name must be at least 2 characters')
            .max(20, 'Player name must not exceed 20 characters'),
        })
    )
    .required('Players are required')
    .min(1, 'At least one player is required')
    .max(10, 'Maximum 10 players allowed'),
});

export type CreateGameFormValues = {
  gameName: string;
  players: { name: string }[];
};
