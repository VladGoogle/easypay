import { Injectable } from '@nestjs/common';
import hbs from 'handlebars';
import { readFile } from 'node:fs/promises';
import { RenderPdf } from '@libs/interfaces/render-pdf';
import { chromium } from 'playwright';
import { Buffer } from 'buffer';

@Injectable()
export class PdfRenderService {
  private async getTpl(templatePath: string) {
    const content = await readFile(templatePath);
    return content.toString();
  }

  async renderPdf(payload: RenderPdf<any>) {
    const { vars, templatePath } = payload;

    try {
      vars['logo'] = new Buffer(await readFile(vars.logoPath)).toString(
        'base64',
      );

      const data = await this.getTpl(templatePath);
      const template = hbs.compile(data);

      const content = template(vars);

      const browser = await chromium.launch({
        headless: true,
        executablePath: '/usr/bin/chromium-browser',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const context = await browser.newContext();
      const page = await context.newPage();

      await page.setContent(content, { waitUntil: 'networkidle' });
      await page.emulateMedia({ media: 'screen' });

      return await page.pdf({
        printBackground: true,
        format: 'A4',
      });
    } catch (e) {
      console.log(e);
    }
  }
}
