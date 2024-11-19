export interface AddElasticDocument<T> {
  id: string;
  index: string;
  document: T;
}
