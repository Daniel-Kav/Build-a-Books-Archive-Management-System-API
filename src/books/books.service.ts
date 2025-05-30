import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, ILike } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Author } from '../authors/entities/author.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(Author)
    private authorsRepository: Repository<Author>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const { authorId, categoryIds, ...bookData } = createBookDto;

    const author = await this.authorsRepository.findOneBy({ id: authorId });
    if (!author) {
      throw new NotFoundException(`Author with ID "${authorId}" not found.`);
    }
    if (!author.isActive) {
        throw new BadRequestException(`Author with ID "${authorId}" is not active.`);
    }

    let categories: Category[] = [];
    if (categoryIds && categoryIds.length > 0) {
      categories = await this.categoriesRepository.findBy({ id: In(categoryIds) });
      if (categories.length !== categoryIds.length) {
        throw new NotFoundException('One or more categories not found.');
      }
    }

    const book = this.booksRepository.create({
      ...bookData,
      author,
      categories,
    });
    return this.booksRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    return this.booksRepository.find();
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.booksRepository.findOne({ where: { id }, relations: ['author', 'categories'] });
    if (!book) {
      throw new NotFoundException(`Book with ID "${id}" not found.`); 
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.booksRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException(`Book with ID "${id}" not found.`);
    }
    await this.booksRepository.update(id, updateBookDto);
    return this.booksRepository.findOneBy({ id });
  }

  async remove(id: string) {
    const book = await this.booksRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException(`Book with ID "${id}" not found.`);
    }
    await this.booksRepository.delete(id);
    return { deleted: true };
  }

  async searchBooks(params: { title?: string; authorName?: string; categoryName?: string }) {
    const queryBuilder = this.booksRepository.createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author')
      .leftJoinAndSelect('book.categories', 'category');
  
    if (params.title) {
      queryBuilder.andWhere('book.title ILIKE :title', { title: `%${params.title}%` });
    }
    if (params.authorName) {
      queryBuilder.andWhere('author.name ILIKE :authorName', { authorName: `%${params.authorName}%` });
    }
    if (params.categoryName) {
      queryBuilder.andWhere('category.name ILIKE :categoryName', { categoryName: `%${params.categoryName}%` });
    }
  
    queryBuilder.andWhere('book.isAvailable = :isAvailable', { isAvailable: true });
  
    return queryBuilder.getMany();
  }
}