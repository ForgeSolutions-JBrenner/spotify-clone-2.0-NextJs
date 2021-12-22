import { ChevronDownIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Menu from "../components/utils/Menu";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

function Center() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [color, setcolor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  //Changes the header color based on the playlistId change from atoms and use recoil
  useEffect(() => {
    setcolor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => console.log("Something went wrong! ", err));
  }, [spotifyApi, playlistId]);
  console.log(playlist);
  return (
    <div className="flex-grow bg-[#171717]">
      <header className="absolute top-5 r-8 text-white right-6">
        <div
          className="flex items-center bg-black space-x-3
        opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2"
        >
          <img
            className="rounded-full w-10 h-10 "
            src={session?.user.image}
            alt="profile_pic"
          />
          <h2>{session?.user.name}</h2>
          <Menu />
        </div>
      </header>

      <section
        className={`flex items-end space-x-7  bg-gradient-to-b to-black ${color} h-80 text-white padding-8`}
      >
        <img
          src={playlist?.images?.[0]?.url}
          alt="playlist image"
          className="h-56 w-56 shadow-2xl ml-5 mb-5 rounded-md"
        />
        <div className="mb-10">
          <p>PLAYLIST</p>
          <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
            {playlist?.name}
          </h1>
          <h4>{playlist?.description}</h4>
          <span><strong>Spotify</strong> - {playlist?.tracks.total} songs </span>
        </div>
      </section>
      <div className="h-screen mt-10 overflow-y-scroll scrollbar-hide">
        <Songs />
      </div>
    </div>
  );
}

export default Center;
