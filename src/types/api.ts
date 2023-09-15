// Blog
export type Views = {
  views: number
}

export type Likes = {
  likes: number
  currentUserLikes: number
}

export type BlogData = Views & Pick<Likes, 'likes'>

// Guestbook
export type Messages = Array<{
  id: number
  body: string
  image: string
  created_by: string
  updated_at: Date
}>

// Dashboard
export type APIResponse = {
  count: number
}

// Spotify
export type Song =
  | {
      isPlaying: true
      name: string
      artist: string
      album: string
      albumImage: string
      songUrl: string
    }
  | {
      isPlaying: false
    }

// YouTube
export type YouTubeRes = {
  kind: string
  etag: string
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
  items: Array<{
    kind: string
    etag: string
    id: string
    statistics: {
      viewCount: string
      subscriberCount: string
      hiddenSubscriberCount: boolean
      videoCount: string
    }
  }>
}

export type YouTubeData = {
  subscribers: number
  views: number
}

// Github
export type GithubData = {
  stars: number
  followers: number
}

// Wakatime
export type WakatimeRes = {
  data: {
    decimal: string
    digital: string
    is_up_to_date: boolean
    percent_calculated: number
    range: {
      end: string
      end_date: string
      end_text: string
      start: string
      start_date: string
      start_text: string
      timezone: string
    }
    text: string
    timeout: number
    total_seconds: number
  }
}

export type WakatimeData = {
  seconds: number
}

// Analytics
export type AnalyticsData = {
  visitors: number
}
