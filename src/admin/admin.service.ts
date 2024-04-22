import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/posts/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,

        @InjectRepository(PostEntity)
        private postRepository: Repository<PostEntity>
    ) { }

    async renderUsersWithPosts() {
        const findPosts = await this.userRepository.find({
            relations: ['posts', 'comments'],
        })

        console.log(findPosts);

        let p = findPosts.filter((post) => post.posts.length >= 1)

        return p
    }

    async renderUsers() {
        const findPosts = await this.userRepository.find({
            relations: ['posts', 'comments'],
        })

        // console.log(findPosts);

        // let p = findPosts.filter((post) => post.posts.length >= 1)

        return findPosts
    }

}
