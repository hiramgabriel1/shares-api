import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PostDto } from './dto/create.post';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { G4F } from 'g4f';
import { promptsContent } from 'src/global/prompts';
import { UpdatePostDto } from './dto/update.post';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostEntity)
        private postRepository: Repository<PostEntity>,
    ) { }

    async validateContentPost(contentPost: PostDto) {
        const g4f = new G4F();

        try {
            console.log(promptsContent.postContent);

            const { title, description } = contentPost;
            const messages = [
                { role: 'system', content: promptsContent.postContent },
                {
                    role: 'user',
                    content: `valida el contenido de esto y dime si hay palabras ofencibas o inapropiadas, en caso de que encuentres contenido asi entonces solo di finded en minuscula y en caso de que no encuentres nada ofensivo, solo dime notFinded en minuscula: ${title} ${description}`,
                },
            ];

            const options = {
                model: 'gpt-4',
                debug: true,
            };

            return await g4f.chatCompletion(messages, options);

        } catch (error) {
            console.error(error);
        }
    }

    async titleAlreadyExistsInDatabase(titlePost: string) {
        const searchTitleInDatabase = await this.postRepository.findOne({
            where: {
                title: titlePost
            }
        })

        if (searchTitleInDatabase) throw new BadRequestException('el titulo del post ya existe')
    }

    async postContent(userId: number, post: PostDto) {
        const searchPostExists = await this.postRepository.findOne({
            where: [
                { title: post.title },
                { description: post.description }
            ]
        })

        if (!searchPostExists) throw new BadRequestException('el post que quieres modificar no existe')

        // ! validar si el post si pertenece al usuario que intenta modificar
    }

    async createPost(postData: PostDto) {
        try {
            await this.titleAlreadyExistsInDatabase(postData.title)
            const response = await this.validateContentPost(postData);

            if (response === 'finded') throw new BadRequestException('Contenido inapropiado detectado')

            const createInstancePost = this.postRepository.create(postData)

            if (createInstancePost) {
                await this.postRepository.save(createInstancePost)
                return {
                    message: 'post created!',
                    details: createInstancePost,
                    postId: this.postRepository.getId
                }
            }

            return 'error en crear el post'
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async editPostUser(id: any, postData: PostDto, userID: any) {
        try {
            console.log(userID);
            
           return userID

        } catch (error) {
            throw new BadRequestException(error)
        }
    }
}