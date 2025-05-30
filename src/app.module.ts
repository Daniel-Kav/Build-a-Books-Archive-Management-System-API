import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'config/db.config';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { CategoriesModule } from './categories/categories.module';
import { BookReviewsModule } from './book-reviews/book-reviews.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    ProfilesModule,
    AuthorsModule,
    BooksModule,
    CategoriesModule,
    BookReviewsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
