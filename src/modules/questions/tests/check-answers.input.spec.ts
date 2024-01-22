import { validate } from 'class-validator';
import { CheckAnswersInput } from '../dto/check-answers.input';

describe('CheckAnswersInput', () => {
  it('should be valid when all properties are correct', async () => {
    const checkAnswersInput = new CheckAnswersInput();
    checkAnswersInput.questionId = '1';
    checkAnswersInput.answerIds = ['A1', 'A2'];

    const errors = await validate(checkAnswersInput);

    expect(errors.length).toBe(0);
  });

  it('should be invalid when questionId field is empty', async () => {
    const checkAnswersInput = new CheckAnswersInput();
    checkAnswersInput.answerIds = ['A1', 'A2'];

    const errors = await validate(checkAnswersInput);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });
});
