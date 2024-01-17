import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { IsEitherDefined } from '../../common/decorators/is-either-defined.decorator';
import { Transform } from 'class-transformer';

@InputType()
export class CreateAnswerInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  name: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsEitherDefined()
  @IsBoolean()
  isCorrect?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(4)
  sortOrder?: number;
}
