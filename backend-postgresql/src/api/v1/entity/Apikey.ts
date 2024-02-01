// Typeorm
// Typeorm
import {
  Entity,
  Column,
  JoinColumn,
  OneToMany,
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// Entities
import Date from './Date';
import Persona from './Persona';
// Generators & Validators
import { IsUUID, Length } from 'class-validator';
// Constants, Helpers & Types
import { invalidIdentifier } from '../constants';

// Database name
@Entity('internal_api_keys')
export default class Category extends Date {
  constructor(category: Partial<Category>) {
    super();
    Object.assign(this, category);
  }

  @Column({ type: 'varchar' })
  apiname: string;

  @Column({ type: 'varchar' })
  key: string;
}
