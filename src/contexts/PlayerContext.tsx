import { createContext, ReactNode, useContext, useState } from "react";

interface PlayerProviderProps {
    children: ReactNode
}

interface Episode {
    title: string,
    members: string,
    thumbnail: string,
    duration: number,
    url: string
}

interface PlayerContextData {
    episodeList: Array<Episode>,
    currentEpisodeIndex: number,
    isPlaying: boolean,
    hasNext: boolean,
    hasPrevious: boolean,
    isLooping: boolean,
    isShuffling: boolean
    toggleShuffle: () => void,
    toggleLoop: () => void,
    togglePlay: () => void,
    clearPlayerState: () => void,
    playList: (list: Array<Episode>, index: number) => void,
    playNext: () => void,
    playPrevious: () => void,
    setPlayingState: (state: boolean) => void,
    play: (episode: Episode) => void
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({ children }: PlayerProviderProps) {

    const [episodeList, setEpisodeList] = useState([])
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLooping, setIsLooping] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)

    function play(episode: Episode) {

        setEpisodeList([episode])
        setCurrentEpisodeIndex(0)
        setIsPlaying(true)
    }

    function playList(list: Array<Episode>, index: number) {
        setEpisodeList(list)
        setCurrentEpisodeIndex(index)
        setIsPlaying(true)
    }

    function togglePlay() {
        setIsPlaying(!isPlaying)
    }

    function toggleShuffle() {

        setIsShuffling(!isShuffling);
    }

    function toggleLoop() {
        setIsLooping(!isLooping)
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state)
    }

    const hasPrevious = currentEpisodeIndex > 0
    const hasNext = isShuffling || (currentEpisodeIndex + 1)  < episodeList.length

    function playNext() {
        if (isShuffling){

            const nexEpisodeRandomIndex = Math.floor(Math.random() * episodeList.length)
            setCurrentEpisodeIndex(nexEpisodeRandomIndex) 
        }
        else if(hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1)
        }
        
    }

    function playPrevious() {
        
        if(hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1)
        }
    }

    function clearPlayerState() {
        setEpisodeList([])
    }
    
    return (

        <PlayerContext.Provider value={{ 
            episodeList, 
            currentEpisodeIndex, 
            play,
            playList,
            playNext,
            playPrevious,
            isShuffling,
            toggleShuffle,
            isPlaying, 
            togglePlay, 
            setPlayingState,
            hasNext,
            hasPrevious,
            isLooping,
            toggleLoop,
            clearPlayerState
            }}
            >

            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {

    return useContext(PlayerContext)
}