import { TwoFactorTokenPayloadInterface } from './two-factor-token-payload.interface';

export interface TwoFactorAuthRequest<
  T extends TwoFactorTokenPayloadInterface = TwoFactorTokenPayloadInterface,
> extends Request {
  user: T;
}
