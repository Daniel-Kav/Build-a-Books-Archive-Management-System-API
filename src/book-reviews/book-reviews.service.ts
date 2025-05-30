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

  async create(createBookReviewDto: CreateBookReviewDto) {
    const { bookId, userId, ...reviewData } = createBookReviewDto as any;
    const book = await this.booksRepository.findOneBy({ id: bookId });
    if (!book) {
      throw new NotFoundException(`Book with ID "${bookId}" not found.`);
    }
    if (!book.isAvailable) {
      throw new BadRequestException(`Book with ID "${bookId}" is not available for review.`);
    }
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }
    if (!user.isActive) {
      throw new BadRequestException(`User with ID "${userId}" is not active and cannot post reviews.`);
    }
    const existingReview = await this.bookReviewsRepository.findOne({ where: { book: { id: bookId }, user: { id: userId } } });
    if (existingReview) {
      throw new ConflictException('You have already reviewed this book.');
    }
    const review = this.bookReviewsRepository.create({ ...reviewData, book, user });
    return this.bookReviewsRepository.save(review);
  }

  async findAll() {
    return this.bookReviewsRepository.find({ relations: ['book', 'user'] });
  }

  async findOne(id: string) {
    const review = await this.bookReviewsRepository.findOne({ where: { id }, relations: ['book', 'user'] });
    if (!review) {
      throw new NotFoundException(`BookReview with ID "${id}" not found.`);
    }
    return review;
  }

  async update(id: string, updateBookReviewDto: UpdateBookReviewDto) {
    const review = await this.bookReviewsRepository.findOne({ where: { id }, relations: ['book', 'user'] });
    if (!review) {
      throw new NotFoundException(`BookReview with ID "${id}" not found.`);
    }
    Object.assign(review, updateBookReviewDto);
    return this.bookReviewsRepository.save(review);
  }

  async remove(id: string) {
    const result = await this.bookReviewsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`BookReview with ID "${id}" not found.`);
    }
    return { deleted: true };
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
