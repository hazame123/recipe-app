import { Entity, PrimaryColumn, Column, BeforeInsert, CreateDateColumn, UpdateDateColumn, OneToMany, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { Recipe } from 'src/recipes/entities/recipe.entity';
import { IsUUID } from 'class-validator';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') // Ensure the user ID is a UUID
  @IsUUID()
  userId: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Recipe, (recipe) => recipe.userId)
  recipes: Recipe[];

  @ManyToMany(() => Recipe)
  @JoinTable()
  favoriteRecipes: Recipe[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}