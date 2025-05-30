import { Book } from 'src/books/entities/book.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column('text', { nullable: true })
  bio: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ default: true })
  isActive: boolean;
  @OneToMany(() => Book, book => book.author)
  books: Book[];
}