import { validate } from 'class-validator';
import { CreateAnswerInput } from '../dto/create-answer.input';

describe('CreateAnswerInput', () => {
  let createAnswerInput: CreateAnswerInput;

  beforeEach(() => {
    createAnswerInput = new CreateAnswerInput();
    createAnswerInput.name = 'A1';
  });

  it('should be valid when all properties are correct', async () => {
    createAnswerInput.isCorrect = true;

    const errors = await validate(createAnswerInput);
    expect(errors.length).toBe(0);
  });

  it('should be valid with required properties only', async () => {
    const errors = await validate(createAnswerInput);
    expect(errors.length).toBe(0);
  });

  it('should not be valid with sortOrder less than 1', async () => {
    createAnswerInput.sortOrder = 0;

    const errors = await validate(createAnswerInput);
    expect(errors.length).toBe(1);
  });

  it('should not be valid with sortOrder greater than 4', async () => {
    createAnswerInput.sortOrder = 5;

    const errors = await validate(createAnswerInput);
    expect(errors.length).toBe(1);
  });

  it('should not be valid with isCorrect and sortOrder fields both provided', async () => {
    createAnswerInput.isCorrect = false;
    createAnswerInput.sortOrder = 3;

    const errors = await validate(createAnswerInput);
    expect(errors.length).toBe(1);
  });
});
