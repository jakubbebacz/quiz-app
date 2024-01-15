import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Quiz } from '../../quiz/entities/quiz.entity';
import { Answer } from '../../answers/entities/answer.entity';
import { QuestionType } from '../enums/question-type.enum';

@Entity()
@ObjectType()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column({
    type: 'enum',
    enum: QuestionType,
  })
  @Field(() => QuestionType)
  type: string;

  @Column()
  @Field()
  quizId: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions)
  @Field(() => Quiz)
  quiz: Quiz;

  @OneToMany(() => Answer, (answer) => answer.question)
  @Field(() => [Answer])
  answers?: Answer[];
}
