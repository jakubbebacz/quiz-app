import { InputType, Field } from '@nestjs/graphql';
import { QuestionType } from '../../helpers/question-type.enum';
import { CreateAnswerInput } from '../../answers/dto/create-answer.input';

@InputType()
export class CreateQuestionInput {
  @Field(() => String)
  name: string;

  @Field(() => QuestionType)
  type: string;

  @Field(() => [CreateAnswerInput])
  answers: CreateAnswerInput[];
}
