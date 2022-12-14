import axios from 'axios';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useQuery } from 'react-query';

export const getUser = async (username: string) => {
  const response = await axios.get(`/api/user/${username}`);
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

  return (
    <div>
      <h1>User</h1>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
}
