import { Injectable } from '@nestjs/common';
import { Quiz } from './entities/quiz.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateQuizInput } from './dto/create-quiz.input';
import { QuestionsService } from '../questions/questions.service';
import { CheckAnswersInput } from './dto/check-answers.input';
import { QuestionType } from '../questions/enums/question-type.enum';
import { Question } from '../questions/entities/question.entity';
import { CheckAnswersResponse } from './dto/check-answers.response';
import { Answer } from '../answers/entities/answer.entity';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz) private quizRepository: Repository<Quiz>,
    private readonly questionsService: QuestionsService,
    private readonly dataSource: DataSource,
  ) {}
  async findAll(): Promise<Quiz[]> {
    return this.quizRepository.find({
      relations: ['questions', 'questions.answers'],
    });
  }

  async findOne(id: string): Promise<Quiz> {
    const quiz = await this.quizRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ['questions', 'questions.answers'],
    });

    return {
      ...quiz,
      questions: quiz.questions.map((question) => {
        if (question.type === QuestionType.PlainText) {
          return { ...question, answers: [] };
        }
        return question;
      }),
    };
  }

  async createQuiz(createQuizInput: CreateQuizInput): Promise<Quiz> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const quiz = queryRunner.manager.create(Quiz, {
        name: createQuizInput.name,
        type: createQuizInput.type,
      });

      const response = await queryRunner.manager.save(quiz);

      await this.questionsService.createQuestions(
        createQuizInput.questions,
        response.id,
        queryRunner,
      );

      await queryRunner.commitTransaction();

      return response;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async checkAnswers(
    checkAnswersInput: CheckAnswersInput[],
  ): Promise<CheckAnswersResponse> {
    let totalPoints: number = 0;
    let pointsScored: number = 0;

    for (const checkAnswerInput of checkAnswersInput) {
      const question = await this.questionsService.findOne(
        checkAnswerInput.questionId,
      );

      totalPoints += this.calculateQuestionPoints(question);

      if (
        question.type === QuestionType.PlainText &&
        question.answers[0]?.name === checkAnswerInput.plainAnswerText
      ) {
        pointsScored++;
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
