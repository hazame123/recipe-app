import { randomBytes } from "crypto";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { User } from "src/users/user.entity";

export type Ingredient = {
  name: string;
  unit: string;
  quantity: number;
}

@Entity('recipes')
export class Recipe {
  @PrimaryColumn({ type: 'varchar', length: 15 })
  recipeId: string;

  @ManyToOne(() => User, (user) => user.recipes, { onDelete: 'CASCADE' })
  @Column({ type: 'uuid' }) // Use UUID type for userId
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column("jsonb", { nullable: true })
  ingredients?: Ingredient[];

  @Column({ type: 'text', nullable: true })
  method?: string;

  @Column({ type: 'text', nullable: true })
  tips?: string;

  @Column("text", { array: true, nullable: true })
  inspirationLinks?: string[];

  @ManyToMany(() => User, (user) => user.favoriteRecipes)
  favoritedBy: User[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  generateRecipeId() {
  this.recipeId = this.generateUniqueId();
  }

  private generateUniqueId(): string {
  return randomBytes(10).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 15);
  }
}
