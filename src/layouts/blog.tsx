import type { Blog } from 'contentlayer/generated';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';

import { isProd } from '@/lib/isProduction';
import { CoreContent } from '@/lib/utils/contentlayer';
import formatDate from '@/lib/utils/formatDate';
import useScrollSpy from '@/hooks/useScrollspy';

import Comment from '@/components/Comment';
import Layout from '@/components/Layout';
import Link from '@/components/Link';
import NextPrevPost from '@/components/NextPrevPost';
import PageTitle from '@/components/PageTitle';
import ScrollTopAndComment from '@/components/ScrollTopAndComment';
import TableOfContents from '@/components/TableOfContents';
import { HeadingScrollSpy } from '@/components/TableOfContents/types';
import ViewCounter from '@/components/ViewCounter';

const editUrl = (slug: string) =>
  `https://github.com/tszhong0411/honghong.me/blob/main/src/data/blog/${slug}.mdx`;

const twitterShare = (slug: string) =>
  `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    `https://honghong.me/blog/${slug}`
  )}`;

const facebookShare = (slug: string) =>
  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    `https://honghong.me/blog/${slug}`
  )}`;

type Props = {
  content: CoreContent<Blog>;
  next?: { slug: string; title: string; summary: string };
  prev?: { slug: string; title: string; summary: string };
  children: React.ReactNode;
};

export default function BlogLayout({ content, next, prev, children }: Props) {
  const { slug, date, title, summary } = content;
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [totalCommentCount, setTotalCommentCount] = React.useState<number>(0);

  //#region  //*=========== Scrollspy ===========
  const activeSection = useScrollSpy();
  const [toc, setToc] = React.useState<HeadingScrollSpy>();
  const minLevel =
    toc?.reduce((min, item) => (item.level < min ? item.level : min), 10) ?? 0;

  React.useEffect(() => {
    const headings = document.querySelectorAll(
      '#blog-content h2, #blog-content h3'
    );

    const headingArr: HeadingScrollSpy = [];
    headings.forEach((heading) => {
      const id = heading.id;
      const level = +heading.tagName.replace('H', '');
      const text = heading.textContent + '';

      headingArr.push({ id, level, text });
    });

    setToc(headingArr);
  }, [slug]);
  //#endregion //*=========== Srcollspy ===========

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://giscus.app') return;
      if (!(typeof event.data === 'object' && event.data.giscus)) return;

      const giscusData = event.data.giscus.discussion;

      giscusData &&
        setTotalCommentCount(
          giscusData.totalCommentCount + giscusData.totalReplyCount
        );
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  return (
    <Layout
      title={`${title}`}
      summary={summary}
      image={`https://og.honghong.me/api/blog?theme=dark&title=${title}&description=${summary}`}
      date={new Date(date).toISOString()}
      type='article'
    >
      <ScrollTopAndComment />
      <div className='mb-12'>
        <div>
          <PageTitle>{title}</PageTitle>
        </div>
      </div>
      <div className='flex flex-row justify-center gap-4'>
        <div className='avatar'>
          <div className='w-12 rounded-full ring ring-gray-600 ring-offset-2 ring-offset-base-100 dark:ring-white'>
            <motion.div
              className='h-12 w-12'
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src='/static/images/logo/logo-black.png'
                width={48}
                height={48}
                alt='avatar'
                className='rounded-full'
              />
            </motion.div>
          </div>
        </div>
        <div>
          小康
          <div>
            <Link
              href='https://instagram.com/tszhong0411'
              className='sm:text-sm'
              noIcon
            >
              @tszhong0411
            </Link>
          </div>
        </div>
      </div>
      <div className='my-6 flex flex-row justify-center gap-2 text-sm sm:text-base'>
        {isProd && <ViewCounter slug={slug} />}•
        <time dateTime={date}>{formatDate(new Date(date), locale)}</time>•
        <span>
          {totalCommentCount} {t('common:comments')}
        </span>
      </div>
      <div className='divider mx-auto max-w-[65ch]'></div>
      <div className='mt-8'>
        <article id='blog-content'>
          <div className='prose mx-auto dark:prose-dark lg:prose-xl'>
            {children}
          </div>
        </article>
      </div>
      <div className='divider'></div>
      <div className='mb-4 flex justify-between text-sm'>
        <div className='flex items-center'>
          <Link href={editUrl(slug)}>{t('common:editOnGithub')}</Link>
        </div>
        <div className='flex flex-col gap-2 s:flex-row'>
          <Link href={facebookShare(slug.replace(`.${locale}`, ''))} noIcon>
            <svg
              className='w-20'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 122.88 38.48'
            >
              <path
                d='M118.69 0H4.19A4.21 4.21 0 000 4.19v30.1a4.2 4.2 0 004.19 4.19h114.5a4.2 4.2 0 004.19-4.19V4.19A4.21 4.21 0 00118.69 0z'
                fill='#1877f2'
              ></path>
              <path
                d='M52 21.34l3.13-.23a3 3 0 00.42 1.34 1.65 1.65 0 001.45.75 1.45 1.45 0 001.09-.38 1.24 1.24 0 00.38-.89 1.21 1.21 0 00-.36-.86 3.82 3.82 0 00-1.68-.72 6.73 6.73 0 01-3.09-1.5 3.22 3.22 0 01-.94-2.39 3.57 3.57 0 01.48-1.8 3.38 3.38 0 011.43-1.34 6 6 0 012.63-.48 4.81 4.81 0 013.12.88 4 4 0 011.27 2.82l-3.1.21a2.07 2.07 0 00-.52-1.23 1.52 1.52 0 00-1.09-.38 1.24 1.24 0 00-.87.28.94.94 0 00-.29.69.72.72 0 00.24.53 2.35 2.35 0 001.1.46 12.27 12.27 0 013.09 1.1 3.38 3.38 0 011.36 1.37 3.92 3.92 0 01.43 1.83 4.37 4.37 0 01-.57 2.2 3.78 3.78 0 01-1.59 1.53 5.69 5.69 0 01-2.56.51c-1.82 0-3.08-.4-3.77-1.21A5.15 5.15 0 0152 21.34zm11.14-8.29h3.3v4.32H70v-4.32h3.31v12.39H70v-5h-3.6v5h-3.3V13.05zm19 10.34h-3.77l-.54 2.05h-3.37l4-12.39h3.61l4 12.39h-3.43l-.54-2.05zm-.69-2.68l-1.17-4.45-1.17 4.45zm5.77 4.73V13.05h5.5a7 7 0 012.33.3 2.6 2.6 0 011.31 1.13 3.84 3.84 0 01.49 2 3.93 3.93 0 01-.38 1.78 3.25 3.25 0 01-1 1.22 3.61 3.61 0 01-1.16.49 2.9 2.9 0 01.86.46 3.81 3.81 0 01.52.65 5 5 0 01.46.77l1.61 3.58H94l-1.76-3.78a3 3 0 00-.6-1 1.25 1.25 0 00-.81-.28h-.29v5zm3.31-7.36h1.39a4.59 4.59 0 00.88-.17.83.83 0 00.53-.39 1.27 1.27 0 00.21-.72 1.22 1.22 0 00-.33-.92 1.75 1.75 0 00-1.23-.32h-1.49v2.52zm8.24-5h8.83v2.64H102v2h5.12v2.52H102v2.44h5.68v2.81h-9V13.05z'
                fill='#fff'
              ></path>
              <path
                d='M40.66 0L40.66 38.48 38.27 38.48 38.27 0 40.66 0 40.66 0z'
                fill='#166bda'
              ></path>
              <path
                d='M31.43 18.75a12.18 12.18 0 10-14.07 12v-8.49h-3.11v-3.51h3.11v-2.68c0-3.05 1.81-4.74 4.59-4.74a17.55 17.55 0 012.71.25v3h-1.53a1.78 1.78 0 00-2 1.91v2.28h3.39L24 22.25h-2.87v8.51a12.14 12.14 0 0010.3-12z'
                fill='#fff'
              ></path>
            </svg>
          </Link>
          <Link href={twitterShare(slug.replace(`.${locale}`, ''))} noIcon>
            <svg
              className='w-20'
              xmlns='http://www.w3.org/2000/svg'
              version='1.1'
              viewBox='0 0 122.88 38.48'
              xmlSpace='preserve'
            >
              <path
                d='M118.69 0H4.19C1.89 0 0 1.89 0 4.19V34.3c0 2.3 1.89 4.19 4.19 4.19h114.5c2.3 0 4.19-1.89 4.19-4.19V4.19c0-2.3-1.89-4.19-4.19-4.19z'
                fill='#1DA1F2'
              ></path>
              <path
                d='M51.99 21.34l3.13-.23c.07.59.21 1.04.42 1.34.34.5.82.75 1.46.75.47 0 .83-.13 1.09-.38.26-.26.38-.55.38-.89 0-.32-.12-.61-.36-.86s-.8-.49-1.68-.72c-1.45-.37-2.47-.88-3.09-1.5-.62-.62-.93-1.42-.93-2.39 0-.63.16-1.23.48-1.8.32-.57.79-1.01 1.43-1.34.64-.32 1.51-.48 2.62-.48 1.36 0 2.4.29 3.12.89.72.59 1.14 1.53 1.28 2.81l-3.1.21c-.08-.56-.26-.97-.52-1.23-.27-.26-.63-.38-1.1-.38-.38 0-.67.1-.87.28s-.29.42-.29.69c0 .2.08.37.24.53.15.16.52.31 1.1.46 1.44.36 2.47.73 3.09 1.1.62.37 1.08.82 1.36 1.37.28.54.42 1.16.42 1.83a4.4 4.4 0 01-.57 2.2c-.38.67-.91 1.18-1.59 1.53-.68.35-1.53.52-2.57.52-1.81 0-3.07-.41-3.77-1.22-.69-.81-1.09-1.84-1.18-3.09zm-20.98-8.43c-.75.34-1.56.56-2.4.66.86-.52 1.53-1.34 1.84-2.32-.81.48-1.71.83-2.66 1.02a4.203 4.203 0 00-3.06-1.32 4.189 4.189 0 00-4.08 5.14c-3.48-.18-6.57-1.84-8.63-4.38-.37.64-.57 1.37-.57 2.11 0 1.45.74 2.74 1.86 3.48-.69-.02-1.33-.21-1.9-.52v.05c0 2.03 1.44 3.72 3.36 4.11-.35.1-.72.15-1.1.15-.27 0-.53-.03-.79-.07a4.214 4.214 0 003.91 2.91 8.375 8.375 0 01-5.2 1.79c-.34 0-.67-.02-1-.06 1.86 1.19 4.06 1.88 6.42 1.88 7.7 0 11.92-6.38 11.92-11.92 0-.18 0-.36-.01-.54.82-.59 1.53-1.33 2.09-2.17zm32.12.14h3.29v4.33h3.61v-4.33h3.31v12.39h-3.31v-5.02h-3.61v5.02h-3.29V13.05zM82.1 23.39h-3.74l-.54 2.04h-3.37l4.02-12.39h3.61l4 12.39h-3.45l-.53-2.04zm-.69-2.68l-1.17-4.45-1.17 4.45h2.34zm5.77 4.73V13.05h5.5c1.02 0 1.8.1 2.33.31.54.2.98.58 1.3 1.13.33.55.5 1.22.5 2.01 0 .69-.13 1.28-.38 1.78s-.6.91-1.04 1.22c-.28.2-.67.36-1.16.49.39.15.68.3.86.46.12.1.3.32.53.65.23.33.38.59.46.77l1.6 3.58h-3.73l-1.76-3.78c-.23-.49-.42-.81-.6-.95-.24-.19-.51-.29-.81-.29h-.29v5.02h-3.31v-.01zm3.31-7.36h1.39c.15 0 .44-.06.88-.17.22-.05.4-.18.53-.39.14-.21.21-.45.21-.72 0-.4-.11-.71-.33-.92-.22-.21-.63-.32-1.23-.32h-1.45v2.52zm8.25-5.03h8.83v2.65h-5.52v1.97h5.11v2.53h-5.11v2.44h5.68v2.8h-8.99V13.05z'
                fill='white'
              ></path>
              <path
                d='M40.66 0L40.66 38.48 38.27 38.48 38.27 0 40.66 0z'
                fill='#1A91DA'
              ></path>
            </svg>
          </Link>
        </div>
      </div>
      <div className='divider'></div>
      <Comment />
      <div className='divider'></div>
      <div className='pt-8'>
        <div className='flex flex-col sm:flex-row'>
          {(next || prev) && (
            <>
              {prev && (
                <NextPrevPost
                  heading={t('common:prev')}
                  title={prev.title}
                  summary={prev.summary}
                  slug={prev.slug.replace(`.${locale}`, '')}
                />
              )}
              {next && (
                <div className='divider my-12 sm:divider-horizontal sm:mx-8'></div>
              )}
              {next && (
                <NextPrevPost
                  heading={t('common:next')}
                  title={next.title}
                  summary={next.summary}
                  slug={next.slug.replace(`.${locale}`, '')}
                />
              )}
            </>
          )}
        </div>
      </div>
      <AnimatePresence>
        <ScrollTopAndComment />
      </AnimatePresence>
      <TableOfContents
        toc={toc}
        minLevel={minLevel}
        activeSection={activeSection}
      />
    </Layout>
  );
}