import { post_sentiment } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';

import { IPageDataBase, TPageData } from '@/lib/types';

const PAGE_LIMIT = 1;
export async function attemptToFindData(
  username: string,
  pageData: TPageData = [],
  toPage = 0
): Promise<TPageData> {
  const TV_URL = 'https://www.tradingview.com';
  const pageParam = toPage === 0 ? '' : `page-${toPage}`;
  const page = await axios.get(`${TV_URL}/u/${username}/${pageParam}`);
  if (page.status !== 200 || PAGE_LIMIT === toPage) {
    if (toPage > 0) {
      return pageData;
    }

    throw new Error('Failed to open url for page: ' + toPage);
  }

  const $ = cheerio.load(page.data);
  $('body')
    .find('.tv-feed__item')
    .each((_i, element) => {
      const user = $(element).find('.tv-card-user-info__name').text();
      const ticker = $(element)
        .find('.tv-widget-idea__symbol-info')
        .find('a')
        .text();

      if (!user || !ticker || user === '') return;

      const label = $(element)
        .find('.icon-DX1PgEYG')
        .parent()
        .find('span')
        .text();

      const slug = $(element).find('.tv-widget-idea__title').attr('href');

      const postTime =
        $(element).find('.tv-card-stats__time').attr('data-timestamp') ?? '';
      const realTime = new Date(parseInt(postTime) * 1000);

      const data = {
        ticker: ticker,
        username: user,
        sentiment: label as post_sentiment,
        slug: slug,
        postTime: realTime,
      } as IPageDataBase;

      pageData.push(data);
    });

  return await attemptToFindData(username, pageData, toPage + 1);
}
