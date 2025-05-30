import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity('book_reviews')
export class BookReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column('int') // "numeric" usually means can have decimals, but rating is 1-5 int
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.reviews, { nullable: false }) // A review must have a user
  user: User;

  @ManyToOne(() => Book, book => book.reviews, { nullable: false }) // A review must be for a book
  book: Book;
}