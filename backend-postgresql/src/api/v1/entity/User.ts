// Typeorm
import { Entity, Column, BeforeInsert, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
// Generators & Validators
import argon2 from 'argon2';
import { IsEmail, Length, Matches } from 'class-validator';
// Entitiess
import Date from './Date';

// Database name
@Entity('users')
export default class User extends Date {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Column({ length: 100, unique: true })
  @IsEmail({}, { message: 'Email is invalid.' })
  email: string;

  @Column('varchar', { length: 25, unique: true })
  @Length(3, 25, { message: 'Username must be between 3 to 25 characters long.' })
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'Username should contain only letters and numbers.' })
  username: string;

  @Column('varchar', { length: 256, select: false })
  @Length(6, 256, { message: 'Password must be at least 6 characters long.' })
  password: string;

  @BeforeInsert()
  protected async beforeInsert() {
    // name and email to lowercase
    this.username = this.username.toLowerCase();
    this.email = this.email.toLowerCase();
    // hash password before save;
    this.password = await argon2.hash(this.password);
  }
}
