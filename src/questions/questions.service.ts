import { Injectable } from '@nestjs/common';
import { CreateQuestionInput } from './dto/create-question.input';
import { QueryRunner, Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { AnswersService } from '../answers/answers.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckAnswersInput } from '../quiz/dto/check-answers.input';
import { CheckAnswersResponse } from '../quiz/dto/check-answers.response';
import { QuestionType } from './enums/question-type.enum';
import { Answer } from '../answers/entities/answer.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    private readonly answersService: AnswersService,
  ) {}

  async findOne(id: string): Promise<Question> {
    return this.questionRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ['answers'],
    });
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
