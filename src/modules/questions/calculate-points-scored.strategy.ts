import { Question } from './entities/question.entity';
import { CheckAnswersInput } from './dto/check-answers.input';
import { Answer } from '../answers/entities/answer.entity';
import { QuestionType } from './enums/question-type.enum';
const findAnswerById = (question: Question, answerId: string): Answer =>
  question.answers.find((answer) => answer.id === answerId);

interface ICalculatePointsScoredStrategy {
  calculatePoints(
    question: Question,
    checkAnswerInput: CheckAnswersInput,
  ): number;
}

class PlainTextScoreStrategy implements ICalculatePointsScoredStrategy {
  calculatePoints(
    question: Question,
    checkAnswerInput: CheckAnswersInput,
  ): number {
    const trimmedAnswer = checkAnswerInput.plainAnswerText
      .replace(/\p{P}+/gu, '')
      .trim();
    return question.answers[0].name === trimmedAnswer ? 1 : 0;
  }
}

class SortingScoreStrategy implements ICalculatePointsScoredStrategy {
  calculatePoints(
    question: Question,
    checkAnswerInput: CheckAnswersInput,
  ): number {
    let pointsScored = 0;
    let sortNumber = 1;

    for (const answerId of checkAnswerInput.answerIds!) {
      const answer = findAnswerById(question, answerId);

      if (answer && answer.sortOrder === sortNumber) {
        pointsScored++;
      }
      sortNumber++;
    }

    return pointsScored;
  }
}

class SingleMultipleScoreStrategy implements ICalculatePointsScoredStrategy {
  calculatePoints(
    question: Question,
    checkAnswerInput: CheckAnswersInput,
  ): number {
    let pointsScored = 0;

    for (const answerId of checkAnswerInput.answerIds!) {
      const answer = findAnswerById(question, answerId);

      if (answer && answer.isCorrect) {
        pointsScored++;
      }
      if (
        question.type === QuestionType.Multiple &&
        answer &&
        !answer.isCorrect
      ) {
        pointsScored--;
      }
    }

    return pointsScored;
  }
}

export class CalculatePointsScoredContext {
  private strategyMap: Map<QuestionType, ICalculatePointsScoredStrategy>;

  constructor() {
    this.strategyMap = new Map();
    this.strategyMap.set(QuestionType.PlainText, new PlainTextScoreStrategy());
    this.strategyMap.set(QuestionType.Sorting, new SortingScoreStrategy());
    this.strategyMap.set(
      QuestionType.Single,
      new SingleMultipleScoreStrategy(),
    );
    this.strategyMap.set(
      QuestionType.Multiple,
      new SingleMultipleScoreStrategy(),
    );
  }

  calculatePointsScored(
    question: Question,
    checkAnswerInput: CheckAnswersInput,
  ): number {
    const strategy = this.strategyMap.get(question.type as QuestionType);
    return strategy ? strategy.calculatePoints(question, checkAnswerInput) : 0;
  }
}
