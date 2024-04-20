import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column('text')
    username: string;

    @Column('text')
    email: string;

    @Column('text')
    password: string;

    @Column('simple-array')
    preferences: string[];

    @Column('text')
    description: string;

    @Column('simple-array')
    tecnologies: string[];
}