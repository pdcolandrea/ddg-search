import { NextApiRequest, NextApiResponse } from 'next';

const wait = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('woot');
    }, 5000);
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user } = req.query;

  console.log(user);

  await wait();

  return res
    .setHeader('Cache-Control', 's-maxage=')
    .setHeader('Cache-Control', 'maxage-99')
    .status(200)
    .send(`hello ${user}`);
}
