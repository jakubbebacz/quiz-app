import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CheckAnswersResponse {
  @Field(() => Int)
  pointsScored: number;

  @Field(() => Int)
  totalPoints: number;
}
