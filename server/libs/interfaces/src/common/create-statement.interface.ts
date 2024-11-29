export interface CreateStatement<T> {
  dto: Partial<T>;
  userId: string;
  tokens?: string;
}
