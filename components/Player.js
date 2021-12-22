import { useSession } from "next-auth/react";
import useSpotify from "../hooks/useSpotify";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import { useCallback, useEffect, useState } from "react";
import {  useRecoilState } from "recoil";
import useSongInfo from "../hooks/useSongInfo";
import {
  VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";
import {
  RewindIcon,
  HeartIcon,
  SwitchHorizontalIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";

function Player() {
  const { data: session, status } = useSession();
  const spotifyApi = useSpotify();
  const [currentTrackId, setcurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setcurrentTrackId(data.body?.item?.id);
        //Will return is current song playing yes/no ie true or false
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

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
  console.log(isPlaying);
  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      //Fetch the song info if the track and access token are valid
      fetchCurrentSong();
      setVolume(100);
    }
  }, [currentTrackIdState, spotifyApi, session]);

  useEffect(() => {
    if(volume >0 && volume < 100) {
        debounceAdjustVolume(volume);
    }

}, [volume])

const debounceAdjustVolume = useCallback(
    debounce((volume) => {
        spotifyApi.setVolume(volume).catch((err) => {});
    }, 100),
    [],
)

  return (
    <div
      className=" h-24 bg-gradient-to-b from-[#181818] to-black border-t-[1px] border-gray-700
    grid grid-cols-3 text-xs md:text-base px-2 md:px-8"
    >
      {/* Left */}
      <div className="flex items-center">
        <img
          src={songInfo?.album.images?.[0]?.url}
          alt=""
          className="hidden md:inline h-10 w-10"
        />
        <div className="text-white pl-3">
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
          <HeartIcon className="button pr-2 text-green-500"/>

        </div>
      </div>

      {/* Center grid column of the player */}
      <div className="flex items-center justify-evenly  text-white">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon
          className="button"
          onClick={() => spotifyApi.skipToPrevious()} 
        />

        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
        )}
        <FastForwardIcon
          className="button"
          onClick={() => spotifyApi.skipToNext() && playSong} 
        />
        <ReplyIcon className="button" />
      </div>

      {/* Right side of the player */}
      <div className="flex items-center justify-end space-x-3 md:space-x-4 pr-5 text-white">
        <VolumeDownIcon
          className="button"
          onClick={() => volume > 0 && setVolume(volume - 10)}
        />
        <input
          type="range"
          className="w-14 md:w-28"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
        />

        <VolumeUpIcon
          className="button"
          onClick={() => volume < 100 && setVolume(volume + 10)}
        />
      </div>
    </div>
  );
}

export default Player;
