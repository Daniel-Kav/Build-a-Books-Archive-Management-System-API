import { Book } from 'src/books/entities/book.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 }) // No unique constraint mentioned for name here, but it's in validation [cite: 11]
  name: string;

  @Column('text', { nullable: true })
  description: string;
  
  @ManyToMany(() => Book, book => book.categories)
  books: Book[];
}