import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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
}