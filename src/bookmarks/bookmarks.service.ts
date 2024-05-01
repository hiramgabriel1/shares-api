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

    // ! validar si el usuario ya tiene guardado el bookmark para que no se repita
    async saveBookmark(postID: number, userID: number) {
        try {
            const bookmarkSearch = await this.validateIfPostExists(postID);
            const userSearch = await this.validateIfUserExists(userID);
            const { id } = bookmarkSearch;
            const verifyBookmark = await this.userRepository.findOne({
                where: { id: userID },
                relations: ['bookmarks'],
            });

            console.log(verifyBookmark.bookmarks);
            const uniqueBookmarks = Array.from(
                new Set(
                    verifyBookmark.bookmarks.map((bookmark) => bookmark.idBookmarks),
                ),
            ).map((id) =>
                verifyBookmark.bookmarks.find(
                    (bookmark) => bookmark.idBookmarks === id,
                ),
            );
            console.log(uniqueBookmarks);
            
            // if(verifyBookmark.bookmarks)
            // console.log('user search: ', userSearch);
            // console.log('bookmark: ', verifyBookmark.user.bookmarks);

            // // if(verifyBookmark.idBookmarks)

            // if (verifyBookmark && verifyBookmark.idBookmarks === postID) {
            //     return {
            //         message: 'este post ya esta guardado en los bookmarks del usuario',
            //     };
            // }

            // const saveBookmark = this.bookmarkRepository.create({
            //     user: userSearch,
            //     idBookmarks: id,
            // });

            // const bookmarkUser = await this.bookmarkRepository.save(saveBookmark);

            // return {
            //     message: 'bookmark saved to user',
            //     bookmark: bookmarkUser,
            // }
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
                console.log(
                    `El usuario que creó este marcador fue: ${bookmark.user.id}`,
                );

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
        try {
            const cacheKey = 'bookmarks';
            const cacheVerify = await this.cacheChecked.checkCacheStored(cacheKey);

            await this.validateIfUserExists(userID);

            const queryBookmarks = await this.bookmarkRepository.findOne({
                relations: ['user'],
            });

            if (!queryBookmarks)
                throw new ForbiddenException('el usuario no contiene ningun bookmark');

            if (cacheVerify) return this.cacheManager.get('bookmarks');

            if (
                queryBookmarks &&
                queryBookmarks.user &&
                queryBookmarks.user.id === userID
            ) {
                console.log(
                    `el usuario que creo el post fue ${queryBookmarks.user.id}`,
                );

                await this.cacheManager.set(cacheKey, queryBookmarks);
                return queryBookmarks;
            }
        } catch (error) {
            console.error(error);
            throw new BadRequestException(error.message);
        }
    }

    async editBookmark(bookmarkID: number, userID: number, bodyBookmark: any) {
        // modificar los bookmark por id del usuario
    }
}
