import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { QuizService } from './quiz.service';
import { Quiz } from './entities/quiz.entity';
import { CreateQuizInput } from './dto/create-quiz.input';
import { CheckAnswersInput } from '../questions/dto/check-answers.input';
import { CheckAnswersResponse } from '../questions/dto/check-answers.response';
import { QuestionsService } from '../questions/questions.service';

@Resolver(() => Quiz)
export class QuizResolver {
  constructor(
    private readonly quizService: QuizService,
    private readonly questionsService: QuestionsService,
  ) {}

  @Query(() => [Quiz])
  async quiz(): Promise<Quiz[]> {
    return this.quizService.findAll();
  }

  @Query(() => Quiz)
  async getQuiz(
    @Args('id', { type: () => String }) id: string,
    @Args('isCreated', {
      type: () => Boolean,
      nullable: true,
      defaultValue: false,
    })
    isCreated: boolean,
  ): Promise<Quiz> {
    return this.quizService.findOne(id, isCreated);
  }

  @Mutation(() => Quiz)
  async createQuiz(
    @Args('createQuizInput', { type: () => CreateQuizInput })
    createQuizInput: CreateQuizInput,
  ): Promise<Quiz> {
    return this.quizService.createQuiz(createQuizInput);
  }

  @Mutation(() => CheckAnswersResponse)
  async checkAnswers(
    @Args('checkAnswersInput', { type: () => [CheckAnswersInput] })
    checkAnswersInput: CheckAnswersInput[],
  ): Promise<CheckAnswersResponse> {
    return this.questionsService.checkAnswers(checkAnswersInput);
  }
}
