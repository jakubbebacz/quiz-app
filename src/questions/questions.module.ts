import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { AnswersService } from '../answers/answers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  providers: [QuestionsService, AnswersService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
