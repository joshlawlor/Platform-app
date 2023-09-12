import React, {useState, useEffect} from 'react'
import Navbar from '../Navbar/Navbar'
import { useLocation } from 'react-router-dom'
import Chat from '../../components/Chat'
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const ChatRoom = () => {
    const [chatUser] = useAuthState(auth);
    const [isOwner, setIsOwner] = useState(null)
    const location = useLocation()
    const roomID = location.state.id
    const roomName  = location.state.name
    
  useEffect(() => {
    if (chatUser === null) {
      window.location.replace('/');
    }

    const roomOwner = location.state.owner;

    if (roomOwner === chatUser.displayName) {
      setIsOwner(chatUser.displayName);
    }
  }, [chatUser]);
  return (
    <div>
        <Navbar></Navbar>
        <div>
            <h1>CHAT ROOM:{roomName}</h1>
            {isOwner ? <button type="button">DELETE</button>: null}
                      {chatUser ? <Chat roomName={roomName} roomID={roomID}/> : null}

        </div>
    </div>
  )
}

export default ChatRoom