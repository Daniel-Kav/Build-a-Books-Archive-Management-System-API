import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Book } from '../books/entities/book.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto) {
    const category = this.categoriesRepository.create(createCategoryDto);
    try {
      return await this.categoriesRepository.save(category);
    } catch (error) {
      if (error.code === '23505') { // PostgreSQL unique violation
        throw new ConflictException('Category name must be unique');
      }
      throw error;
    }
  }

  findAll() {
    return this.categoriesRepository.find();
  }

  findOne(id: string) {
    return this.categoriesRepository.findOneBy({ id });
  }

  update(id: string, updateCategoryDto) {
    return this.categoriesRepository.update(id, updateCategoryDto);
  }

  remove(id: string) {
    return this.categoriesRepository.delete(id);
  }

  async findBooksInCategory(categoryId: string): Promise<Book[]> {
    const categoryWithBooks = await this.categoriesRepository.findOne({
      where: { id: categoryId },
      relations: ['books', 'books.author'],
    });

    if (!categoryWithBooks) {
      throw new NotFoundException(`Category with ID "${categoryId}" not found.`);
    }
    return categoryWithBooks.books.filter(book => book.isAvailable);
  }
}
