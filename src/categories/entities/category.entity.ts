import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 }) // No unique constraint mentioned for name here, but it's in validation [cite: 11]
  name: string;

  @Column('text', { nullable: true })
  description: string;
}