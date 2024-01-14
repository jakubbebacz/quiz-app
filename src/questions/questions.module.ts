import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { AnswersService } from '../answers/answers.service';

@Module({
  providers: [QuestionsService, AnswersService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
