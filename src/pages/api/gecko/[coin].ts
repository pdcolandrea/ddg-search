// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from 'axios';
import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';

import { GekkoResp } from '@/lib/types';

const gekko = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { coin, date } = req.query;
  if (!coin || !date || typeof date !== 'string') {
    return res.status(400).send({
      status: 'error',
      code: 'MISSING_FIELD',
    });
  }

  const formattedDate = dayjs(date);
  console.log(date);
  console.log(formattedDate);

  const dates = [
    dayjs(formattedDate).add(1, 'day').format('DD-MM-YYYY'),
    dayjs(formattedDate).add(7, 'day').format('DD-MM-YYYY'),
    dayjs(formattedDate).add(30, 'day').format('DD-MM-YYYY'),
    formattedDate.isBefore(dayjs())
      ? dayjs(formattedDate).add(365, 'day').format('DD-MM-YYYY')
      : undefined,
  ];

  console.log(dates);

  const responses = await Promise.allSettled(
    dates.map(
      (date) =>
        gekko.get(`/coins/${coin}/history`, {
          params: {
            date,
          },
        }) as Promise<GekkoResp>
    )
  );

  // const response = await gekko.get(`/coins/${coin}/history`, {
  //   params: {
  //     date,
  //   },
  // });
  // if (response.status !== 200) {
  //   return res.status(400).send({
  //     status: 'error',
  //     code: 'COINGECKO_ERROR',
  //   });
  // }

  res.status(200).send(responses);
}
