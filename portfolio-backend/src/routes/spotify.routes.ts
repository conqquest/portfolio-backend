import { Router } from "express";
import axios from "axios";
import {
  nowPlaying,
  recentlyPlayed,
  topArtists,
  topTracks,
} from "../controllers/spotify.controller";

const router = Router();

const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-read-recently-played",
  "user-top-read",
];

router.get("/login", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: "code",
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    scope: scopes.join(" "),
  });

  res.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  );
});

router.get("/callback", async (req, res) => {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).json({
      message: "Authorization code missing.",
    });
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
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

    res.json({
      message:
        "Copy the refresh_token below into your .env file. You only need to do this once.",
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
      scope: response.data.scope,
    });
  } catch (err: any) {
    console.error(err.response?.data || err);

    res.status(500).json(
      err.response?.data || {
        message: "Spotify Authentication Failed",
      }
    );
  }
});

/* ---------------------- API Routes ---------------------- */

router.get("/api/spotify/now-playing", nowPlaying);

router.get("/api/spotify/recent", recentlyPlayed);

router.get("/api/spotify/top-artists", topArtists);

router.get("/api/spotify/top-tracks", topTracks);

export default router;