import React , {useState, useEffect, useRef} from "react";
import Message from "./Message";
import {auth , db} from '../firebase';
import {query, doc, collection, orderBy, deleteDoc, updateDoc, onSnapshot}from 'firebase/firestore'
import { useAuthState } from "react-firebase-hooks/auth";
import SendMessage from "./SendMessage";

const Chat = ({roomID, roomName, roomOwner}) => {
    const [chatUser] = useAuthState(auth);
    const [isOwner, setIsOwner] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [messages, setMessages] = useState([]);
    const scroll = useRef()    
    useEffect(() => {
        //THIS CHECKS IF CHAT USER IS THE OWNER (GIVES THEM EDITING POWER)
        if (roomOwner === chatUser.displayName) {
            setIsOwner(chatUser.displayName);
          }
        //THIS GRABS THE SPECIFIC ROOM DOC FROM THE CHATS COLLECTION
        const chatRoomRef= doc(collection(db, 'chats'), roomID);
        //THIS GRABS THE SPECIFIC MESSAGES SUBCOLLECTION FROM THE ROOM DOC
        const messagesSubcollectionRef = collection(chatRoomRef, 'Messages');
        

        const q = query(messagesSubcollectionRef, orderBy('timestamp'));
        console.log(q)
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let messages = [];  
            querySnapshot.forEach((doc) => {
                messages.push({...doc.data(), id: doc.id});
            })
            setMessages(messages)
        })
        return () => unsubscribe();
    }, [roomName, roomOwner, chatUser])


    const chatRoomRef = doc(collection(db, "chats"), roomID);
    const deleteChatRoom = async () => {
      try {
        await deleteDoc(chatRoomRef);
        window.location.replace("/chat");
      } catch (error) {
        console.error("Error deleting chat: ", error);
      }
    };
    const editRoomName = async () => {
      const newName = "eeeeggeeess";
  
      try {
        await updateDoc(chatRoomRef, {
          name: newName,
        });
        window.location.replace("/chat");
      } catch (error) {
        console.error("Error editing chat: ", error);
      }
    };
  
    const openEditForm = () => {
        setShowForm(!showForm);
    };

    return (
    <>
      <div className="chat-component-main">
        <div className="chat-edit-container">
        <h1>CHAT ROOM:{roomName}</h1>
        {isOwner ? (
          <button onClick={deleteChatRoom} type="button">
                      DELETE CHAT
        </button>
        ) : null}
        <br/>
        <br/>
        {isOwner ? (
          <button onClick={openEditForm} type="button">
            EDIT CHAT
          </button>
        ) : null}
        
        {showForm && (
          <div>
            <form>
              <label>New Room Name:</label>
              <input type="text" />
              <button type="button" onClick={editRoomName}>Save</button>
              <br />
            </form>
          </div>
        )}

        </div>

        {messages && messages.map((message) => (
            <Message key={message.id} message={message}/>
        ))}
        
        </div>
        <SendMessage scroll={scroll} roomID={roomID}/>
        {/* Send Message Component */}
        <span ref={scroll}>

        </span>
    </>
  );
};

export default Chat;
