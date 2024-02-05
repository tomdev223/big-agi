// Typeorm
// Typeorm
import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// Entities
import Date from './Date';
import Category from './Category';
// Generators & Validators
import { IsUUID } from 'class-validator';
// Constants, Helpers & Types
import { invalidIdentifier } from '../constants';

// Database name
@Entity('personas')
export default class Persona extends Date {
  constructor(persona: Partial<Persona>) {
    super();
    Object.assign(this, persona);
  }

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  systemMessage: string;

  @Column({ type: 'varchar' })
  symbol: string;

  @Column({ type: 'varchar', array: true, nullable: true })
  examples: string[];

  @Column({ type: 'json', nullable: true })
  call: {
    starters: string[];
  };

  @Column({ type: 'json', nullable: true })
  voices: {
    elevenLabs: {
      voiceId: string;
    };
    piper: {
      language: string;
      genre: string;
      modelName: string;
    }
  };

  @ManyToOne(() => Category, (category) => category.personas, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'category',
    referencedColumnName: 'id',
  })
  category: Partial<Category>;
}
