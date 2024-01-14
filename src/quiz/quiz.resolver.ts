import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QuizService } from './quiz.service';
import { Quiz } from './entities/quiz.entity';
import { CreateQuizInput } from './dto/create-quiz.input';

@Resolver((of) => Quiz)
export class QuizResolver {
  constructor(private quizService: QuizService) {}

  @Query((returns) => [Quiz])
  quiz(): Promise<Quiz[]> {
    return this.quizService.findAll();
  }

  @Query((returns) => Quiz)
  getQuiz(@Args('id', { type: () => String }) id: string): Promise<Quiz> {
    return this.quizService.findOne(id);
  }

  @Mutation((returns) => Quiz)
  createQuiz(
    @Args('createQuizInput') createQuizInput: CreateQuizInput,
  ): Promise<Quiz> {
    return this.quizService.createQuiz(createQuizInput);
  }
}
