import {
  Badge,
  Block,
  Button,
  Card,
  ColGrid,
  Color,
  Flex,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TabList,
  Text,
  Title,
} from '@tremor/react';
import dayjs from 'dayjs';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { dehydrate, QueryClient, useQuery } from 'react-query';

import { wAPI } from '@/lib/apiClient';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export const getUser = async (username: string) => {
  const response = await wAPI.get(`/api/user/${username}`);
  return response.data;
};

export const getStaticProps: GetStaticProps = async (context) => {
  const user = context.params?.user as string;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['user', user], () => getUser(user));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default function User() {
  const [selectedView, setSelectedView] = useState(1);

  const router = useRouter();
  const username =
    typeof router.query?.user === 'string' ? router.query.user : '';

  const { data } = useQuery(
    ['user', router.query?.user],
    () => getUser(username),
    {
      enabled: username.length > 0,
    }
  );

  const colors: { [key: string]: Color } = {
    'Ready for dispatch': 'gray',
    Cancelled: 'rose',
    Shipped: 'emerald',
  };

  const transactions = [
    {
      transactionID: '#123456',
      user: 'Lena Mayer',
      item: 'Under Armour Shorts',
      status: 'Ready for dispatch',
      amount: '$ 49.90',
      link: '#',
    },
    {
      transactionID: '#234567',
      user: 'Max Smith',
      item: 'Book - Wealth of Nations',
      status: 'Ready for dispatch',
      amount: '$ 19.90',
      link: '#',
    },
    {
      transactionID: '#345678',
      user: 'Anna Stone',
      item: 'Garmin Forerunner 945',
      status: 'Cancelled',
      amount: '$ 499.90',
      link: '#',
    },
    {
      transactionID: '#4567890',
      user: 'Truls Cumbersome',
      item: 'Running Backpack',
      status: 'Shipped',
      amount: '$ 89.90',
      link: '#',
    },
    {
      transactionID: '#5678901',
      user: 'Peter Pikser',
      item: 'Rolex Submariner Replica',
      status: 'Cancelled',
      amount: '$ 299.90',
      link: '#',
    },
    {
      transactionID: '#6789012',
      user: 'Phlipp Forest',
      item: 'On Clouds Shoes',
      status: 'Ready for dispatch',
      amount: '$ 290.90',
      link: '#',
    },
    {
      transactionID: '#78901234',
      user: 'Mara Pacemaker',
      item: 'Ortovox Backpack 40l',
      status: 'Shipped',
      amount: '$ 150.00',
      link: '#',
    },
    {
      transactionID: '#89012345',
      user: 'Sev Major',
      item: 'Oakley Jawbreaker',
      status: 'Ready for dispatch',
      amount: '$ 190.90',
      link: '#',
    },
  ];

  return (
    <Layout>
      <Seo title={`Stats | ${username}`} />

      <main className='px-32 py-16'>
        <Title>{username}</Title>
        <Text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr.</Text>

        <TabList
          defaultValue={1}
          handleSelect={(value) => setSelectedView(value)}
          marginTop='mt-6'
        >
          <Tab value={1} text='Page 1' />
          <Tab value={2} text='Page 2' />
        </TabList>

        {selectedView === 1 ? (
          <>
            <ColGrid
              numColsMd={2}
              numColsLg={3}
              gapX='gap-x-6'
              gapY='gap-y-6'
              marginTop='mt-6'
            >
              <Card>
                {/* Placeholder to set height */}
                <div className='h-28' />
              </Card>
              <Card>
                {/* Placeholder to set height */}
                <div className='h-28' />
              </Card>
              <Card>
                {/* Placeholder to set height */}
                <div className='h-28' />
              </Card>
            </ColGrid>

            <Block marginTop='mt-6'>
              <Card>
                <Flex justifyContent='justify-start' spaceX='space-x-2'>
                  <Title>Trades</Title>
                  <Badge text={transactions.length} color='gray' />
                </Flex>
                <Text marginTop='mt-2'>
                  Overview of {username}, most recent posts
                </Text>

                <Table marginTop='mt-6'>
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>Post Date</TableHeaderCell>
                      <TableHeaderCell>Sentiment</TableHeaderCell>
                      <TableHeaderCell>1d</TableHeaderCell>
                      <TableHeaderCell>7d</TableHeaderCell>
                      <TableHeaderCell>1m</TableHeaderCell>
                      <TableHeaderCell>6m</TableHeaderCell>
                      <TableHeaderCell textAlignment='text-right'>
                        Amount
                      </TableHeaderCell>
                      <TableHeaderCell>Link</TableHeaderCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {transactions.map((item) => (
                      <TableRow key={item.transactionID}>
                        <TableCell>{item.transactionID}</TableCell>
                        <TableCell>{item.user}</TableCell>
                        <TableCell>{item.item}</TableCell>
                        <TableCell>{item.transactionID}</TableCell>
                        <TableCell>{item.transactionID}</TableCell>

                        <TableCell>
                          <Badge
                            color={colors[item.status]}
                            text={item.status}
                            size='xs'
                          />
                        </TableCell>
                        <TableCell textAlignment='text-right'>
                          {item.amount}
                        </TableCell>
                        <TableCell>
                          <Button
                            size='xs'
                            importance='secondary'
                            text='See details'
                            color='gray'
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </Block>
            {JSON.stringify(data)}
            {data &&
              data[0] &&
              data[0] &&
              dayjs(data[0].postTime).format('DD/MM/YY, h:mm A')}
          </>
        ) : (
          <Block marginTop='mt-6'>
            <Card>
              <div className='h-96' />
            </Card>
          </Block>
        )}
      </main>
    </Layout>
  );
}
