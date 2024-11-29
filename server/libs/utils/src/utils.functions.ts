import { ObjectLiteral, Repository } from 'typeorm';
import Handlebars from 'handlebars';

export function pgReturning(repository: Repository<ObjectLiteral>): string {
  const es = repository.manager.connection.driver.escape;

  const returning = repository.metadata.columns
    .filter((c) => c.isSelect)
    .map((c) => `${es(c.databaseName)} as ${es(c.propertyName)}`)
    .join(', ');

  return returning;
}

export function registerHelpers() {
  // isNull helper
  Handlebars.registerHelper(
    'dateRangeNotNull',
    function (this: any, array, options) {
      if (Array.isArray(array) && array.every((item) => item !== null)) {
        return options.fn(this); // Render the block if all elements are not null
      } else {
        return options.inverse(this); // Render the `else` block otherwise
      }
    },
  );

  Handlebars.registerHelper(
    'ifEquals',
    function (this: any, arg1, arg2, options) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    },
  );
}
