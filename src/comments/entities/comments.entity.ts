import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CommentEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column('text')
    comment: string

    
}