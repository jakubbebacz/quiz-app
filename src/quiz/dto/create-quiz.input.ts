import { Field, InputType } from '@nestjs/graphql';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateQuestionInput } from '../../questions/dto/create-question.input';
import { Type } from 'class-transformer';

@InputType()
export class CreateQuizInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => [CreateQuestionInput])
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1, { message: 'At least 1 question has to be provided' })
  @ArrayMaxSize(20, { message: 'At most 20 questions can be provided' })
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionInput)
  questions: CreateQuestionInput[];
}
