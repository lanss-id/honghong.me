import useSWR from 'swr'
import { useTheme } from 'next-themes'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { useState, useEffect } from 'react'
import { TopTracks } from '@/lib/types'

import fetcher from '@/lib/fetcher'
import Track from '@/components/Track'
import { Flex } from '../Flex'
import { Box } from '@/components/Box'

const ContentLoader = () => {
  return (
    <>
      <Flex css={{ gapX: '$2' }}>
        <Skeleton width={20} height={20} />
        <Skeleton width={122} height={20} />
      </Flex>
      <Skeleton width={210} height={20} style={{ marginLeft: 'calc(20px+0.5rem)' }} />
    </>
  )
}

export default function Tracks() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const { data } = useSWR<TopTracks>('/api/top-tracks', fetcher)

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  if (!mounted) return null
  if (!data && mounted) {
    return (
      <SkeletonTheme
        baseColor={theme === 'dark' || resolvedTheme === 'dark' ? '#202020' : '#d9d9d9'}
        highlightColor={theme === 'dark' || resolvedTheme === 'dark' ? '#444444' : '#ecebeb'}
      >
        <Flex
          direction={'column'}
          css={{
            gapY: '$4',
          }}
        >
          <ContentLoader />
          <ContentLoader />
          <ContentLoader />
        </Flex>
      </SkeletonTheme>
    )
  }

  return (
    <Box css={{ divideY: '1px' }}>
      {data.tracks.map((track, index) => (
        <Track ranking={index + 1} key={track.songUrl} {...track} />
      ))}
    </Box>
  )
}