import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/lib/prisma';

let count = 0;
const wait = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      count += 1;
      resolve(`woot ${count}`);
    }, 5000);
  });
};

const attemptToFindPosts = async (username: string) =>
  prisma.post.findMany({
    where: {
      username,
    },
    orderBy: {
      id: 'asc',
    },
  });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  const { user } = req.query;
  if (req.method !== 'GET') {
    return res.status(404).send('Invalid request');
  }
  if (!user || typeof user !== 'string') {
    return res.status(400).send('Missing user');
  }

  // Attempt to find user in db
  const posts = await attemptToFindPosts(user);
  if (posts.length === 0) {
    // scrape
  }

  // ==> If found w/ outdated info:
  // > Return data w/ appended header to fetch more on client
  // > Else return data
  // ==> If not found, scrape, add to db, add cache headers

  const testing = await wait();

  return res.status(200).send(`hello ${user} ${testing}`);
}
