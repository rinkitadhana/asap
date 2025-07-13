import ReactPlayer from 'react-player';

const Player = (props: {playerId: string, url: string | MediaStream | null, muted: boolean, playing: boolean, className: string}) => {
    const {playerId, url, muted, playing, className} = props
    
    if (!url) {
        return <div className={className}></div>;
    }
    
    return(
        <div>
            <ReactPlayer key={playerId} controls={true} playing={playing} muted={muted} src={url as string} className={className} />
        </div>
    )
}

export default Player;
