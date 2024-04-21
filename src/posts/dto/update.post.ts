import { PostDto } from './create.post';

export class UpdatePostDto implements PostDto {
  title: string;
  description: string;
}
