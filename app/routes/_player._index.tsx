import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { SpotifyPlaylists } from '../components/playlists'
import type { ExtendedSpotifySession } from '../services/auth.server'
import { spotifyStrategy } from '../services/auth.server'
import { spotifySdk } from '../services/spotify.server'

export async function loader({ request }: LoaderFunctionArgs) {
    const session = (await spotifyStrategy.getSession(request)) as ExtendedSpotifySession
    const sdk = spotifySdk(session)

    const featuredPlaylists = await sdk.browse.getFeaturedPlaylists('AU')
    console.log(JSON.stringify({ featuredPlaylists }, null, 4))

    return json({ featuredPlaylists })
}

export default function Home() {
    const data = useLoaderData<typeof loader>()

    return (
        <div>
            <SpotifyPlaylists
                collectionTitle="Featured Playlists"
                playlistItems={data.featuredPlaylists.playlists.items}
            />
        </div>
    )
}
