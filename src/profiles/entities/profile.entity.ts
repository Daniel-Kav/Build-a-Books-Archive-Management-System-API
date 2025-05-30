import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatar: string; // URL

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  location: string;

  @OneToOne(() => User, user => user.profile)
  // No @JoinColumn() here, it's on the owning side (User)
  user: User;
}