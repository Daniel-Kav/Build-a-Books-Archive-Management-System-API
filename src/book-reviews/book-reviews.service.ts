import { Injectable } from '@nestjs/common';
import { CreateBookReviewDto } from './dto/create-book-review.dto';
import { UpdateBookReviewDto } from './dto/update-book-review.dto';

@Injectable()
export class BookReviewsService {
  create(createBookReviewDto: CreateBookReviewDto) {
    return 'This action adds a new bookReview';
  }

  findAll() {
    return `This action returns all bookReviews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookReview`;
  }

  update(id: number, updateBookReviewDto: UpdateBookReviewDto) {
    return `This action updates a #${id} bookReview`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookReview`;
  }
}
