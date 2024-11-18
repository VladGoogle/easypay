import { User } from '@libs/entities';

export interface AuthRequest<T extends User = User> extends Request {
  user: T;
}
