import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryRunner } from 'typeorm';
import { EntityManager } from 'typeorm';
import { AnswersService } from '../answers.service';
import { Answer } from '../entities/answer.entity';
import { CreateAnswerInput } from '../dto/create-answer.input';

describe('AnswersService', () => {
  let answersService: AnswersService;
  let queryRunnerMock: QueryRunner;

  beforeEach(async () => {
    queryRunnerMock = {
      manager: {
        create: jest.fn(),
        save: jest.fn(),
      },
    } as unknown as QueryRunner;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnswersService,
        {
          provide: getRepositoryToken(Answer),
          useClass: EntityManager,
        },
      ],
    }).compile();

    answersService = module.get<AnswersService>(AnswersService);
  });

  describe('createAnswer', () => {
    it('should create answers', async () => {
      const createAnswersInput: CreateAnswerInput[] = [
        { name: 'Apple', isCorrect: true } as CreateAnswerInput,
        { name: 'Orange', isCorrect: false } as CreateAnswerInput,
      ];

      const questionId = '1';

      await answersService.createAnswer(
        createAnswersInput,
        questionId,
        queryRunnerMock,
      );

      expect(queryRunnerMock.manager.create).toHaveBeenCalledWith(Answer, {
        name: 'Apple',
        isCorrect: true,
        questionId: '1',
        sortOrder: null,
      });

      expect(queryRunnerMock.manager.create).toHaveBeenCalledWith(Answer, {
        name: 'Orange',
        isCorrect: false,
        sortOrder: null,
        questionId: '1',
      });

      expect(queryRunnerMock.manager.save).toHaveBeenCalledTimes(2);
    });
  });
});
