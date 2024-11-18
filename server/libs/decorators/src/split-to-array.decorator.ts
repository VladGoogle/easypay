import { Transform } from 'class-transformer';

type Mapper = (value: string) => any;

interface SplitOptions {
  /**
   * @default false
   */
  mapNull?: boolean;
}

export function SplitToArray(options?: SplitOptions): PropertyDecorator;

export function SplitToArray(mapper?: Mapper): PropertyDecorator;

export function SplitToArray(arg?: SplitOptions | Mapper): PropertyDecorator {
  if (typeof arg === 'function') {
    return Transform(({ value }) =>
      String(value)
        .split(',')
        .map((i) => arg(i)),
    );
  }

  const { mapNull = false } = (arg as SplitOptions) || {};

  if (mapNull) {
    return Transform(({ value }) =>
      String(value)
        .split(',')
        .map((i) => (i === 'null' ? null : i)),
    );
  }

  return Transform(({ value }) => String(value).split(','));
}
