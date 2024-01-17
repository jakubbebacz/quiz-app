import { InputType, Field } from '@nestjs/graphql';
import { QuestionType } from '../enums/question-type.enum';
import { CreateAnswerInput } from '../../answers/dto/create-answer.input';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

@InputType()
export class CreateQuestionInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  name: string;

  @Field(() => QuestionType)
  @IsNotEmpty()
  @IsString()
  @IsEnum(QuestionType, { message: 'Invalid question type' })
  @Transform(({ value }) => value.trim())
  type: string;

  @Field(() => [CreateAnswerInput])
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1, { message: 'At least 1 answer has to be provided' })
  @ArrayMaxSize(4, { message: 'At most 4 answers can be provided' })
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerInput)
  answers: CreateAnswerInput[];
}
