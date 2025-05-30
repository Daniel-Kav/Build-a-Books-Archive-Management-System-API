import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs'; 
import { Profile } from '../profiles/entities/profile.entity'; 

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Profile) // Inject if creating profile with user
    private profilesRepository: Repository<Profile>,
  ) {}

  async create(createUserDto: CreateUserDto/*, createProfileDto?: CreateProfileDto*/): Promise<User> {
    const { email, password, name } = createUserDto;

    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const existingUserName = await this.usersRepository.findOne({ where: { name }});
    if (existingUserName) {
      // As per doc User Entity name is unique, but Profile entity does not specify this.
      // This check implements unique user name. [cite: 7]
      throw new ConflictException('Username already exists');
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // If profile is created simultaneously (optional, depends on flow)
    // if (createProfileDto) {
    //   const profile = this.profilesRepository.create(createProfileDto);
    //   await this.profilesRepository.save(profile);
    //   user.profile = profile;
    // } else {
         // Create a default empty profile if a user must have one
         const defaultProfile = this.profilesRepository.create({});
         await this.profilesRepository.save(defaultProfile);
         user.profile = defaultProfile;
    // }


    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      // Catch unique constraint errors (e.g. if email check somehow missed)
      if (error.code === '23505') { // PostgreSQL unique violation
        throw new ConflictException('Email or Username already exists.');
      }
      throw error;
    }
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['profile', 'reviews'] }); // Eager load relations if needed
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id }, relations: ['profile', 'reviews'] });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // reusing findOne to handle not found

    if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.usersRepository.findOne({ where: { email: updateUserDto.email } });
        if (existingUser) {
            throw new ConflictException('New email already in use.');
        }
    }
    if (updateUserDto.name && updateUserDto.name !== user.name) {
        const existingUser = await this.usersRepository.findOne({ where: { name: updateUserDto.name } });
        if (existingUser) {
            throw new ConflictException('New username already in use.');
        }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Merge the existing user with the new data.
    // This only updates fields present in updateUserDto.
    this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }
}