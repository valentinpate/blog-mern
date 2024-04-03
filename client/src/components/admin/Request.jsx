//página para ver las requests de los usuarios que quieren ser mod

import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import '../../App.css'
import '../css/clear.css';
import '../css/dark.css'
import { User } from '../../context/User';
import { DarkMode } from '../../context/DarkMode';
import Header from '../../components/parts/Header';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Request (){
    const {user, language, setLanguage} = useContext(User)
    const { t } = useTranslation("global")
    const {dark} = useContext(DarkMode)
    const {userId} = useParams()
    const navigate = useNavigate()
    const [request, setRequest] = useState([])
    const [ok, setOk] = useState(t("profile.friend-requests.thumbnail.from.accept"))
    const [error, setError] = useState("")

    useEffect(()=>{
        async function getRequest(){
            const petition = await axios.get(`http://localhost:3001/role/${userId}/get-req`)
            console.log(petition)
            if(petition){
                setRequest(petition.data)
            }
        }
        getRequest()
    },[])

    const acceptRequest = async () => {
        try {
            console.log({ userId: user._id })
            const response = await axios.post(`http://localhost:3001/role/${userId}/code-generate-send-email`,{userId : user._id});
            console.log('come front acceptRequest', user)
            console.log('come front',userId)
            if (response.data.success) {
                setOk(t("profile.friend-requests.thumbnail.from.ok"));
                setTimeout(()=>{navigate("/mod/requests")}, 1000)
            } else {
                setError("ERROR: Error al aceptar la solicitud, inténtelo de nuevo más tarde.");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("ERROR: Ocurrió un error. Por favor, intenta de nuevo más tarde.");
        }
    };

    const rejectRequest = async () => {
        const del = await axios.delete(`http://localhost:3001/role/${userId}/reject-req`, {withCredentials:true})
        if(del.data == "del"){
            setTimeout(()=>{navigate("/mod/requests")}, 1000)
        }else{
            console.log(del.data)
        }
    }

    return (
        <div className="bg-5">
            <Header/>
            <div className='font ms-4'>
                {request.length != [] ? 
                <>
                <section className={dark ? "post dark-bg" : "post clear-bg"}>
                    <div className="post-header">
                        <h1>{t("mod.request.thumbnail-title")}{request.mail}</h1>
                    </div>
                    <p className="post-body">{request.body}</p>
                    <div className="add-post-form-button">
                        <button className="add-btn signin-btn" onClick={acceptRequest}>{ok}</button>
                        <button className="add-btn signup-btn" onClick={rejectRequest}>{t("profile.friend-requests.thumbnail.from.reject")}</button>
                    </div>
                    {/* <div className="post-buttons"></div> */}
                </section>
                <section className={dark ? "post dark-bg" : "post clear-bg"}>
                    <h3>{t("mod.request.important")}</h3>
                    <p style={{fontWeight:"bold"}}>
                    {t("mod.request.p-1")} <br /> 
                    {t("mod.request.p-2")}</p>
                    <p style={{fontWeight:"bold", color:"red"}}>{error}</p>
                </section>
                </>
                
                : "no hay"}
            </div>
        </div>
    )
}


export default Request