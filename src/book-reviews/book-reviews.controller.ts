import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { BookReviewsService } from './book-reviews.service';
import { CreateBookReviewDto } from './dto/create-book-review.dto';
import { UpdateBookReviewDto } from './dto/update-book-review.dto';

@Controller('book-reviews')
export class BookReviewsController {
  constructor(private readonly bookReviewsService: BookReviewsService) {}

  @Post()
  create(@Body() createBookReviewDto: CreateBookReviewDto) {
    return this.bookReviewsService.create(createBookReviewDto);
  }

  @Get()
  findAll() {
    return this.bookReviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookReviewsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookReviewDto: UpdateBookReviewDto) {
    return this.bookReviewsService.update(id, updateBookReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookReviewsService.remove(id);
  }

  @Post('books/:bookId/reviews')
  @HttpCode(HttpStatus.CREATED)
  async addReviewToBook(
    @Param('bookId', ParseUUIDPipe) bookId: string,
    @Body() createBookReviewDto: CreateBookReviewDto,
  ) {
    const tempUserId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    return this.bookReviewsService.addReview(bookId, tempUserId, createBookReviewDto);
  }
}
