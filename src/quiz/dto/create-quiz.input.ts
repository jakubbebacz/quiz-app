import { Field, InputType } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

@InputType()
export class CreateQuizInput {
  @Field(() => String)
  name: string;

  @Field({ nullable: true })
  type?: string;
}
