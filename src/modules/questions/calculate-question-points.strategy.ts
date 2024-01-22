import { Question } from './entities/question.entity';
import { QuestionType } from './enums/question-type.enum';

interface ICalculateQuestionPointsStrategy {
  calculateQuestionPoints(question: Question): number;
}

class CalculateSinglePointsStrategy
  implements ICalculateQuestionPointsStrategy
{
  calculateQuestionPoints(): number {
    return 1;
  }
}

class CalculateMultiplePointsStrategy
  implements ICalculateQuestionPointsStrategy
{
  calculateQuestionPoints(question: Question): number {
    return question.answers.filter((answer) => answer.isCorrect).length;
  }
}

class CalculateSortingPointsStrategy
  implements ICalculateQuestionPointsStrategy
{
  calculateQuestionPoints(question: Question): number {
    return question.answers.length;
  }
}

class CalculatePlainTextPointsStrategy
  implements ICalculateQuestionPointsStrategy
{
  calculateQuestionPoints(): number {
    return 1;
  }
}

export class CalculateQuestionPointsContext {
  private strategyMap: Map<QuestionType, ICalculateQuestionPointsStrategy>;

  constructor() {
    this.strategyMap = new Map();
    this.strategyMap.set(
      QuestionType.Single,
      new CalculateSinglePointsStrategy(),
    );
    this.strategyMap.set(
      QuestionType.Multiple,
      new CalculateMultiplePointsStrategy(),
    );
    this.strategyMap.set(
      QuestionType.Sorting,
      new CalculateSortingPointsStrategy(),
    );
    this.strategyMap.set(
      QuestionType.PlainText,
      new CalculatePlainTextPointsStrategy(),
    );
  }

  calculateQuestionPoints(question: Question): number {
    const strategy = this.strategyMap.get(question.type as QuestionType);
    if (strategy) {
      return strategy.calculateQuestionPoints(question);
    }
    return 0;
  }
}
