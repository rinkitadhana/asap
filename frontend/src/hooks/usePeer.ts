import { useEffect, useRef, useState } from "react"
import { Peer } from 'peerjs';

const usePeer = () => {
    const [peer, setPeer] = useState<Peer | null>(null);
    const [myId, setMyId] = useState('');
    const isPeerSet = useRef(false);
    
    useEffect(()=>{
        if(isPeerSet.current) return;
        isPeerSet.current = true;
        (async function initPeer(){
            const myPeer = new (await import('peerjs')).default();
            setPeer(myPeer)

            myPeer.on('open', (id)=>{
                console.log('My peer ID is: ', id);
                setMyId(id);
            })
        })()
    },[])

    return{peer, myId}

}

export default usePeer;