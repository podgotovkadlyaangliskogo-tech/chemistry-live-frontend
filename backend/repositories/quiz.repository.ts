import { createAdminClient } from '../lib/supabase.server';
import { Quiz, Question, QuestionWithOptions, QuestionWithCorrectAnswer, AnswerOption, ClientAnswerOption } from '@/shared/types/quiz.types';

export class QuizRepository {
  private static get client() {
    return createAdminClient();
  }

  static async getQuizById(quizId: string): Promise<Quiz | null> {
    const { data, error } = await this.client
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single();

    if (error || !data) return null;
    return data as Quiz;
  }

  static async getDefaultQuiz(): Promise<Quiz | null> {
    const { data, error } = await this.client
      .from('quizzes')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) return null;
    return data as Quiz;
  }

  static async getQuestionsByQuizId(quizId: string): Promise<Question[]> {
    const { data, error } = await this.client
      .from('questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('order_index', { ascending: true });

    if (error || !data) return [];
    return data as Question[];
  }

  static async getQuestionWithOptions(questionId: string): Promise<QuestionWithOptions | null> {
    const { data: question, error: qError } = await this.client
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single();

    if (qError || !question) return null;

    const { data: options, error: optError } = await this.client
      .from('answer_options')
      .select('id, question_id, text, color, order_index')
      .eq('question_id', questionId)
      .order('order_index', { ascending: true });

    if (optError || !options) return null;

    return {
      ...(question as Question),
      options: options as ClientAnswerOption[],
    };
  }

  static async getQuestionWithCorrectAnswer(questionId: string): Promise<QuestionWithCorrectAnswer | null> {
    const { data: question, error: qError } = await this.client
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single();

    if (qError || !question) return null;

    const { data: options, error: optError } = await this.client
      .from('answer_options')
      .select('*')
      .eq('question_id', questionId)
      .order('order_index', { ascending: true });

    if (optError || !options) return null;

    const typedOptions = options as AnswerOption[];
    const correctOption = typedOptions.find((opt) => opt.is_correct);

    return {
      ...(question as Question),
      options: typedOptions,
      correct_option_id: correctOption ? correctOption.id : '',
    };
  }
}
