//página para preguntarle a los mods o solicitar ser mod

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../../App.css';
import '../css/clear.css'
import '../css/dark.css'
import { User } from '../../context/User';
import { DarkMode } from '../../context/DarkMode';
import Header from '../parts/Header';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function ModRequest() {
  const {user} = useContext(User)
  const { t } = useTranslation("global")
  const {dark, setDark} = useContext(DarkMode)
  const [mail, setMail] = useState("")
  const [body, setBody] = useState("")
  const [text, setText] = useState(t("mod-request.request.text.default"))
  const navigate = useNavigate()

  useEffect(()=>{
    const darkSt = localStorage.getItem("dark")
    if(darkSt === "true"){
      setDark(true)
    }else{
      setDark(false)
    }
  },[dark])

  const createRequest = async(e)=>{
    e.preventDefault()
    if(mail == "" || body == ""){
      setText(t("mod-request.request.text.all-fields"))
    }else{
      if(mail != user.email){
        setText(`${t("mod-request.request.text.mail")}${user.email}`)
      }else{
        const send = await axios.post("http://localhost:3001/role/request", {id:user._id, mail:mail, body:body})
        if(send.data == "done"){
          setText(t("mod-request.request.text.ok"))
          setTimeout(()=>{navigate("/dashboard")}, 1000)
        }else{
          setText(t("mod-request.request.text.error"))
        }
      }
    }
    
  }

  return (
    <div className="bg-1">
        <Header/>
        <section className={dark ? "font add-post dark-add-post" : "font add-post clear-add-post"}>
            <h1>{t("mod-request.request.header")}</h1>
            <form className="add-post-form">
              <div className="add-post-form-section">
                <label htmlFor="">Mail:</label>
                <input type="text" className={dark ? "add-input dark-add-input" : "add-input clear-add-input"} value={mail} onChange={(e)=>{setMail(e.target.value)}}/>
              </div>
              <div className="add-post-form-section">
                <label htmlFor="">{t("mod-request.request.explain")}</label>
                <textarea name="" id="" cols="30" rows="10" className={dark ? "add-textarea dark-add-textarea" : "add-textarea clear-add-textarea"}
                  value={body} onChange={(e)=>{setBody(e.target.value)}} ></textarea>
              </div>
              <p className="request-text">{text}</p>
              <div className="add-post-form-button">
                <Link><button className="add-btn signin-btn" onClick={createRequest}>{t("mod-request.request.send")}</button></Link>
                <Link to="/dashboard"><button type="button" className="add-btn signup-btn">{t("mod-request.request.cancel")}</button></Link>
                {/* <Link to="/mod/code"><button type="button" className="header-btn signup-btn">code</button></Link>
                <Link to="/mod/requests"><button type="button" className="header-btn signup-btn">requests</button></Link>
                <Link to="/sfsfsf"><button type="button" className="header-btn signup-btn">no page</button></Link> */}
              </div>
            </form>
        </section>
    </div>
  );
}

export default ModRequest;