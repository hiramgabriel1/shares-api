import { PostDto } from './create.post';

export class UpdatePost implements PostDto {
  title: string;
  description: string;
}
