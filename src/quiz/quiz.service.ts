import { Injectable } from '@nestjs/common';
import { Quiz } from './entities/quiz.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateQuizInput } from './dto/create-quiz.input';
import { QuestionsService } from '../questions/questions.service';
import { QuestionType } from '../questions/enums/question-type.enum';

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
}
