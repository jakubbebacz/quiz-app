import { QuestionsService } from '../questions.service';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { Question } from '../entities/question.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AnswersService } from '../../answers/answers.service';
import { QuestionType } from '../enums/question-type.enum';
import { Answer } from '../../answers/entities/answer.entity';
import { CheckAnswersInput } from '../dto/check-answers.input';
import { CreateQuestionInput } from '../dto/create-question.input';
import { CreateAnswerInput } from '../../answers/dto/create-answer.input';

describe('QuestionsService', () => {
  let questionsService: QuestionsService;
  let answersService: AnswersService;
  let questionsRepository: Repository<Question>;
  let queryRunnerMock: QueryRunner;

  const questionsRepositoryToken = getRepositoryToken(Question);

  beforeEach(async () => {
    queryRunnerMock = {
      manager: {
        create: jest.fn(),
        save: jest.fn(),
      },
    } as unknown as QueryRunner;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        AnswersService,
        {
          provide: questionsRepositoryToken,
          useClass: Repository,
        },
        {
          provide: questionsRepositoryToken,
          useClass: EntityManager,
        },
      ],
    }).compile();

    questionsService = module.get<QuestionsService>(QuestionsService);
    answersService = module.get<AnswersService>(AnswersService);
    questionsRepository = module.get<Repository<Question>>(
      questionsRepositoryToken,
    );
  });

  it('should be defined', () => {
    expect(questionsService).toBeDefined();
  });

  describe('createQuestions', () => {
    it('should create questions and answers', async () => {
      const createQuestionsInput: CreateQuestionInput[] = [
        {
          name: 'Choose all correct answers. What is a mouse?',
          type: QuestionType.Multiple,
          answers: [
            { name: 'An animal', isCorrect: true } as CreateAnswerInput,
            { name: 'A device', isCorrect: true } as CreateAnswerInput,
            { name: 'A car', isCorrect: false } as CreateAnswerInput,
          ],
        },
        {
          name: 'What is the capital city of Poland',
          type: QuestionType.PlainText,
          answers: [{ name: 'Warsaw' } as CreateAnswerInput],
        },
      ];

      const quizId = '1';

      jest
        .spyOn(queryRunnerMock.manager, 'save')
        .mockResolvedValue({ id: '1' });

      jest.spyOn(answersService, 'createAnswer').mockResolvedValue();

      await questionsService.createQuestions(
        createQuestionsInput,
        quizId,
        queryRunnerMock,
      );

      expect(queryRunnerMock.manager.create).toHaveBeenCalledTimes(2);
      expect(queryRunnerMock.manager.save).toHaveBeenCalledTimes(2);
      expect(answersService.createAnswer).toHaveBeenCalledTimes(2);
    });
  });

  describe('checkAnswers', () => {
    it('should return object with points scored and total points for single question type', async () => {
      const checkAnswersInput: CheckAnswersInput[] = [
        {
          questionId: '1',
          answerIds: ['1'],
        },
      ];

      jest
        .spyOn(questionsRepository, 'findOneOrFail')
        .mockResolvedValue(sampleQuestions[0]);

      const result = await questionsService.checkAnswers(checkAnswersInput);
      expect(result.pointsScored).toEqual(1);
      expect(result.totalPoints).toEqual(1);
    });

    it('should return object with points scored and total points for multiple question type', async () => {
      const checkAnswersInput: CheckAnswersInput[] = [
        {
          questionId: '2',
          answerIds: ['3', '4'],
        },
      ];

      jest
        .spyOn(questionsRepository, 'findOneOrFail')
        .mockResolvedValue(sampleQuestions[1]);

      const result = await questionsService.checkAnswers(checkAnswersInput);
      expect(result.pointsScored).toEqual(2);
      expect(result.totalPoints).toEqual(2);
    });
  });

  it('should return object with points scored and total points for sorting question type', async () => {
    const checkAnswersInput: CheckAnswersInput[] = [
      {
        questionId: '3',
        answerIds: ['6', '8', '7', '5'],
      },
    ];

    jest
      .spyOn(questionsRepository, 'findOneOrFail')
      .mockResolvedValue(sampleQuestions[2]);

    const result = await questionsService.checkAnswers(checkAnswersInput);
    expect(result.pointsScored).toEqual(2);
    expect(result.totalPoints).toEqual(4);
  });

  it('should return object with points scored and total points for plain text question type', async () => {
    const checkAnswersInput: CheckAnswersInput[] = [
      {
        questionId: '4',
        plainAnswerText: '1919',
      },
    ];

    jest
      .spyOn(questionsRepository, 'findOneOrFail')
      .mockResolvedValue(sampleQuestions[3]);

    const result = await questionsService.checkAnswers(checkAnswersInput);
    expect(result.pointsScored).toEqual(0);
    expect(result.totalPoints).toEqual(1);
  });

  const sampleQuestions: Question[] = [
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
      quizId: '1',
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
      quizId: '1',
    } as Question,
    {
      id: '3',
      name: 'Sort those events in chronological order starting from the newest',
      type: QuestionType.Sorting,
      answers: [
        {
          id: '5',
          name: 'Muhammad died',
          sortOrder: 1,
          questionId: '3',
        } as Answer,
        {
          id: '6',
          name: 'French Revolution',
          sortOrder: 4,
          questionId: '3',
        } as Answer,
        {
          id: '7',
          name: 'The Great Fire of London',
          sortOrder: 3,
          questionId: '3',
        } as Answer,
        {
          id: '8',
          name: 'Vasco da Gama arrived India',
          sortOrder: 2,
          questionId: '3',
        } as Answer,
      ],
      quizId: '1',
    } as Question,
    {
      id: '4',
      name: 'In which year did World War I end?',
      type: QuestionType.PlainText,
      answers: [
        {
          id: '9',
          name: '1918',
          questionId: '1',
        } as Answer,
      ],
      quizId: '1',
    } as Question,
  ];
});
