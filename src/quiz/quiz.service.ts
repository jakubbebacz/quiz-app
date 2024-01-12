import { Injectable } from '@nestjs/common';
import { Quiz } from './quiz.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuizInput } from './dto/create-quiz.input';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz) private quizRepository: Repository<Quiz>,
  ) {}
  async findAll(): Promise<Quiz[]> {
    return this.quizRepository.find();
  }

  async findOne(id: number): Promise<Quiz> {
    return this.quizRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  async createQuiz(createQuizInput: CreateQuizInput): Promise<Quiz> {
    const newQuiz = this.quizRepository.create(createQuizInput);

    return this.quizRepository.save(newQuiz);
  }
}
