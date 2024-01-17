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
import { QuestionType } from './enums/question-type.enum';
import { Answer } from '../answers/entities/answer.entity';

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

        totalPoints += this.calculateQuestionPoints(question);

        if (question.type === QuestionType.PlainText) {
          const trimmedAnswer = checkAnswerInput.plainAnswerText
            .replace(/\p{P}+/gu, '')
            .trim();
          question.answers[0].name === trimmedAnswer && pointsScored++;
          continue;
        }

        let sortNumber = 1;
        for (const answerId of checkAnswerInput.answerIds!) {
          const answer = question.answers.find(
            (answer: Answer) => answer.id == answerId,
          );

          if (question.type === QuestionType.Sorting) {
            answer.sortOrder === sortNumber && pointsScored++;
            sortNumber++;
            continue;
          }
          if (
            (question.type === QuestionType.Single ||
              question.type === QuestionType.Multiple) &&
            answer.isCorrect
          ) {
            pointsScored++;
          }
          if (question.type == QuestionType.Multiple && !answer.isCorrect) {
            pointsScored--;
          }
        }
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

  private calculateQuestionPoints(question: Question): number {
    let questionPoints = 0;

    switch (question.type) {
      case QuestionType.Single:
        questionPoints++;
        break;
      case QuestionType.Multiple:
        questionPoints = question.answers.filter(
          (answer) => answer.isCorrect == true,
        ).length;
        break;
      case QuestionType.Sorting:
        questionPoints = question.answers.length;
        break;
      case QuestionType.PlainText:
        questionPoints++;
        break;
    }
    return questionPoints;
  }
}
