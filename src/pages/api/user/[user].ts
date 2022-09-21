import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/lib/prisma';
import { attemptToFindData } from '@/lib/tv_data';

const attemptToFindPosts = async (username: string) =>
  prisma.post.findMany({
    where: {
      username,
    },
    orderBy: {
      id: 'asc',
    },
  });

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
    // pull user info
  }
  const userInfo = await attemptToFindData(user);
  console.log(userInfo);

  if (!userInfo) {
    // TODO: Redirect?
    return res.status(400).send({ status: 'Error', code: 'NO_USER_FOUND' });
  }

  // return to client
  res.status(200).send(userInfo);

  // send to db

  // ==> If found w/ outdated info:
  // > Return data w/ appended header to fetch more on client
  // > Else return data
  // ==> If not found, scrape, add to db, add cache headers

  return res.status(400).send('Hello');
}
