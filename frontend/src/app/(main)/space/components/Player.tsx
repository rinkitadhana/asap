import ReactPlayer from 'react-player';

const Player = (props: {playerId: string, url: string, muted: boolean, playing: boolean}) => {
    const {playerId, url, muted, playing} = props
    return(
        <div>
            <ReactPlayer key={playerId} controls={true} playing={playing} muted={muted} src={url} />
        </div>
    )
}

export default Player;
