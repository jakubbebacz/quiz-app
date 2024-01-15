import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QuizService } from './quiz.service';
import { Quiz } from './entities/quiz.entity';
import { CreateQuizInput } from './dto/create-quiz.input';
import { CheckAnswersInput } from './dto/check-answers.input';
import { CheckAnswersResponse } from './dto/check-answers.response';

@Resolver(() => Quiz)
export class QuizResolver {
  constructor(private quizService: QuizService) {}

  @Query(() => [Quiz])
  quiz(): Promise<Quiz[]> {
    return this.quizService.findAll();
  }

  @Query(() => Quiz)
  getQuiz(@Args('id', { type: () => String }) id: string): Promise<Quiz> {
    return this.quizService.findOne(id);
  }

  @Mutation(() => Quiz)
  createQuiz(
    @Args('createQuizInput') createQuizInput: CreateQuizInput,
  ): Promise<Quiz> {
    return this.quizService.createQuiz(createQuizInput);
  }

  @Mutation(() => CheckAnswersResponse)
  checkAnswers(
    @Args('checkAnswersInput', { type: () => [CheckAnswersInput] })
    checkAnswersInput: CheckAnswersInput[],
  ): Promise<CheckAnswersResponse> {
    return this.quizService.checkAnswers(checkAnswersInput);
  }
}
