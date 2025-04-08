'use client'

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useRef,
  useState,
  useEffect,
} from 'react'

import { type Episode } from '@/lib/episodes'

interface PlayerState {
  playing: boolean
  muted: boolean
  duration: number
  currentTime: number
  episode: Episode | null
}

interface PublicPlayerActions {
  play: (episode?: Episode) => void
  pause: () => void
  toggle: (episode?: Episode) => void
  seekBy: (amount: number) => void
  seek: (time: number) => void
  playbackRate: (rate: number) => void
  toggleMute: () => void
  isPlaying: (episode?: Episode) => boolean
}

export type PlayerAPI = PlayerState & PublicPlayerActions

const enum ActionKind {
  SET_META = 'SET_META',
  PLAY = 'PLAY',
  PAUSE = 'PAUSE',
  TOGGLE_MUTE = 'TOGGLE_MUTE',
  SET_CURRENT_TIME = 'SET_CURRENT_TIME',
  SET_DURATION = 'SET_DURATION',
}

type Action =
  | { type: ActionKind.SET_META; payload: Episode }
  | { type: ActionKind.PLAY }
  | { type: ActionKind.PAUSE }
  | { type: ActionKind.TOGGLE_MUTE }
  | { type: ActionKind.SET_CURRENT_TIME; payload: number }
  | { type: ActionKind.SET_DURATION; payload: number }

const AudioPlayerContext = createContext<PlayerAPI | null>(null)

