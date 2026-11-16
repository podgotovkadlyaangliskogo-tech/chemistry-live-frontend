/**
 * Chemistry Live: Zod Validation Schemas
 */

import { z } from 'zod';
import { PIN_LENGTH, MIN_NICKNAME_LENGTH, MAX_NICKNAME_LENGTH } from '../constants/game.constants';

export const joinRoomSchema = z.object({
  pin_code: z
    .string()
    .trim()
    .length(PIN_LENGTH, `ПИН-код комнаты должен содержать ровно ${PIN_LENGTH} символов`)
    .regex(/^\d+$/, 'ПИН-код комнаты должен состоять только из цифр'),
  nickname: z
    .string()
    .trim()
    .min(MIN_NICKNAME_LENGTH, `Никнейм должен содержать минимум ${MIN_NICKNAME_LENGTH} символа`)
    .max(MAX_NICKNAME_LENGTH, `Никнейм не может превышать ${MAX_NICKNAME_LENGTH} символов`)
    .regex(/^[\w\sа-яА-ЯёЁ-]+$/, 'Никнейм может содержать буквы, цифры, дефис и пробелы'),
});

export const submitAnswerSchema = z.object({
  session_id: z.string().uuid('Некорректный UUID сессии'),
  player_id: z.string().uuid('Некорректный UUID игрока'),
  question_id: z.string().uuid('Некорректный UUID вопроса'),
  selected_option_id: z.string().uuid('Некорректный UUID варианта ответа'),
  response_time_ms: z
    .number()
    .int('Время ответа должно быть целым числом')
    .min(0, 'Время ответа не может быть отрицательным')
    .max(120000, 'Время ответа не может превышать 120 секунд'),
});

export const createSessionSchema = z.object({
  quiz_id: z.string().uuid('Некорректный UUID квиза'),
  host_id: z.string().uuid('Некорректный UUID хоста').optional().nullable(),
});

export const sessionControlSchema = z.object({
  session_id: z.string().uuid('Некорректный UUID сессии'),
});

export type JoinRoomInput = z.infer<typeof joinRoomSchema>;
export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type SessionControlInput = z.infer<typeof sessionControlSchema>;
