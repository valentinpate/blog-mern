import '../../App.css';
import '../css/clear.css'
import '../css/dark.css'
import axios from 'axios'
import { User } from '../../context/User';
import { DarkMode } from '../../context/DarkMode';
import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next"

function Header() {
  const {user, setUser, LogOut} = useContext(User)
  const {dark} = useContext(DarkMode)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const { t , i18n } = useTranslation("global")
  const [ language, setLanguage] = useState("es")


  const toggleLanguage = (lang) =>{
    setLanguage(lang)
    i18n.changeLanguage(lang)
  }


  // const LogOut = async () => {
  //   localStorage.removeItem("token")
  //   localStorage.removeItem("user")
  //   setUser(null)
  //   console.log("usuario en logout front", user)
  //   const out = await axios.get("http://localhost:3001/signout")
  //   if(out.data == "Logged out"){
  //     console.log("se fue del back... creeemos")
  //   }
  // }

  useEffect(()=>{
    async function getUser(){
      try{
        if(token != null){
          async function auth(){
            await axios.get("http://localhost:3001/signin", {headers:{'Authorization':`Bearer ${token}`}}).then(resp=>{console.log("Gr => " + resp)}).catch(err => {console.log("Ge => " + err)})
          }
          auth()
          const response = await axios.get("http://localhost:3001/user",{withCredentials:true, headers:{'Authorization':`Bearer ${token}`}})
          console.log(response)
          if(token && response.data.user != null){
            console.log("Pasé")
            const stored = localStorage.getItem("user")
            if(stored){
              setUser(JSON.parse(stored))
            }else{
              localStorage.setItem("user", JSON.stringify(response.data.user))
              setUser(response.data.user)
            }
          }
        }
      }catch(err){
        console.log(err)
        if(err.response.status == '401'){
          console.log("No autorizado")
        }
      }
    }
    getUser()
  },[]) //user talvez en dependencias? => Al final No!

  return (
    <header className={dark ? "dark-header" : "clear-header"}>
        <h1>blog mern.</h1>
        {user ? 
          <div className="header-btns">
              <a href="/profile"><button className="header-btn signin-btn">{user.name}</button></a>
              <a href="/dashboard"><button className={window.location.href=="http://localhost:3000/dashboard" ? "header-btn signup-btn" : "header-btn signin-btn"} 
                disabled={window.location.href=="http://localhost:3000/dashboard" ? "disabled" : ""}>
                {window.location.href=="http://localhost:3000/dashboard" ? t("header.on-dashboard") : t("header.go-dashboard")}</button>
              </a>
              <a href="/"><button className="header-btn signup-btn" onClick={LogOut}>{t("header.header-exit")}</button></a>
              {language === "es" ? <button className='header-btn signup-btn' onClick={() => toggleLanguage('en')}><img src="/es.png" width="20px" alt="" title="ES"></img></button> :
              <button className='header-btn signup-btn' onClick={() => toggleLanguage('es')}><img src="/en.png" width="20px" alt="" title="EN"></img></button>}
          </div> 
        : 
          <div className="header-btns">
              <a href="/signin"><button className="header-btn signin-btn">{t("header.header-login")}</button></a>
              <a href="/signup"><button className="header-btn signup-btn">{t("header.header-signup")}</button></a>
              {language === "es" ? <button className='header-btn signup-btn' onClick={() => toggleLanguage('en')}><img src="/es.png" width="20px" alt="" title="ES"></img></button> :
              <button className='header-btn signup-btn' onClick={() => toggleLanguage('es')}><img src="/en.png" width="20px" alt="" title="EN"></img></button>}
          </div>
        }
        {/* {language === 'es' && (
        <button className='header-btn signin-btn' onClick={() => toggleLanguage('en')}>EN</button>
      )}
      {language === 'en' && (
        <button className='header-btn signin-btn' onClick={() => toggleLanguage('es')}>ES</button>
      )} */}
        
    </header>
  );
}

export default Header;