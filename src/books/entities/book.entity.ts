import { Author } from 'src/authors/entities/author.entity';
import { BookReview } from 'src/book-reviews/entities/book-review.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column('text')
  description: string;

  @Column()
  publicationYear: number; // Year

  @Column({ default: true })
  isAvailable: boolean;

  @ManyToOne(() => Author, author => author.books, { nullable: false }) // A book must have an author
  author: Author;

  @OneToMany(() => BookReview, bookReview => bookReview.book)
  reviews: BookReview[];

  @ManyToMany(() => Category, category => category.books)
  @JoinTable({ // This will create a book_categories_category table
    name: 'book_categories_category',
    joinColumn: { name: 'bookId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories: Category[];
}