import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAnswerInput } from './dto/create-answer.input';
import { QueryRunner } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { QuestionType } from '../questions/enums/question-type.enum';

@Injectable()
export class AnswersService {
  async createAnswer(
    createAnswersInput: CreateAnswerInput[],
    questionId: string,
    queryRunner: QueryRunner,
  ): Promise<void> {
    for (const createAnswerInput of createAnswersInput) {
      const answer = queryRunner.manager.create(Answer, {
        name: createAnswerInput.name,
        isCorrect: createAnswerInput.isCorrect ?? null,
        sortOrder: createAnswerInput.sortOrder ?? null,
        questionId,
      });

      await queryRunner.manager.save(answer);
    }
  }
}
