
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
@Entity('voice_model')
export default class VoiceModel extends Date {
  constructor(voiceModel: Partial<VoiceModel>) {
    super();
    Object.assign(this, voiceModel);
  }

  @Column({ type: 'varchar', nullable: false })
  language: string;

  @Column({ type: 'varchar', nullable: true })
  genre: string;

  @Column({ type: 'varchar', nullable: false })
  voiceName: string;
}
