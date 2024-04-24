import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FollowingEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    // tomar los id de los usuarios que siga la persona 
    @Column('int')
    usersFollowing: number

    @ManyToOne(() => UserEntity, user => user.following)
    user: UserEntity
}