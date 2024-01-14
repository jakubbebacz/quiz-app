import { Field, InputType } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';
import { CreateQuestionInput } from '../../questions/dto/create-question.input';

@InputType()
export class CreateQuizInput {
  @Field(() => String)
  name: string;

  @Field({ nullable: true })
  type?: string;

  @Field(() => [CreateQuestionInput])
  questions: CreateQuestionInput[];
}
