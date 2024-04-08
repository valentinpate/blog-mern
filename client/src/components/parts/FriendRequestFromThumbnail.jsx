//página para ver las requests de los usuarios que quieren ser mod

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../css/clear.css';
import '../css/dark.css'
import { User } from '../../context/User';
import { DarkMode } from '../../context/DarkMode';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function FriendRequestFromThumbnail ({request_id, from, to}){
    const {dark} = useContext(DarkMode)
    const {user} = useContext(User)
    const { t } = useTranslation("global")
    const [userInfo, setUserInfo] = useState([])
    const friendLink = `/user/${from}`
    const navigate = useNavigate()
    const [ok, setOk] = useState(t("profile.friend-requests.thumbnail.from.accept"))

    useEffect(()=>{
        console.log("entro")
       async function getFrom(){
            console.log("info antes")
            const info = await axios.get(`http://localhost:3001/find/${from}`)
            console.log("info", info)
            if(info){
                setUserInfo(info.data)
            }
       }
       getFrom()
    },[])

  
    const acceptRequest = async (request_id) =>{
        console.log(request_id)
        try{
            const accept = await axios.post(`http://localhost:3001/u/add-friend`,  { withCredentials:true ,requestId : request_id , userFront : to}, {withCredentials:true}) //${userInfo._id}/
            console.log(request_id)
            if(accept.data.message == "friend request accept successfully"){
                const newUser = accept.data.newUser
                setOk(t("profile.friend-requests.thumbnail.from.ok"))
                localStorage.setItem("user", JSON.stringify(newUser))
                setTimeout(()=>{navigate("/profile")},1500)
            }
        }catch(e){
            console.log(request_id)
            console.log('error accepting friend request',e)
        }
    }

    const rejectRequest = async (request_id) =>{
        console.log(request_id)
        try{
            const petition = await axios.delete(`http://localhost:3001/u/${request_id}/delete-friend`, {withCredentials:true})
            .then(resp => {console.log(resp);setTimeout(()=>{window.location.reload()}, 1000)})
            .catch(err => {console.log(err)})
        }catch(e){
            console.log("Error when rejecting friend request",e)
        }
    }

    /*
    requests.length > 0 ?  
                    requests.map((request)=>{
                       return (<div key={request._id} className="request-thumbnail">
                            <p>{request.fromUser.name} quiere ser tu amigo</p>
                            <div className='request-actions'>
                                <button onClick={()=>acceptRequest(request._id)}>Aceptar</button>
                                <button onClick={()=>rejectRequest(request._id)}>Rechazar</button>
                            </div>
                       </div>)
                    })
                : 
                    <h1 style={{fontSize:"2rem",marginTop:"1em", marginLeft:"1.3em"}}>En este momento no hay ninguna solicitud de amistad.</h1>
                }
    */

    return (
        <div className="thumbnail">
            <div className="thumbnail-header">
                <h1 style={{marginRight:"0.3em"}}>{t("profile.friend-requests.thumbnail.from.title")}<Link to={friendLink} className={dark ? "drkmd underline" : "strhov underline"}>{userInfo != [] ? userInfo.name : "...."}</Link></h1>
                <div style={{display:"flex"}}>
                    <button className="header-btn signin-btn" onClick={()=> acceptRequest(request_id)}>{ok}</button>
                    <button className="header-btn signup-btn" onClick={()=> rejectRequest(request_id)}>{t("profile.friend-requests.thumbnail.from.reject")}</button>
                </div>
            </div>
        </div>
    );
}


export default FriendRequestFromThumbnail