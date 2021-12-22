import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/time";
import {useRecoilState} from 'recoil'
import {currentTrackIdState, isPlayingState} from '../atoms/songAtom'

function Song({ order, track }) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setcurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setcurrentTrackId(track.track.id);
    setIsPlaying(true);
    spotifyApi.play({
        uris: [track.track.uri], //uniform resource identifier

    })
  }

  return (
    <div className="grid grid-cols-2 text-gray-500 py-1 pl-4
    px-1 hover:bg-[#2f2f31] hover:text-white rounded-md cursor-pointer"
    onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img
          src={track.track.album.images[0].url}
          alt=""
          className="w-10 h-10"
        />
        <div>
          <p className="w-36 lg:w-64 text-white truncate">{track.track.name}</p>
          <p className="w-40 text-white-500">{track.track.artists[0].name}</p>
        </div>
      </div>

      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-40 hidden md:inline">{track.track.album.name}</p>
        <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
      </div>
    </div>
  );
}

export default Song;
