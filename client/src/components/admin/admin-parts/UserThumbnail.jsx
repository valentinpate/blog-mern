//miniatura para usuario en UserModeration


import axios from 'axios';
import { useContext, useState } from 'react';
import '../../../App.css';
import '../../css/clear.css'
import '../../css/dark.css'
import { DarkMode } from '../../../context/DarkMode';
import { useNavigate } from "react-router-dom"
import { useTranslation } from 'react-i18next';

function UserThumbnail({id, name, img}) {
  const {dark} = useContext(DarkMode)
  const { t } = useTranslation("global")
  const navigate = useNavigate()

  const ban = async () => {
    const petition = await axios.delete(`http://localhost:3001/${id}/ban`)
    if(petition.data.state === "User banned"){
        setTimeout(()=>{navigate("/mod/requests")})
    }
  }

  return (
    <div className="thumbnail">
        <div className="thumbnail-header">
            <h1 className={dark ? "drkmd" : "strhov"}>{name}</h1>
            <img src={img} alt="Imagen" className="friend-picture" />
            <button className="header-btn signup-btn">Eliminar</button>
        </div>
    </div>
  );
}

export default UserThumbnail;