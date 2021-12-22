import { HomeIcon,
SearchIcon,
LibraryIcon,
PlusCircleIcon,
HeartIcon,
RssIcon,
LogoutIcon
} from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { playlistIdState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';

function Sidebar() {  
  //Creating the middleware
    const { data: session, status} = useSession();
    const spotifyApi = useSpotify();
    const [playlists, setplaylists] = useState([]);  
    const [playlistId, setplaylistId] = useRecoilState(playlistIdState);

    console.log("you picked playlist:" , playlistId);

    useEffect(() => {
        if(spotifyApi.getAccessToken()) {
           spotifyApi.getUserPlaylists().then((data) => {
               setplaylists(data.body.items);
           }) 
        }
    }, [session, spotifyApi])

    return (
        <div className=' text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900
        overflow-y-scroll scrollbar-hide h-screen w-[21rem] pb-36'>
            <div className='space-y-4 '>
                {/* <button className='flex items-center space-x-2 h-full hover:text-white hover:bg-gray-400 rounded-sm'
                onClick={() => signOut()}
                >
                    <LogoutIcon className='h-5 w-5'/>
                    <p>Logout</p>
                </button> */}
                <button className='flex items-center space-x-2 w-full h-full hover:text-white hover:bg-gray-400 rounded-sm'>
                    <HomeIcon className='h-5 w-5'/>
                    <p>HOME</p>
                </button>
                <button className='flex items-center space-x-2 w-full h-full hover:text-white hover:bg-gray-400 rounded-sm'>
                    <SearchIcon className='h-5 w-5'/>
                    <p>SEARCH</p>
                </button>
                <button className='flex items-center space-x-2 w-full h-full hover:text-white hover:bg-gray-400 rounded-sm'>
                    <LibraryIcon className='h-5 w-5'/>
                    <p>YOUR LIBRARY</p>
                </button>
                <hr className='border-t-[0.1px] border-gray-900'/>
                <button className='flex items-center space-x-2 w-full h-full hover:text-white hover:bg-gray-400 rounded-sm'>
                    <PlusCircleIcon className='h-5 w-5'/>
                    <p>CREATE PLAYLIST</p>
                </button>
                <button className='flex items-center space-x-2 w-full h-full hover:text-white hover:bg-gray-400 rounded-sm'>
                    <HeartIcon className='h-5 w-5'/>
                    <p>LIKED SONGS</p>
                </button>
                <button className='flex items-center space-x-2 w-full h-full hover:text-white hover:bg-gray-400 rounded-sm'>
                    <RssIcon className='h-5 w-5'/>
                    <p>YOUR EPISODES</p>
                </button>
                <hr className='border-t-[0.1px] border-gray-900'/>
                {/* HERE WE WILL RENDER OUT ALL OF THE PLAYLISTS COMING FROM THE API */}
                <div className='space-x-2 space-y-2 overflow-y-scroll scrollbar-hide'>
                {playlists.map((playlist) => (
                    <p key={playlist.id} onClick={() => setplaylistId(playlist.id)} className='cursor-pointer hover:text-white'>{playlist.name}</p>
                ))}
                </div>
            
            </div>
        </div>
    )
}

export default Sidebar
