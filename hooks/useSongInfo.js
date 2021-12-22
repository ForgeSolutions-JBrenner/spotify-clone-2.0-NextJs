import useSpotify from "../hooks/useSpotify";
import { currentTrackIdState } from "../atoms/songAtom";
import { useRecoilState } from "recoil";
import { useState, useEffect } from "react";

function useSongInfo() {
  const spotifyApi = useSpotify();
  const [currentIdTrack, setcurrentIdTrack] =
    useRecoilState(currentTrackIdState);
  const [songInfo, setsongInfo] = useState(null);

  useEffect(() => {
    //So when the component mounts fetch the song information
    // You have to encapsulate async calls within a useeffect
    const fetchSongInfo = async () => {
      if (currentIdTrack) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentIdTrack}`,
          {
            headers: {
              //When you make request to api that access token is put inside the header and we can pass it around with a bearer and token
              //Now spotify knows that the guy is correct and has all the correct permissions
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        ).then((res) => res.json());

        setsongInfo(trackInfo);
        console.log(songInfo);
      }
    };
    fetchSongInfo();
  }, [currentIdTrack, spotifyApi]);

  return songInfo;
}

export default useSongInfo;