function audioReducer(state: PlayerState, action: Action): PlayerState {
  switch (action.type) {
    case ActionKind.SET_META:
      return { ...state, episode: action.payload }
    case ActionKind.PLAY:
      return { ...state, playing: true }
    case ActionKind.PAUSE:
      return { ...state, playing: false }
    case ActionKind.TOGGLE_MUTE:
      return { ...state, muted: !state.muted }
    case ActionKind.SET_CURRENT_TIME:
      return { ...state, currentTime: action.payload }
    case ActionKind.SET_DURATION:
      return { ...state, duration: action.payload }
  }
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  let [state, dispatch] = useReducer(audioReducer, {
    playing: false,
    muted: false,
    duration: 0,
    currentTime: 0,
    episode: null,
  })

  let playerRef = useRef<React.ElementRef<'audio'>>(null)

  // For Spotify embedded player
  const [spotifyEmbedUrl, setSpotifyEmbedUrl] = useState<string | null>(null)
  const spotifyIframeRef = useRef<HTMLIFrameElement | null>(null)

  // Helper to check if episode is from Spotify
  const isSpotifyEpisode = (episode: Episode) => {
    return (
      episode.audio.type === 'spotify' || episode.audio.src.includes('spotify')
    )
  }

  // Add autoplay parameter to Spotify embed URL
  const getSpotifyEmbedUrl = (episodeId: string) => {
    return `https://open.spotify.com/embed/episode/${episodeId}?utm_source=generator&theme=0&autoplay=1`
  }

  let actions = useMemo<PublicPlayerActions>(() => {
    return {
      play(episode) {
        if (episode) {
          dispatch({ type: ActionKind.SET_META, payload: episode })

          // Handle Spotify episodes differently
          if (isSpotifyEpisode(episode)) {
            // Hide any existing Spotify embed
            setSpotifyEmbedUrl(null)

            // Create a new Spotify embed URL with autoplay and show it
            setTimeout(() => {
              setSpotifyEmbedUrl(getSpotifyEmbedUrl(episode.id))
            }, 0)

            // Update state to reflect playing
            dispatch({ type: ActionKind.PLAY })

            // Set duration from episode metadata since we can't get it directly from the embed
            dispatch({
              type: ActionKind.SET_DURATION,
              payload: Math.floor(episode.duration / 1000), // Convert ms to seconds
            })

            return
          }

          // Regular audio handling
          if (
            playerRef.current &&
            playerRef.current.currentSrc !== episode.audio.src
          ) {
            let playbackRate = playerRef.current.playbackRate
            playerRef.current.src = episode.audio.src
            playerRef.current.load()
            playerRef.current.pause()
            playerRef.current.playbackRate = playbackRate
            playerRef.current.currentTime = 0
          }
        }

        // Hide Spotify embed when playing regular audio
        setSpotifyEmbedUrl(null)
        playerRef.current?.play()
      },
      pause() {
        if (state.episode && isSpotifyEpisode(state.episode)) {
          // For Spotify, we can reload the iframe without autoplay to effectively pause
          // However, this will reset playback position
          // Alternatively, we could hide the iframe, but that would stop playback entirely

          dispatch({ type: ActionKind.PAUSE })

          // Option 1: Reload iframe without autoplay parameter
          if (spotifyEmbedUrl) {
            setSpotifyEmbedUrl(
              `https://open.spotify.com/embed/episode/${state.episode.id}?utm_source=generator&theme=0&autoplay=0`,
            )
          }

          // Option 2: Hide iframe (more drastic)
          // setSpotifyEmbedUrl(null);

          return
        }

        playerRef.current?.pause()
      },
      toggle(episode) {
        this.isPlaying(episode) ? actions.pause() : actions.play(episode)
      },
      seekBy(amount) {
        if (state.episode && isSpotifyEpisode(state.episode)) {
          // Can't control Spotify embed seeking
          return
        }

        if (playerRef.current) {
          playerRef.current.currentTime += amount
        }
      },
      seek(time) {
        if (state.episode && isSpotifyEpisode(state.episode)) {
          // Can't control Spotify embed seeking
          return
        }

        if (playerRef.current) {
          playerRef.current.currentTime = time
        }
      },
      playbackRate(rate) {
        if (state.episode && isSpotifyEpisode(state.episode)) {
          // Can't control Spotify embed playback rate
          return
        }

        if (playerRef.current) {
          playerRef.current.playbackRate = rate
        }
      },
      toggleMute() {
        if (state.episode && isSpotifyEpisode(state.episode)) {
          // Can't control Spotify embed muting
          return
        }

        dispatch({ type: ActionKind.TOGGLE_MUTE })
      },
      isPlaying(episode) {
        if (!episode) {
          return state.playing
        }

        if (isSpotifyEpisode(episode)) {
          // For Spotify, we rely on our state tracking
          return state.playing && state.episode?.id === episode.id
        }

        // For regular audio
        return (
          state.playing && playerRef.current?.currentSrc === episode.audio.src
        )
      },
    }
  }, [state.playing, state.episode, spotifyEmbedUrl])

  let api = useMemo<PlayerAPI>(
    () => ({ ...state, ...actions }),
    [state, actions],
  )

  // Add message listener for Spotify iframe interactions
  useEffect(() => {
    function handleSpotifyMessages(event: MessageEvent) {
      // Spotify sends messages from 'https://open.spotify.com'
      if (event.origin !== 'https://open.spotify.com') return

      try {
        const data = JSON.parse(event.data)

        // Handle playback state changes from the iframe
        if (data.type === 'playback_update') {
          if (data.payload?.isPaused) {
            dispatch({ type: ActionKind.PAUSE })
          } else {
            dispatch({ type: ActionKind.PLAY })
          }
        }
      } catch (e) {
        // Ignore non-JSON messages
      }
    }

    window.addEventListener('message', handleSpotifyMessages)
    return () => {
      window.removeEventListener('message', handleSpotifyMessages)
    }
  }, [])

  return (
    <>
      <AudioPlayerContext.Provider value={api}>
        {children}
      </AudioPlayerContext.Provider>

      {/* Regular audio player */}
      <audio
        ref={playerRef}
        onPlay={() => dispatch({ type: ActionKind.PLAY })}
        onPause={() => dispatch({ type: ActionKind.PAUSE })}
        onTimeUpdate={(event) => {
          dispatch({
            type: ActionKind.SET_CURRENT_TIME,
            payload: Math.floor(event.currentTarget.currentTime),
          })
        }}
        onDurationChange={(event) => {
          dispatch({
            type: ActionKind.SET_DURATION,
            payload: Math.floor(event.currentTarget.duration),
          })
        }}
        muted={state.muted}
      />

      {/* Spotify embedded player */}
      {spotifyEmbedUrl && (
        <div className="fixed right-0 bottom-0 left-0 z-50 bg-black">
          <iframe
            ref={spotifyIframeRef}
            src={spotifyEmbedUrl}
            width="100%"
            height="80"
            frameBorder="0"
            allow="encrypted-media; autoplay"
            className="rounded-none"
          ></iframe>
        </div>
      )}
    </>
  )
}

export function useAudioPlayer(episode?: Episode) {
  let player = useContext(AudioPlayerContext)

  return useMemo<PlayerAPI>(
    () => ({
      ...player!,
      play() {
        player!.play(episode)
      },
      toggle() {
        player!.toggle(episode)
      },
      get playing() {
        return player!.isPlaying(episode)
      },
    }),
    [player, episode],
  )
}
