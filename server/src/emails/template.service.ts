import {Injectable} from '@nestjs/common';
import * as hbs from 'handlebars';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';

const folderPath = 'emails/resources/templates';

@Injectable()
export class TemplateService {

  /**
   * A service method that sends an email to the specified address
   * @template T
   * @param {string} name - The name of the template to render
   * @param {T} data - The list of variables to put into template
   * @returns {string} An HTML string compiled from HBS template with variables without CSS properties
   */
  public async render<T>(name: string, data: T): Promise<string> {
    const tpl = await this.getTpl(name);
    const template = hbs.compile(tpl);

    return template(data);
  }

  /**
   * A service method that read a template file, specified as the function parameter
   * @param {string} name - The name of the template to render
   * @returns {string} A string of HBS template file
   */
  private async getTpl(name: string): Promise<string> {

    const path = join(__dirname, folderPath, `${name}.hbs`);

    const content = await readFile(path);
    return content.toString();
  }
}
