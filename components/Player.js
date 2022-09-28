import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import useSongInfo from "../hooks/useSongInfo";
import {
  ArrowsRightLeftIcon,
  BackwardIcon,
  PlayCircleIcon,
  SpeakerWaveIcon,
  PauseCircleIcon,
  ForwardIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/solid";
import { SpeakerWaveIcon as SpeakerWaveIconDown } from "@heroicons/react/24/outline";
import { debounce } from "lodash";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const songInfo = useSongInfo();

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };
  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now Playing: ", data.body?.item.name);
        setCurrentTrackId(data.body?.item?.id);
      });
      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        setIsPlaying(data.body?.is_playing);
      });
    }
  };
  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      // fetch song info
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi]);

  const debounceAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {});
    }, 250),
    []
  );

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceAdjustVolume(volume);
    }
  }, [volume]);

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white px-2 grid grid-cols-3 text-sm md:text-base md:px-8">
      {/* Left */}
      <di className="flex items-center space-x-4 ">
        {/* es-lint */}
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album.images?.[0].url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0].name}</p>
        </div>
      </di>
      {/* Center */}
      <div className="flex items-center justify-evenly">
        <ArrowsRightLeftIcon className="button" />
        <BackwardIcon className="button" />

        {isPlaying ? (
          <PauseCircleIcon
            onClick={handlePlayPause}
            className="button w-10 h-10"
          />
        ) : (
          <PlayCircleIcon
            onClick={handlePlayPause}
            className="button w-10 h-10"
          />
        )}
        <ForwardIcon className="button" />
        <ArrowUturnLeftIcon className="button " />
      </div>

      {/* Right */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <SpeakerWaveIconDown
          onClick={() => {
            if (volume > 0) {
              setVolume(volume - 10);
            }
          }}
          className="button"
        />
        <input
          className="w-14 md:w-28"
          value={volume}
          onChange={(e) => {
            setVolume(Number(e.target.value));
            console.log("Volume: ", volume);
          }}
          type="range"
          min={0}
          max={100}
        />
      </div>
    </div>
  );
}

export default Player;
