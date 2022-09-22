import { post_sentiment } from '@prisma/client';

interface IPageDataBase {
  username: string;
  ticker: string;
  sentiment: post_sentiment;
  slug: string;
  postTime: Date;
}

type TPageData = IPageDataBase[] | [];
