import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

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

    @Column({ default: 'normal-user' })
    role: string

    // ? posts created

    // ? comments created

    // ? posts saveds

    // ? groups created

    // ? events created
}