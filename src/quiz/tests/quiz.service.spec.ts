import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Quiz } from '../entities/quiz.entity';
import { QuizService } from '../quiz.service';
import { QuestionsService } from '../../questions/questions.service';
import { Question } from '../../questions/entities/question.entity';
import { AnswersService } from '../../answers/answers.service';
import { Answer } from '../../answers/entities/answer.entity';
import { QuestionType } from '../../questions/enums/question-type.enum';
import { CreateQuizInput } from '../dto/create-quiz.input';
import { CreateQuestionInput } from '../../questions/dto/create-question.input';
import { CreateAnswerInput } from '../../answers/dto/create-answer.input';
import { dataSourceMock } from '../../common/mock.datasource';

describe('QuizService', () => {
  let quizService: QuizService;
  let quizRepository: Repository<Quiz>;
  let questionsService: QuestionsService;

  const quizRepositoryToken = getRepositoryToken(Quiz);
  const questionsRepositoryToken = getRepositoryToken(Question);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizService,
        QuestionsService,
        AnswersService,
        {
          provide: quizRepositoryToken,
          useClass: Repository,
        },
        {
          provide: questionsRepositoryToken,
          useClass: Repository,
        },
        {
          provide: DataSource,
          useFactory: dataSourceMock,
        },
      ],
    }).compile();

    quizService = module.get<QuizService>(QuizService);
    questionsService = module.get<QuestionsService>(QuestionsService);
    quizRepository = module.get<Repository<Quiz>>(quizRepositoryToken);
  });

  it('should be defined', () => {
    expect(quizService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of quizzes with questions and answers', async () => {
      jest.spyOn(quizRepository, 'find').mockResolvedValue(sampleQuizzes);

      const result = await quizService.findAll();

      expect(result).toEqual(sampleQuizzes);
    });
  });

  describe('findOne', () => {
    it('should return a quiz with questions and answers', async () => {
      const quizId = '1';

      jest
        .spyOn(quizRepository, 'findOneOrFail')
        .mockResolvedValue(sampleQuizzes[0]);

      const result = await quizService.findOne(quizId);

      expect(result).toEqual(sampleQuizzes[0]);
    });
  });

  describe('createQuiz', () => {
    it('should create a new quiz with questions and answers', async () => {
      const createQuizInput: CreateQuizInput = {
        name: 'General knowledge',
        type: '123',
        questions: [
          {
            name: 'What color is a plum',
            type: QuestionType.Single,
            answers: [
              {
                name: 'purple',
                isCorrect: true,
              } as CreateAnswerInput,
              {
                name: 'white',
                isCorrect: false,
              } as CreateAnswerInput,
            ],
          } as CreateQuestionInput,
          {
            name: 'What color is an apple',
            type: QuestionType.Multiple,
            answers: [
              {
                name: 'red',
                isCorrect: true,
              } as CreateAnswerInput,
              {
                name: 'green',
                isCorrect: true,
              } as CreateAnswerInput,
            ],
          },
        ],
      };

      jest.spyOn(questionsService, 'createQuestions').mockResolvedValue();

      const result = await quizService.createQuiz(createQuizInput);

      expect(result).toEqual(sampleQuizzes[0]);
    });
  });
});

const sampleQuizzes: Quiz[] = [
  {
    id: '1',
    name: 'General knowledge',
    questions: [
      {
        id: '1',
        name: 'What color is a plum',
        type: QuestionType.Single,
        answers: [
          {
            id: '1',
            name: 'purple',
            isCorrect: true,
            questionId: '1',
          } as Answer,
          {
            id: '2',
            name: 'white',
            isCorrect: false,
            questionId: '1',
          } as Answer,
        ],
      } as Question,
      {
        id: '2',
        name: 'What color is an apple',
        type: QuestionType.Multiple,
        answers: [
          {
            id: '3',
            name: 'red',
            isCorrect: true,
            questionId: '2',
          } as Answer,
          {
            id: '4',
            name: 'green',
            isCorrect: true,
            questionId: '2',
          } as Answer,
        ],
      } as Question,
    ],
  },
];
