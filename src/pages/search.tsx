import Image from 'next/image';
import * as React from 'react';
import { ChangeEvent, useState } from 'react';

import { CheckIcon, CloseIcon, SearchIcon } from '@/components/icons/HeroIcons';
import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import ButtonLink from '@/components/links/ButtonLink';
import UnderlineLink from '@/components/links/UnderlineLink';
import UnstyledLink from '@/components/links/UnstyledLink';
import Seo from '@/components/Seo';

import Logo from '~/images/whale-logo.png';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const onQueryEntered = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <section className='bg-mainbg'>
          <div className='layout flex min-h-screen flex-col items-center justify-center text-center'>
            <Image src={Logo} alt='WhaleWar Logo' width={150} height={150} />
            <h1 className='mb-4 font-light text-white'>WhaleWar</h1>

            <div className=' relative flex w-1/2 rounded-lg bg-altbg'>
              <input
                onChange={onQueryEntered}
                value={searchQuery}
                placeholder='Search the web without being tracked'
                className=' h-full w-full bg-altbg py-3 pl-5 text-lg text-greyish'
              />

              {searchQuery.length >= 1 && (
                <div className='absolute right-10  flex h-full w-14 items-center justify-center'>
                  <CloseIcon />
                </div>
              )}

              <div className='group absolute right-0 flex h-full w-12 items-center justify-center rounded-tl-sm rounded-bl-sm hover:bg-hover '>
                <SearchIcon />
              </div>
            </div>

            <h1 className='mt-4 h-12 text-greyish'>
              Tired of being tracked online?
            </h1>
            <p className='text-greyish'>
              Add DuckDuckGo Privacy Essentials to your browser for free with
              one download
            </p>

            <div className='flex w-1/2 justify-around'>
              <div className='flex flex-row items-center'>
                <CheckIcon />
                <p className='ml-2 font-semibold text-greyish'>
                  DuckDuckGo Search
                </p>
              </div>

              <div className='flex flex-row items-center'>
                <CheckIcon />
                <p className='ml-2 font-semibold text-greyish'>
                  Site Encryption
                </p>
              </div>

              <div className='flex flex-row items-center'>
                <CheckIcon />
                <p className='ml-2 font-semibold text-greyish'>
                  Tracker Blocking
                </p>
              </div>
            </div>

            <p className='mt-4 text-sm text-gray-700'>
              <ArrowLink href='https://github.com/theodorusclarence/ts-nextjs-tailwind-starter'>
                See the repository
              </ArrowLink>
            </p>

            <ButtonLink className='mt-6' href='/components' variant='light'>
              See all components
            </ButtonLink>

            <UnstyledLink
              href='https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Ftheodorusclarence%2Fts-nextjs-tailwind-starter'
              className='mt-4'
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                width='92'
                height='32'
                src='https://vercel.com/button'
                alt='Deploy with Vercel'
              />
            </UnstyledLink>

            <footer className='absolute bottom-2 text-gray-700'>
              © {new Date().getFullYear()} By{' '}
              <UnderlineLink href='https://theodorusclarence.com?ref=tsnextstarter'>
                Theodorus Clarence
              </UnderlineLink>
            </footer>
          </div>
        </section>
      </main>
    </Layout>
  );
}
