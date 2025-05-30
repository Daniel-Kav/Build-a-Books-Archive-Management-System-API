import { Module } from '@nestjs/common';
import { BookReviewsService } from './book-reviews.service';
import { BookReviewsController } from './book-reviews.controller';

@Module({
  controllers: [BookReviewsController],
  providers: [BookReviewsService],
})
export class BookReviewsModule {}
