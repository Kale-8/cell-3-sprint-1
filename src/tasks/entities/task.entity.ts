import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'completed';

  @ManyToOne(() => User, user => user.tasks, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


