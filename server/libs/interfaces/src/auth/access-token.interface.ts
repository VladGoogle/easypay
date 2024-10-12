export interface TokenData<T> {
    payload: T,
    expiresIn: string,
    secret: string
}