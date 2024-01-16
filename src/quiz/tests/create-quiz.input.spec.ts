import { CreateQuizInput } from '../dto/create-quiz.input';
import { validate } from 'class-validator';
import { QuestionType } from '../../questions/enums/question-type.enum';

describe('CreateQuizInput', () => {
  let createQuizInput: CreateQuizInput;

  beforeEach(() => {
    createQuizInput = new CreateQuizInput();
    createQuizInput.name = 'Quiz1';
    createQuizInput.description = 'Quiz1';
    createQuizInput.questions = [
      {
        name: 'Q1',
        type: QuestionType.Single,
        answers: [
          {
            name: 'A1',
            isCorrect: true,
          },
        ],
      },
    ];
  });

  it('should be valid when all properties are correct', async () => {
    const errors = await validate(createQuizInput);
    expect(errors.length).toBe(0);
  });

  it('should be invalid when name is empty', async () => {
    createQuizInput.name = '';

    const errors = await validate(createQuizInput);
    expect(errors.length).toBe(1);
  });

  it('should be invalid when questions table is empty', async () => {
    createQuizInput.questions = [];

    const errors = await validate(createQuizInput);
    expect(errors.length).toBe(1);
  });
});
