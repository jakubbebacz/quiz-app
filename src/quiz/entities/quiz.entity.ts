import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from '../../questions/entities/question.entity';

@Entity()
@ObjectType()
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  type?: string;

  @OneToMany(() => Question, (question) => question.quiz)
  @Field(() => [Question])
  questions?: Question[];
}
