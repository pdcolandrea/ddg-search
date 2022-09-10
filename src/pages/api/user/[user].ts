import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req.query;

  console.log(user);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(res.status(200).send(`hello ${user}`));
    }, 5000);
  });
}
