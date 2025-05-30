import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
    return this.bookReviewsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookReviewDto: UpdateBookReviewDto) {
    return this.bookReviewsService.update(+id, updateBookReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookReviewsService.remove(+id);
  }
}
