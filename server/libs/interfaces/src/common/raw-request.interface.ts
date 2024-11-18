import { Request } from 'express';
import * as Buffer from 'buffer';

export interface RawRequest extends Request {
  pause(): this;
  resume(): this;
  isPaused(): boolean;
  wrap(oldStream: any): this;
  unpipe(destination?: any): this;
  setEncoding(encoding: any): this;
  rawBody: Buffer;
}
