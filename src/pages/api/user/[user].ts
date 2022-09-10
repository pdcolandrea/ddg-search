import { NextApiRequest, NextApiResponse } from 'next';

let count = 0;
const wait = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      count += 1;
      resolve(`woot ${count}`);
    }, 5000);
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  const { user } = req.query;

  console.log(user);

  const testing = await wait();

  return res.status(200).send(`hello ${user} ${testing}`);
}
