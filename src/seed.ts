import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Profile } from './profiles/entities/profile.entity';
import { Author } from './authors/entities/author.entity';
import { Category } from './categories/entities/category.entity';
import { Book } from './books/entities/book.entity';
import { BookReview } from './book-reviews/entities/book-review.entity';
import * as bcrypt from 'bcryptjs';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [User, Profile, Author, Category, Book, BookReview],
    synchronize: true, // or true if you want to sync in dev
  });
  await dataSource.initialize();

  const usersRepository = dataSource.getRepository(User);
  const profilesRepository = dataSource.getRepository(Profile);
  const authorsRepository = dataSource.getRepository(Author);
  const categoriesRepository = dataSource.getRepository(Category);
  const booksRepository = dataSource.getRepository(Book);
  const bookReviewsRepository = dataSource.getRepository(BookReview);

  // --- SEED LOGIC ---
  console.log('Starting database seed...');

  // Seed Profiles
  const profile1 = await profilesRepository.save(profilesRepository.create({ bio: 'Loves reading thrillers.', avatar: 'avatar1.png', dateOfBirth: new Date('1990-05-15'), location: 'New York' }));
  const profile2 = await profilesRepository.save(profilesRepository.create({ bio: 'Sci-fi enthusiast.', avatar: 'avatar2.png', dateOfBirth: new Date('1985-10-20'), location: 'London' }));

  // Seed Users
  const hashedPassword1 = await bcrypt.hash('Password123!', 10);
  const user1 = await usersRepository.save(usersRepository.create({ name: 'Alice Wonderland', email: 'alice@example.com', password: hashedPassword1, profile: profile1, isActive: true }));
  const hashedPassword2 = await bcrypt.hash('SecurePass0!', 10);
  const user2 = await usersRepository.save(usersRepository.create({ name: 'Bob The Builder', email: 'bob@example.com', password: hashedPassword2, profile: profile2, isActive: true }));

  // Seed Authors
  const author1 = await authorsRepository.save(authorsRepository.create({ name: 'Jane Austen', bio: 'Renowned English novelist.', birthDate: new Date('1775-12-16'), isActive: true }));
  const author2 = await authorsRepository.save(authorsRepository.create({ name: 'George Orwell', bio: 'Famous for "1984" and "Animal Farm".', birthDate: new Date('1903-06-25'), isActive: true }));
  const author3 = await authorsRepository.save(authorsRepository.create({ name: 'Inactive Author', bio: 'Was once a writer.', birthDate: new Date('1950-01-01'), isActive: false }));

  // Seed Categories
  const category1 = await categoriesRepository.save(categoriesRepository.create({ name: 'Classic Literature', description: 'Timeless works of fiction.' }));
  const category2 = await categoriesRepository.save(categoriesRepository.create({ name: 'Dystopian Fiction', description: 'Explorations of societies gone wrong.' }));
  const category3 = await categoriesRepository.save(categoriesRepository.create({ name: 'Science Fiction', description: 'Futuristic and speculative tales.' }));

  // Seed Books
  const book1 = await booksRepository.save(booksRepository.create({ title: 'Pride and Prejudice', description: 'A romantic novel.', publicationYear: 1813, author: author1, categories: [category1], isAvailable: true }));
  const book2 = await booksRepository.save(booksRepository.create({ title: '1984', description: 'A dystopian novel.', publicationYear: 1949, author: author2, categories: [category2, category3], isAvailable: true }));
  const book3 = await booksRepository.save(booksRepository.create({ title: 'Animal Farm', description: 'An allegorical novella.', publicationYear: 1945, author: author2, categories: [category2], isAvailable: false }));
  const book4 = await booksRepository.save(booksRepository.create({ title: 'Sense and Sensibility', description: 'Another classic by Austen.', publicationYear: 1811, author: author1, categories: [category1], isAvailable: true }));

  // Seed Book Reviews
  await bookReviewsRepository.save(bookReviewsRepository.create({ content: 'A timeless classic, truly wonderful!', rating: 5, user: user1, book: book1 }));
  await bookReviewsRepository.save(bookReviewsRepository.create({ content: 'Thought-provoking and chilling.', rating: 5, user: user2, book: book2 }));
  await bookReviewsRepository.save(bookReviewsRepository.create({ content: 'A must-read for everyone.', rating: 4, user: user1, book: book2 }));

  await dataSource.destroy();
  console.log('Database seed completed.');
}

seed().catch((err) => {
  console.error('Seeding failed!', err);
  process.exit(1);
}); 