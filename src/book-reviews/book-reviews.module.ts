import { Module } from '@nestjs/common';
import { BookReviewsService } from './book-reviews.service';
import { BookReviewsController } from './book-reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookReview } from './entities/book-review.entity';
import { Book } from '../books/entities/book.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookReview, Book, User])],
  controllers: [BookReviewsController],
  providers: [BookReviewsService],
})
export class BookReviewsModule {}
