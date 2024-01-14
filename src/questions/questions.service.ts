import { Injectable } from '@nestjs/common';
import { CreateQuestionInput } from './dto/create-question.input';
import { QueryRunner } from 'typeorm';
import { Question } from './entities/question.entity';
import { AnswersService } from '../answers/answers.service';

@Injectable()
export class QuestionsService {
  constructor(private readonly answersService: AnswersService) {}

  findAll() {
    return `This action returns all questions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  async createQuestions(
    createQuestionsInput: CreateQuestionInput[],
    quizId: string,
    queryRunner: QueryRunner,
  ): Promise<void> {
    for (const createQuestionInput of createQuestionsInput) {
      const question = queryRunner.manager.create(Question, {
        name: createQuestionInput.name,
        type: createQuestionInput.type,
        quizId,
      });

      const response = await queryRunner.manager.save(question);

      await this.answersService.createAnswer(
        createQuestionInput.answers,
        response.id,
        queryRunner,
      );
    }
  }
}
