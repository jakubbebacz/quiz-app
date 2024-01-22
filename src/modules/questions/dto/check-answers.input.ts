import { Field, InputType } from '@nestjs/graphql';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CheckAnswersInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  questionId: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each value in answerIds must be a string' })
  @ArrayMaxSize(4, { message: 'At most 4 answers can be provided' })
  answerIds?: string[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  plainAnswerText?: string;
}
