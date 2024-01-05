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

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  systemMessage: string;

  @Column({ type: 'text' })
  symbol: string;

  @Column({ type: 'text', nullable: true })
  category: string;

  @Column({ type: 'text', array: true, nullable: true })
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
  };
}
