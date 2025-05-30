import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';
import { Book } from '../books/entities/book.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorsRepository: Repository<Author>,
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  create(createAuthorDto: CreateAuthorDto) {
    const author = this.authorsRepository.create(createAuthorDto);
    return this.authorsRepository.save(author);
  }

  findAll() {
    return this.authorsRepository.find();
  }

  findOne(id: string) {
    return this.authorsRepository.findOneBy({ id });
  }

  update(id: string, updateAuthorDto: UpdateAuthorDto) {
    return this.authorsRepository.update(id, updateAuthorDto);
  }

  remove(id: string) {
    return this.authorsRepository.delete(id);
  }

  async findBooksByAuthor(authorId: string): Promise<Book[]> {
    const author = await this.authorsRepository.findOneBy({ id: authorId });
    if (!author) {
      throw new NotFoundException(`Author with ID "${authorId}" not found.`);
    }
    if(!author.isActive) {
        throw new BadRequestException(`Author with ID "${authorId}" is not active.`);
    }

    return this.booksRepository.find({
      where: { author: { id: authorId }, isAvailable: true },
      relations: ['categories', 'author'],
    });
  }
}
