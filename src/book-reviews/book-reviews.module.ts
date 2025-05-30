import { Module } from '@nestjs/common';
import { BookReviewsService } from './book-reviews.service';
import { BookReviewsController } from './book-reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookReview } from './entities/book-review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookReview])],
  controllers: [BookReviewsController],
  providers: [BookReviewsService],
})
export class BookReviewsModule {}
