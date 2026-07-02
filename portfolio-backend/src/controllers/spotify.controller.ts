import { Request, Response } from "express";
import {
  getNowPlaying,
  getRecentlyPlayed,
  getTopArtists,
  getTopTracks,
} from "../services/spotify.service";

export async function nowPlaying(req: Request, res: Response) {
  try {
    const song = await getNowPlaying();

    if (!song) {
      return res.status(200).json({
        isPlaying: false,
        message: "Nothing is currently playing.",
      });
    }

    res.status(200).json(song);
  } catch (error) {
    console.error("Now Playing Error:", error);

    res.status(500).json({
      message: "Failed to fetch currently playing song.",
    });
  }
}

export async function recentlyPlayed(req: Request, res: Response) {
  try {
    const songs = await getRecentlyPlayed();

    res.status(200).json(songs);
  } catch (error) {
    console.error("Recently Played Error:", error);

    res.status(500).json({
      message: "Failed to fetch recently played tracks.",
    });
  }
}

export async function topArtists(req: Request, res: Response) {
  try {
    const artists = await getTopArtists();

    res.status(200).json(artists);
  } catch (error: any) {
  console.error(error.response?.data || error);

  res.status(500).json(error.response?.data || error.message);
}
}

export async function topTracks(req: Request, res: Response) {
  try {
    const tracks = await getTopTracks();

    res.status(200).json(tracks);
  } catch (error) {
    console.error("Top Tracks Error:", error);

    res.status(500).json({
      message: "Failed to fetch top tracks.",
    });
  }
}