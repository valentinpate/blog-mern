//página para meter código y ser mod

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

function ModCode() {
  const {user, setUser, LogOut} = useContext(User)
  const { t } = useTranslation("global")
  const {dark, setDark} = useContext(DarkMode)
  const [code, setCode] = useState("")
  const [conf, setConf] = useState("")
  const [text, setText] = useState(t("mod-request.code.text.text"))
  const navigate = useNavigate()

  useEffect(()=>{
    const darkSt = localStorage.getItem("dark")
    if(darkSt === "true"){
      setDark(true)
    }else{
      setDark(false)
    }
  },[dark])

  const sendCode = async(e) => {
    e.preventDefault()
    if(code == "" || conf == ""){
        setText(t("mod-request.code.text.incomplete"))
    }else if(code === conf && code.length === 7){
        const send = await axios.post(`http://localhost:3001/role/${user._id}/verify-code`, {code:code})
        if(send.data.message === 'Code verified correctly. The user is now a Mod.'){
            setText(t("mod-request.code.text.ok"))
            setTimeout(()=>{LogOut(); navigate("/")}, 3000)
        }
    }else{
        console.log("no hay código")
        setText(t("mod-request.code.text.error"))
    }
  }

  return (
    <div className="bg-5">
        <Header/>
        <section className={dark ? "font add-code dark-add-post" : "font add-code clear-add-post"}>
            <h1>{t("mod-request.code.header")}</h1>
            <p className="add-code-text">{t("mod-request.code.p-1")}</p>
            <form className="add-post-form" onSubmit={sendCode}>
              <div className="add-post-form-section">
                <label>{t("mod-request.code.label-1")}</label>
                <input type="password" className={dark ? "add-input dark-add-input" : "add-input clear-add-input"} value={code} onChange={(e)=>{setCode(e.target.value)}} maxLength="7"/>
              </div>
              <div className="add-post-form-section">
                <label>{t("mod-request.code.label-2")}</label>
                <input type="password" className={dark ? "add-input dark-add-input" : "add-input clear-add-input"} value={conf} onChange={(e)=>{setConf(e.target.value)}} maxLength="7"/>
              </div>
              <p className="add-code-text">{t("mod-request.code.important")}<br />{t("mod-request.code.p-2")}</p>
              <div className="add-post-form-button">
                <button className="add-btn signin-btn">{t("mod-request.code.update")}</button>
              </div>
              <p className="code-text">{text}</p>
            </form>
        </section>
    </div>
  );
}

export default ModCode;