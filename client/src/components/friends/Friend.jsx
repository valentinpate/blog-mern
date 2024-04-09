//página de amigo

import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';
import '../css/clear.css'
import '../css/dark.css'
import Header from '../parts/Header';
import PostThumbnail_onProfile from '../parts/PostThumbnail_onProfile';
import { DarkMode } from '../../context/DarkMode';
import { User } from '../../context/User';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from "react-i18next"

function Friend() {
  const {user} = useContext(User)
  const {dark, setDark} = useContext(DarkMode)
  const {userId} = useParams()
  const { t } = useTranslation("global")
  const [thisUser, setThisUser] = useState([])
  const [userPosts, setUserPosts] = useState([])
  const [sent, setSent] = useState(t("profile.friend.request.send"))
  const [dlt, setDlt] = useState(t("profile.friend.request.delete"))
  const [friended, setFriended] = useState(false)
  const navigate = useNavigate()

  useEffect(()=>{
    console.log("get my posts")
    async function getUser(){
        const petition = await axios.get(`http://localhost:3001/u/${userId}/get`)
        if(petition.data != null || "no hay usuario"){
            setThisUser(petition.data)
        }
    }
    async function getPosts(){
        const petition = await axios.get(`http://localhost:3001/u/${userId}/get-posts`)
        if(petition.data != null || "no hay posts"){
            setUserPosts(petition.data)
        }
    }
    getUser()
    getPosts()
  },[user])

  useEffect(()=>{
    if(thisUser){
      console.log(user._id, thisUser._id)
      async function findRequest(){
        const petition = await axios.post("http://localhost:3001/u/find", {fromId: user._id, toId: thisUser._id}, {withCredentials:true})
        if(petition.data.state === "Found"){
          setSent(t("profile.friend.request.sent"))
        }
      }
      findRequest()
    }
  },[user, thisUser])

  useEffect(()=>{
    if(thisUser){
      const index = user.friends.findIndex(f => f._id === thisUser._id)
      console.log(index, thisUser, user)
      if(index != -1){
        setFriended(true)
      }
    }
  },[user, thisUser])

  useEffect(()=>{
    const darkSt = localStorage.getItem("dark")
    if(darkSt === "true"){
      setDark(true)
    }else{
      setDark(false)
    }
  },[dark])

  const sentRequestFriend = async () => { 
      try{
        const response = await axios.post(`http://localhost:3001/u/${userId}/sent-request-friend`, {userFront : user._id, request : "Solicitud de amistad enviada" }, {withCredentials:true})
        setSent(t("profile.friend.request.sent"))
        console.log(' i am RESPONSE', response.data)
        setTimeout(()=>{navigate("/profile")}, 1000)
      } catch (e){
        console.log('error when adding friend FRONT',e)
      }
  }

  const noFriend = async() => {
    try{
      const petition = await axios.post(`http://localhost:3001/u/pull-friend`, {userId: user._id, friendId: thisUser._id}, {withCredentials:true})
      if(petition.data.state === "Friend deleted"){
        const newUser = petition.data.newUser
        console.log(petition)
        setDlt(t("profile.friend.request.deleted"))
        localStorage.setItem("user", JSON.stringify(newUser))
        setTimeout(()=>{navigate("/profile")},1500)
      }else{
        console.log(petition)
      }
    }catch(err){
      console.log(err)
    }
  }

 /*userPosts.map((p)=>{
              const post = `/post/${p.user}/${p._id}`
              return (<Link to={post}><PostThumbnail key={p._id}
                  title={p.title} 
                  username={p.username} 
                  date={p.date.slice(0, 10)} 
                  body={p.body} 
                  likes={p.likes} 
                  visits={p.visits} 
                  comments={p.comments} /> 
            </Link>)})*/
// console.log(thisUser)
//onClick={addFriend} en linea 79
  return (
    <div className="bg-4 font prof">
        <Header/>
        <section className={dark ? "profile dark-profile" : "profile clear-profile"}>
            <div className="profile-header">
              <h1>{thisUser != [] ? thisUser.name : "//////"} - {thisUser != [] ? thisUser.role : "///////"}</h1>
              <img src={thisUser != [] ? thisUser.image : "../../public/blank_user.png"} alt="User profile" />
            </div>
            <div className="profile-section">
              <div className="profile-align">
                <div className="user-mail">
                  <h2>Mail: {thisUser != [] ? thisUser.email : "///////"}</h2>
                  <div>
                    {thisUser.friends.some(f=>f._id === user._id) ? //si el usuario amigo me tiene en sus amigos a mí
                    <button className="friend-btn signin-btn">{t("profile.friend.friend")}</button>
                    : 
                    <button onClick={()=>{if(sent != t("profile.friend.request.sent")){sentRequestFriend()}}} className="friend-btn signin-btn">{sent}</button>
                    }
                    {friended && <button onClick={noFriend} className="friend-btn signup-btn">{dlt}</button>}
                  </div>
                </div>
              </div>
            </div>
        </section>
        <div className={dark ? "profile-posts dark-profile-posts" : "profile-posts clear-profile-posts"}>
          <h2 style={{textDecoration:"underline"}}>{t("profile.friend.entries")}{thisUser != [] ? thisUser.name : "//////"}</h2>
          {userPosts.length > 0 
            ? 
            userPosts.map((p)=>{
                const post = `/post/${p.user}/${p._id}`
                return (<Link to={post}><PostThumbnail_onProfile key={p._id}
                    title={p.title} 
                    username={p.username} 
                    date={p.date.slice(0, 10)} 
                    body={p.body} 
                    likes={p.likes} 
                    visits={p.visits} 
                    comments={p.comments} /> 
              </Link>)})
            : 
            <h2>{t("profile.friend.no-posts.1")}{thisUser != [] ? thisUser.name : "//////"}{t("profile.friend.no-posts.2")}</h2>}
        </div>
    </div>
  );
}

export default Friend;