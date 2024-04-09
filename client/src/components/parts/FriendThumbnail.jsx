//miniatura para amigo en profile/friends/requests


import axios from "axios"
import { useContext, useState, useEffect } from 'react';
import '../../App.css';
import '../css/clear.css'
import '../css/dark.css'
import { DarkMode } from '../../context/DarkMode';
import { User } from "../../context/User";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom"

function FriendThumbnail({id, name, img}) {
  const {dark} = useContext(DarkMode)
  const {user} = useContext(User)
  const [banned, setBanned] = useState(false)
  const {t} = useTranslation("global")
  const navigate = useNavigate()
  let userLink = `/user/${id}`

  useEffect(()=>{
    async function checkIfBanned(){
      console.log(id, name)
      const petition = await axios.post("http://localhost:3001/if-banned", {id:id, username:name}, {withCredentials:true})
      if(petition.data.state === "Banned" && petition.data.ban != null){
        setBanned(true)
      }else{
        console.log(petition)
      }
    }
    checkIfBanned()
  },[])

  const deleteBannedFriend = async() => {
    try{
      const petition = await axios.post(`http://localhost:3001/u/pull-friend`, {userId: user._id, friendId: id}, {withCredentials:true})
      if(petition.data.state === "Friend deleted"){
        const newUser = petition.data.newUser
        localStorage.setItem("user", JSON.stringify(newUser))
        setTimeout(()=>{navigate("/profile")},1500)
      }else{
        console.log(petition)
      }
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className="thumbnail">
        <div className="thumbnail-header">
            <Link to={userLink}><h1 className={dark ? "drkmd" : "strhov"}>{banned ? t("misc.banned") : name}</h1></Link>
            {banned ? 
              <div className="user-thumbnail-img">
                <img src={img} alt="Imagen" className="friend-picture" />
                <button className="friend-btn signup-btn" onClick={deleteBannedFriend}>{t("profile.friend.request.delete")}</button>
            </div> 
            : <img src={img} alt="Imagen" className="friend-picture" />}
        </div>
    </div>
  );
}

export default FriendThumbnail;