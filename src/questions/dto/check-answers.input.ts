import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CheckAnswersInput {
  @Field(() => String)
  questionId: string;

  @Field(() => [String], { nullable: true })
  answerIds?: string[];

  @Field(() => String, { nullable: true })
  plainAnswerText?: string;
}
