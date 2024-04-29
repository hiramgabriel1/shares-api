import {
    BadRequestException,
    ForbiddenException,
    Inject,
    Injectable,
} from '@nestjs/common';
import { BookmarkEntity } from './entities/bookmark.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { PostEntity } from 'src/posts/entities/post.entity';
import { CacheChecked } from 'src/common/checked.cache';

// en el bookmark se tiene que guardar el ID del post
@Injectable()
export class BookmarksService {
    constructor(
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,

        @InjectRepository(BookmarkEntity)
        private bookmarkRepository: Repository<BookmarkEntity>,

        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,

        @InjectRepository(PostEntity)
        private postEntity: Repository<PostEntity>,

        private cacheChecked: CacheChecked,
    ) { }

    async validateIfPostExists(postID: number) {
        const searchPost = await this.postEntity.findOne({
            where: { id: postID },
        });

        if (!searchPost)
            throw new BadRequestException('error al guardar el bookmark');

        return searchPost;
    }

    async validateIfUserExists(userID: number) {
        const searchUser = await this.userRepository.findOne({
            where: { id: userID },
        });

        if (!searchUser) throw new BadRequestException('el usuario no existe');

        return searchUser;
    }

    async saveBookmark(postID: number, userID: number) {
        try {
            // const cacheKey = 'bookmarks'
            // const cacheVerify = await this.cacheChecked.checkCacheStored(cacheKey)
            const bookmarkSearch = await this.validateIfPostExists(postID);
            console.log(bookmarkSearch);

            const userSearch = await this.validateIfUserExists(userID);
            console.log(userSearch);

            // if (cacheVerify) return await this.cacheManager.get(cacheKey)

            const { id } = bookmarkSearch;
            const saveBookmark = this.bookmarkRepository.create({
                user: userSearch,
                idBookmarks: id,
            });
            const bookmarkUser = await this.bookmarkRepository.save(saveBookmark);

            console.log(saveBookmark);

            // await this.cacheManager.set(cacheKey, bookmarkUser)
            return {
                message: 'bookmark saved to user',
                bookmark: bookmarkUser,
            };
        } catch (error) {
            console.log(error);

            throw new BadRequestException(error.message);
        }
    }

    async deleteBookmark(bookmarkID: number, userId: number) {
        try {
            await this.validateIfUserExists(userId);

            const bookmark = await this.bookmarkRepository.findOne({
                where: { idBookmarks: bookmarkID },
                relations: ['user'],
            });

            if (bookmark && bookmark.user && bookmark.user.id === userId) {
                console.log(`El usuario que creó este marcador fue: ${bookmark.user.id}`);

                await this.bookmarkRepository.delete(bookmarkID);
                return {
                    message: 'Marcador eliminado correctamente',
                };
            }

            throw new ForbiddenException(`El usuario no tiene este marcador`);
        } catch (error) {
            console.log(error);
            throw new BadRequestException(error.message);
        }
    }

    async getBookmarks(userID: number) {
        // obtener los bookmark por el id del usuario
    }

    async editBookmark(bookmarkID: number, userID: number, bodyBookmark: any) {
        // modificar los bookmark por id del usuario
    }
}