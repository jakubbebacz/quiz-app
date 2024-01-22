import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from '../../questions/entities/question.entity';

@Entity()
@ObjectType()
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column({ nullable: true })
  @Field(() => Boolean, { nullable: true })
  isCorrect: boolean;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  sortOrder: number;

  @Column()
  @Field()
  questionId: string;

  @ManyToOne(() => Question, (question) => question.answers)
  @Field(() => Question)
  question: Question;
}
