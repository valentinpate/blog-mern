//miniatura para usuario en UserModeration


import axios from 'axios';
import { useContext, useState } from 'react';
import '../../../App.css';
import '../../css/clear.css'
import '../../css/dark.css'
import { DarkMode } from '../../../context/DarkMode';
import { User } from '../../../context/User';
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from 'react-i18next';

function UserThumbnail({id, name, img}) {
  const {dark} = useContext(DarkMode)
  const {user} = useContext(User)
  const [banning, setBanning] = useState(false)
  const [cause, setCause] = useState("")
  const [banText, setBanText] = useState("")
  const { t } = useTranslation("global")
  const navigate = useNavigate()
  const link = `/user/${id}`

  const ban = async (e) => {
    e.preventDefault()
    if(cause === ""){
      setBanText(t("mod.user-moderation.moderation.please-cause"))
    }else{
      const petition = await axios.post(`http://localhost:3001/role/${id}/ban`, {name:name, cause:cause})
      if(petition.data.state === "User banned"){
        console.log(petition.data.bannedUser)
        console.log(petition.data.ban)
        setBanText(t("mod.user-moderation.moderation.banned"))
        setTimeout(()=>{navigate("/mod/requests")}, 1000)
      }
    }
  }

  return (
    <div className="thumbnail">
        <div className="thumbnail-header">
            {banning ? <div className="ban-section">
                <div className="thumbnail-header" style={{alignItems:"center"}}>
                  <h1 className={dark ? "drkmd" : "strhov"}>{t("mod.user-moderation.moderation.sure")}<span style={{color:"black"}}>{name}</span></h1>
                  <button className="like not-liked close" onClick={()=>{setBanning(false)}}><i class="bi bi-x-lg"></i></button>
                </div>
                <form action="" className="comment-form edit-form" onSubmit={ban}>
                  <label>{t("mod.user-moderation.moderation.cause")}</label>
                  <textarea name="" id="" cols="30" rows="10" className="add-textarea comment-textarea" 
                  style={{marginTop:"1em",marginLeft:"1em", width:"97%"}} value={cause} onChange={(e)=>{setCause(e.target.value)}}></textarea>
                  <button className="add-btn signup-btn">{t("mod.user-moderation.moderation.ban")}</button>
                  <label>{banText}</label>
                </form>
              </div>
            :
              <>
                <Link to={user.name === name ? "/profile" : link}><h1 className={dark ? "drkmd underline" : "strhov underline"}>{name}</h1></Link>
                <div className="user-thumbnail-img">
                  <img src={img} alt="Imagen" className="friend-picture" style={{marginRight:"0.5em"}}/>
                  <button className="header-btn signup-btn" onClick={()=>{setBanning(true)}}>{t("mod.user-moderation.moderation.ban")}</button>
                </div>
              </>
            }
        </div>
    </div>
  );
}

export default UserThumbnail;