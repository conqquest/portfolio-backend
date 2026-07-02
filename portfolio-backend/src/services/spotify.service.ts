import axios from "axios";

async function getAccessToken(): Promise<string> {
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
    }),
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
}

export async function getNowPlaying() {
  const accessToken = await getAccessToken();

  const response = await axios.get(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      validateStatus: () => true,
    }
  );

  if (response.status === 204) {
    return null;
  }

  const song = response.data.item;

  return {
    isPlaying: response.data.is_playing,
    name: song.name,
    artist: song.artists.map((artist: any) => artist.name).join(", "),
    artistUrl: song.artists[0].external_urls.spotify,
    album: song.album.name,
    albumImage: song.album.images[0]?.url,
    albumUrl: song.album.external_urls.spotify,
    spotifyUrl: song.external_urls.spotify,
    duration: song.duration_ms,
  };
}

export async function getRecentlyPlayed() {
  const accessToken = await getAccessToken();

  const response = await axios.get(
    "https://api.spotify.com/v1/me/player/recently-played?limit=10",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data.items.map((item: any) => ({
    playedAt: item.played_at,
    name: item.track.name,
    artist: item.track.artists.map((a: any) => a.name).join(", "),
    artistUrl: item.track.artists[0].external_urls.spotify,
    album: item.track.album.name,
    albumImage: item.track.album.images[0]?.url,
    albumUrl: item.track.album.external_urls.spotify,
    spotifyUrl: item.track.external_urls.spotify,
  }));
}

export async function getTopArtists() {
  const accessToken = await getAccessToken();

  const response = await axios.get(
    "https://api.spotify.com/v1/me/top/artists?limit=10",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      validateStatus: () => true,
    }
  );

  console.log("Status:", response.status);

  if (response.status !== 200) {
    console.error(response.data);
    throw new Error("Failed to fetch top artists.");
  }

  return response.data.items.map((artist: any) => ({
    id: artist.id,
    name: artist.name,
    image: artist.images?.[0]?.url ?? null,
    genres: artist.genres ?? [],
    spotifyUrl: artist.external_urls?.spotify ?? "",
  }));
}

export async function getTopTracks() {
  const accessToken = await getAccessToken();

  const response = await axios.get(
    "https://api.spotify.com/v1/me/top/tracks?limit=10",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data.items.map((track: any) => ({
    id: track.id,
    name: track.name,
    artist: track.artists.map((a: any) => a.name).join(", "),
    artistUrl: track.artists[0].external_urls.spotify,
    album: track.album.name,
    albumImage: track.album.images[0]?.url,
    albumUrl: track.album.external_urls.spotify,
    spotifyUrl: track.external_urls.spotify,
    previewUrl: track.preview_url,
    duration: track.duration_ms,
    popularity: track.popularity,
  }));
}