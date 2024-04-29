import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BookmarkEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    // tomar los id de los posts de los usuarios que siga la persona 
    @Column('int')
    idBookmarks: number

    @ManyToOne(() => UserEntity, user => user.bookmarks)
    user: UserEntity
}