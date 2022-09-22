import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/lib/prisma';
import { attemptToFindData } from '@/lib/tv_data';
import { IPageDataBase } from '@/lib/types';

const attemptToFindPosts = async (username: string) =>
  prisma.post.findMany({
    where: {
      username,
    },
    orderBy: {
      id: 'asc',
    },
  });

export async function insertNewPost(user: IPageDataBase) {
  return await prisma.post.create({
    data: {
      user: {
        connectOrCreate: {
          where: {
            username: user.username,
          },
          create: {
            username: user.username,
          },
        },
      },
      pair: user.ticker,
      slug: user.slug,
      sentiment: user.sentiment,
      current_price: 0,
    },
  });
}

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);
  const { user } = req.query;
  if (req.method !== 'GET') {
    return res.status(404).send('Invalid request');
  }
  if (!user || typeof user !== 'string') {
    return res.status(400).send('Missing user');
  }

  res.setHeader(
    'Cache-Control',
    's-maxage=100, maxage=5000, stale-while-revalidate=59000'
  );
  console.log(`[API REQUEST] /api/${user}`);

  // Attempt to find user in db
  const posts = await attemptToFindPosts(user);

  if (posts.length === 0) {
    // never seen, scrape
    const userInfo = await attemptToFindData(user);
    console.log(userInfo);
    if (!userInfo) {
      // TODO: Redirect?
      return res.status(400).send({ status: 'Error', code: 'NO_USER_FOUND' });
    }
    res.status(200).send(userInfo);

    // send to db
    return Promise.allSettled(
      userInfo.map(async (user) => await insertNewPost(user))
    );
  }

  // Found
  return res.status(200).send(posts);
}
