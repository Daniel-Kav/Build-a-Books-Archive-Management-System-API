import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookReview } from './entities/book-review.entity';
import { CreateBookReviewDto } from './dto/create-book-review.dto';
import { Book } from '../books/entities/book.entity';
import { User } from '../users/entities/user.entity';
import { UpdateBookReviewDto } from './dto/update-book-review.dto';

@Injectable()
export class BookReviewsService {
  constructor(
    @InjectRepository(BookReview)
    private bookReviewsRepository: Repository<BookReview>,
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

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

  async addReview(bookId: string, userId: string, createBookReviewDto: CreateBookReviewDto): Promise<BookReview> {
    const book = await this.booksRepository.findOneBy({ id: bookId });
    if (!book) {
      throw new NotFoundException(`Book with ID "${bookId}" not found.`);
    }
    if (!book.isAvailable) {
        throw new BadRequestException(`Book with ID "${bookId}" is not available for review.`);
    }

    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found.`); // Should not happen if user is authenticated
    }
     if (!user.isActive) {
        throw new BadRequestException(`User with ID "${userId}" is not active and cannot post reviews.`);
    }


    // Check if this user has already reviewed this book (optional business rule)
    const existingReview = await this.bookReviewsRepository.findOne({ where: { book: { id: bookId }, user: { id: userId } } });
    if (existingReview) {
        throw new ConflictException('You have already reviewed this book.');
    }


    const review = this.bookReviewsRepository.create({
      ...createBookReviewDto,
      book,
      user,
    });
    return this.bookReviewsRepository.save(review);
  }
}
