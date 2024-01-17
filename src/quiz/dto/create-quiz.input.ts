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
import { Transform, Type } from 'class-transformer';

@InputType()
export class CreateQuizInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value ? value.trim() : null))
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
