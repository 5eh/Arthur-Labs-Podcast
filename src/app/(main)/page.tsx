import Link from 'next/link'
import { Container } from '@/components/Container'
import { EpisodePlayButton } from '@/components/EpisodePlayButton'
import { FormattedDate } from '@/components/FormattedDate'
import { type Episode, getAllEpisodes } from '@/lib/episodes'

function PauseIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 10 10" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.496 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5H2.68a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H1.496Zm5.82 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5H8.5a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H7.316Z"
        className="fill-gray-300 group-hover:fill-gray-200 group-active:fill-white"
      />
    </svg>
  )
}

function PlayIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 10 10" {...props}>
      <path
        d="M8.25 4.567a.5.5 0 0 1 0 .866l-7.5 4.33A.5.5 0 0 1 0 9.33V.67A.5.5 0 0 1 .75.237l7.5 4.33Z"
        className="fill-gray-300 group-hover:fill-gray-200 group-active:fill-white"
      />
    </svg>
  )
}
function EpisodeEntry({ episode }: { episode: Episode }) {
  let date = new Date(episode.published)
  return (
    <article
      aria-labelledby={`episode-${episode.id}-title`}
      className="py-6 sm:py-8"
    >
      <Container>
        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-shrink-0 items-center justify-center self-start sm:self-center">
            {episode.artwork ? (
              <img
                src={episode.artwork}
                alt=""
                className="h-20 w-20 rounded-md object-cover sm:h-32 sm:w-32"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-md bg-slate-800 sm:h-24 sm:w-24">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-8 w-8 text-slate-600"
                >
                  <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                  <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
                </svg>
              </div>
            )}
          </div>

          {/* Episode details - unchanged position */}
          <div className="flex min-w-0 flex-1 flex-col items-start">
            <h2
              id={`episode-${episode.id}-title`}
              className="mt-0 line-clamp-2 text-lg font-bold text-slate-200 sm:mt-1"
            >
              <Link href={`/${episode.id}`} className="hover:text-white">
                {episode.title}
              </Link>
            </h2>
            <FormattedDate
              date={date}
              className="order-first font-mono text-sm/7 text-slate-400"
            />
            <p className="mt-1 line-clamp-2 text-base/7 text-slate-300">
              {episode.description.split(' ').slice(0, 25).join(' ')}
              {episode.description.split(' ').length > 25 ? '...' : ''}
            </p>
            <div className="my-3 flex items-center gap-4 sm:my-4">
              <EpisodePlayButton
                episode={episode}
                className="group flex items-center gap-x-3 text-sm/6 font-bold text-gray-300 hover:text-gray-200 active:text-white"
                playing={
                  <>
                    <PauseIcon className="h-2.5 w-2.5" />
                    <span aria-hidden="true">Listen</span>
                  </>
                }
                paused={
                  <>
                    <PlayIcon className="h-2.5 w-2.5" />
                    <span aria-hidden="true">Listen</span>
                  </>
                }
              />
              <span
                aria-hidden="true"
                className="text-sm font-bold text-slate-400"
              >
                /
              </span>
              <Link
                href={`/${episode.id}`}
                className="flex items-center text-sm/6 font-bold text-gray-300 hover:text-gray-400 active:text-white"
                aria-label={`Show notes for episode ${episode.title}`}
              >
                Show notes
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </article>
  )
}
export default async function Home() {
  let episodes = await getAllEpisodes()
  return (
    <div className="pt-16 pb-12 sm:pb-4 lg:pt-12">
      <div className="divide-y divide-slate-100 sm:mt-4 lg:mt-8 lg:border-t lg:border-slate-100">
        {episodes.map((episode) => (
          <EpisodeEntry key={episode.id} episode={episode} />
        ))}
      </div>
    </div>
  )
}

export const revalidate = 10
