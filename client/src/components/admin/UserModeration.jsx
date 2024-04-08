//página de admin para moderar y administrar los usuarios

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../css/clear.css';
import '../css/dark.css'
import { User } from '../../context/User';
import { DarkMode } from '../../context/DarkMode';
import Header from '../../components/parts/Header';
import UserThumbnail from './admin-parts/UserThumbnail';
import { Link, useNavigate, useParams} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function UserModeration (){
    const {user, language, setLanguage} = useContext(User)
    const {dark} = useContext(DarkMode)
    const [users, setUsers] = useState([])
    const { t } = useTranslation("global")

    useEffect(()=>{
        async function getUsers(){
            const petition = await axios.get("http://localhost:3001/role/get-all")
            if(petition != null){
                setUsers(petition.data)
            }
        }
        //getUsers()
    },[])


    /*
        requests.map((r)=>{
            const requestLink = `/mod/request/${r.userId}`
            return <Link to={requestLink}><RequestThumbnail mail={r.mail} /></Link>
        })
    */


    return (
        <div className="bg-5">
        <Header/>
        <section className={dark ? "font userboard dark-dashboard" : "font userboard clear-dashboard"}>
            <div className="dashboard-header">
              <h1>{t("mod.user-moderation.header")}</h1>
            </div>
        </section>
        <section className={dark ? "font dashboard dark-dashboard" : "font dashboard clear-dashboard"}>
            <div className="dashboard-header">
              <h1>{t("mod.requests-list.header")}</h1>
            </div>
            <div className="posts">
                {users.length > 0 ?  
                    users.map((u)=>{
                        const userLink = `/user/${u._id}`
                        return <Link to={userLink}><UserThumbnail id={u._id} name={u.name} img={u.img} /></Link>
                    })
                : 
                    <h1 style={{fontSize:"2rem",marginTop:"1em", marginLeft:"1.3em"}}>{t("mod.requests-list.no-requests")}</h1>
                }
            </div>
        </section>
        </div>
    )
}


export default UserModeration