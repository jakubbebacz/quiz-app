import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizResolver } from './quiz.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { QuestionsModule } from '../questions/questions.module';
import { QuestionsService } from '../questions/questions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz]), QuestionsModule],
  providers: [QuizService, QuizResolver],
})
export class QuizModule {}
