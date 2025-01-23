import { LoginResponseDTO } from './login-response.dto';
import { PickType } from '@nestjs/swagger';

export class RefreshTokenResponseDTO extends PickType(LoginResponseDTO, [
  'accessToken',
] as const) {}
