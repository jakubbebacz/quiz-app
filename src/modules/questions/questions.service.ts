import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuestionInput } from './dto/create-question.input';
import { QueryRunner, Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { AnswersService } from '../answers/answers.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckAnswersInput } from './dto/check-answers.input';
import { CheckAnswersResponse } from './dto/check-answers.response';
import { CalculateQuestionPointsContext } from './calculate-question-points.strategy';
import { CalculatePointsScoredContext } from './calculate-points-scored.strategy';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    private readonly answersService: AnswersService,
  ) {}

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

  async checkAnswers(
    checkAnswersInput: CheckAnswersInput[],
  ): Promise<CheckAnswersResponse> {
    let totalPoints: number = 0;
    let pointsScored: number = 0;

    for (const checkAnswerInput of checkAnswersInput) {
      try {
        const question = await this.questionRepository.findOneOrFail({
          where: {
            id: checkAnswerInput.questionId,
          },
          relations: ['answers'],
        });

        const calculateQuestionPointsContext =
          new CalculateQuestionPointsContext();
        totalPoints +=
          calculateQuestionPointsContext.calculateQuestionPoints(question);

        const calculatePointsScoredContext = new CalculatePointsScoredContext();
        pointsScored += calculatePointsScoredContext.calculatePointsScored(
          question,
          checkAnswerInput,
        );
      } catch (err) {
        if (err.name === 'EntityNotFoundError') {
          throw new NotFoundException(
            `Question ${checkAnswerInput.questionId} was not found`,
          );
        }

        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    return { pointsScored, totalPoints };
  }
}
