import { cache } from 'react'

export type Episode = {
  id: string
  title: string
  published: string
  description: string
  content: string
  audio: {
    src: string
    type: string
  }
  duration: number
  artwork: string | null
}

let tokenCache: {
  token: string
  expiry: number
} | null = null

// Get a Spotify access token
async function getSpotifyToken() {
  // Check if we have a valid cached token
  if (tokenCache && tokenCache.expiry > Date.now()) {
    return tokenCache.token
  }

  // Spotify API credentials
  const clientId = process.env.SPOTIFY_ID
  const clientSecret = process.env.SPOTIFY_SECRET

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(clientId + ':' + clientSecret).toString('base64'),
      },
      body: 'grant_type=client_credentials',
    })

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.status}`)
    }

    const data = await response.json()

    tokenCache = {
      token: data.access_token,
      expiry: Date.now() + data.expires_in * 1000 - 60000,
    }

    return data.access_token
  } catch (error) {
    console.error('Error getting Spotify token:', error)
    throw error
  }
}

// Transform Spotify episode data to match our expected Episode type
function transformSpotifyEpisode(spotifyEpisode: any): Episode {
  // Get the thumbnail image URL
  let artwork = null

  // Check if images array exists and has at least one image
  if (spotifyEpisode.images && spotifyEpisode.images.length > 0) {
    // Prefer smaller images for thumbnails (usually the last one is smallest)
    // But fallback to any available image
    const smallImage = spotifyEpisode.images[spotifyEpisode.images.length - 1]
    const anyImage = spotifyEpisode.images[0]
    artwork = smallImage?.url || anyImage?.url || null
  }

  return {
    id: spotifyEpisode.id,
    title: spotifyEpisode.name,
    published: spotifyEpisode.release_date,
    description: spotifyEpisode.description,
    // Create HTML content from the description
    content: `<p>${spotifyEpisode.description}</p>`,
    audio: {
      src:
        spotifyEpisode.audio_preview_url ||
        spotifyEpisode.external_urls.spotify,
      type: 'audio/mpeg',
    },
    duration: spotifyEpisode.duration_ms,
    artwork: artwork,
  }
}

// Function to get all episodes from Spotify
export const getAllEpisodes = cache(async (): Promise<Episode[]> => {
  try {
    const token = await getSpotifyToken()

    const response = await fetch(
      'https://api.spotify.com/v1/shows/79UN7d5K0y61ly9pRBNzvR/episodes?limit=50',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 3600 },
      },
    )

    if (!response.ok) {
      throw new Error(`Error fetching episodes: ${response.status}`)
    }

    const data = await response.json()

    const episodes = data.items.map(transformSpotifyEpisode)

    return episodes
  } catch (error) {
    console.error('Error fetching episodes:', error)
    return []
  }
})

export async function getEpisode(id: string): Promise<Episode | null> {
  try {
    const token = await getSpotifyToken()

    const response = await fetch(`https://api.spotify.com/v1/episodes/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      // If episode not found or other error
      if (response.status === 404) {
        return null
      }
      throw new Error(`Error fetching episode: ${response.status}`)
    }

    const episodeData = await response.json()

    // Transform to our Episode type
    return transformSpotifyEpisode(episodeData)
  } catch (error) {
    console.error(`Error fetching episode with ID ${id}:`, error)
    return null
  }
}
