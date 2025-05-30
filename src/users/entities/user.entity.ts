import { BookReview } from 'src/book-reviews/entities/book-review.entity';
import { Profile } from 'src/profiles/entities/profile.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  name: string; // "Unique user name" - though name might not be unique, email usually is. Let's stick to the doc for now.

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Will be hashed

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  @OneToOne(() => Profile, profile => profile.user, { cascade: true }) // cascade for easier creation/deletion
  @JoinColumn() // User entity will have profileId column
  profile: Profile;

  @OneToMany(() => BookReview, bookReview => bookReview.user)
  reviews: BookReview[];
}