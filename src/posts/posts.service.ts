import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PostDto } from './dto/create.post';
import { InjectRepository } from '@nestjs/typeorm';
import { NumericType, Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { G4F } from 'g4f';
import { promptsContent } from 'src/global/prompts';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostEntity)
        private postRepository: Repository<PostEntity>,

        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) { }

    // todo: private methods (only development)

    async getPostWithComments() {
        const postsWithComments = await this.postRepository.find({
            relations: ['comments'],
        });

        let postsComments = postsWithComments.filter(posts => posts.comments.length >= 1)

        return {
            message: 'posts con comentarios',
            details: postsComments
        };
    }

    async getAllPosts() {
        const posts = await this.postRepository.find({
            relations: ['comments'],
        });

        return posts;
    }

    // todo: public methods

    async validatePostAndUser(postId: number, userId: number) {
        try {
            const post = await this.postRepository.findOne({
                where: {
                    id: postId,
                },

                relations: ['user'],
            });

            if (
                post && post.user && post.user.id === userId) {
                console.log(
                    `el usuario que creo este post fue: ${post.user.id}`
                );

                console.log(post);

                return {
                    userCreatedPost: post.user.id,
                    details: post,
                };
            }

            throw new ForbiddenException(`el usuario no tiene este post`);
        } catch (error) {
            console.log(error);

            throw new BadRequestException(error);
        }
    }

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
                // debug: true,
            };

            return await g4f.chatCompletion(messages, options);
        } catch (error) {
            console.error(error);
        }
    }

    async titleAlreadyExistsInDatabase(titlePost: string) {
        const searchTitleInDatabase = await this.postRepository.findOne({
            where: {
                title: titlePost,
            },

            relations: ['user']
        });

        if (searchTitleInDatabase)
            throw new BadRequestException(
                'el titulo del post ya existe, intenta con uno nuevo',
            );
    }

    async postContent(userId: number, postId: number) {
        const searchPostExists = await this.postRepository.findOne({
            where: {
                id: postId,
            },
            relations: ['user'],
        });

        if (!searchPostExists || searchPostExists.user.id !== userId) {
            throw new NotFoundException('El post que quieres modificar no existe');
        }
    }

    async createPost(userId: any, postData: PostDto) {
        try {
            await this.titleAlreadyExistsInDatabase(postData.title);

            const response = await this.validateContentPost(postData);

            if (response === 'finded') {
                throw new BadRequestException('Contenido inapropiado detectado');
            }

            // Obtener el usuario que creó el post
            const user = await this.userRepository.findOne({
                where: {
                    id: userId,
                },
            });

            if (!user) throw new BadRequestException('Usuario no encontrado');

            // Crear una instancia del post y asignar el usuario correspondiente
            const newPost = this.postRepository.create({
                user: user,
                ...postData,
            });

            const createdPost = await this.postRepository.save(newPost);

            return {
                message: 'Post creado exitosamente',
                details: createdPost,
                postId: createdPost.id,
            };

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async editPostUser(userId: number, postId: number, postData: PostDto) {
        try {
            await this.postContent(userId, postId);

            const existingPost = await this.postRepository.findOne({
                where: {
                    id: postId
                }
            });

            existingPost.title = postData.title;
            existingPost.description = postData.description;

            const updatedPost = await this.postRepository.save(existingPost);

            console.log(existingPost);

            return updatedPost
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async deletePostUser(userId: number, postId: number) {
        try {
            await this.validatePostAndUser(postId, userId);
            await this.postRepository.delete(postId)

            return 'post deleted successfully'
            
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}