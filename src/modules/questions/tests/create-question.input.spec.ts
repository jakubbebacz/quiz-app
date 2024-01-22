import { validate } from 'class-validator';
import { CreateQuestionInput } from '../dto/create-question.input';
import { CreateAnswerInput } from '../../answers/dto/create-answer.input';
import { QuestionType } from '../enums/question-type.enum';

describe('CreateQuestionInput', () => {
  let createQuestionInput: CreateQuestionInput;

  beforeEach(() => {
    createQuestionInput = new CreateQuestionInput();
    createQuestionInput.name = 'Q1';
    createQuestionInput.type = QuestionType.Single;
    createQuestionInput.answers = [
      {
        name: 'A1',
        isCorrect: true,
      } as CreateAnswerInput,
    ];
  });

  it('should be valid when all properties are correct', async () => {
    const errors = await validate(createQuestionInput);
    expect(errors.length).toBe(0);
  });

  it('should be invalid when name is empty', async () => {
    createQuestionInput.name = '';

    const errors = await validate(createQuestionInput);
    expect(errors.length).toBe(1);
  });

  it('should be invalid when type is not question type enum', async () => {
    createQuestionInput.type = 'compare';

    const errors = await validate(createQuestionInput);
    expect(errors.length).toBe(1);
  });

  it('should be invalid when answers array is empty', async () => {
    createQuestionInput.answers = [];

    const errors = await validate(createQuestionInput);
    expect(errors.length).toBe(1);
  });

  it('should be invalid when answers array has more than 4 answers', async () => {
    createQuestionInput.answers = [
      {
        name: 'A1',
        isCorrect: true,
      } as CreateAnswerInput,
      {
        name: 'A2',
        isCorrect: false,
      } as CreateAnswerInput,
      {
        name: 'A3',
        isCorrect: false,
      } as CreateAnswerInput,
      {
        name: 'A4',
        isCorrect: false,
      } as CreateAnswerInput,
      {
        name: 'A5',
        isCorrect: false,
      } as CreateAnswerInput,
    ];

    const errors = await validate(createQuestionInput);
    expect(errors.length).toBe(1);
  });
});
