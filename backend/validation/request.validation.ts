import { ZodSchema, ZodError } from 'zod';
import { NextResponse } from 'next/server';

export interface ValidationSuccess<T> {
  success: true;
  data: T;
}

export interface ValidationErrorResponse {
  success: false;
  response: NextResponse;
}

export async function validateRequestBody<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<ValidationSuccess<T> | ValidationErrorResponse> {
  try {
    const json = await request.json();
    const parsed = schema.parse(json);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof ZodError) {
      const messages = error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
      return {
        success: false,
        response: NextResponse.json(
          {
            success: false,
            error: `Ошибка валидации: ${messages}`,
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        ),
      };
    }

    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: 'Неверный формат JSON в теле запроса',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      ),
    };
  }
}
