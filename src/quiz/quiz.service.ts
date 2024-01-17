import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Quiz } from './entities/quiz.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateQuizInput } from './dto/create-quiz.input';
import { QuestionsService } from '../questions/questions.service';
import { QuestionType } from '../questions/enums/question-type.enum';
import { errorContext } from 'rxjs/internal/util/errorContext';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz) private quizRepository: Repository<Quiz>,
    private readonly questionsService: QuestionsService,
    private readonly dataSource: DataSource,
  ) {}
  async findAll(): Promise<Quiz[]> {
    try {
      return this.quizRepository.find();
    } catch (err) {
      throw new HttpException(err.messageerror, err.status);
    }
  }

  async findOne(quizId: string, isCreated: boolean): Promise<Quiz> {
    try {
      const quiz = await this.quizRepository.findOneOrFail({
        where: {
          id: quizId,
        },
        relations: ['questions', 'questions.answers'],
      });

      if (isCreated) {
        return quiz;
      }

      return {
        ...quiz,
        questions: quiz.questions.map((question) => {
          if (question.type === QuestionType.PlainText) {
            return { ...question, answers: [] };
          }
          return question;
        }),
      };
    } catch (err) {
      if (err.name === 'EntityNotFoundError') {
        throw new NotFoundException(`Quiz with ${quizId} was not found`);
      }

      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createQuiz(createQuizInput: CreateQuizInput): Promise<Quiz> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const quiz = queryRunner.manager.create(Quiz, {
        name: createQuizInput.name,
        description: createQuizInput.description,
      });

      const createdQuiz = await queryRunner.manager.save(quiz);

      await this.questionsService.createQuestions(
        createQuizInput.questions,
        createdQuiz.id,
        queryRunner,
      );

      await queryRunner.commitTransaction();

      return this.findOne(createdQuiz.id, true);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }
}
