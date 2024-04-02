import { useContext, useState, useEffect } from 'react';
import axios from "axios"
import '../../App.css';
import '../css/clear.css'
import '../css/dark.css'
import '../css/responsive.css'
import { Link, useNavigate } from 'react-router-dom';
import { DarkMode } from '../../context/DarkMode';
import { useTranslation } from "react-i18next"
import { User } from '../../context/User';


function SignUp() {
  const [nombre, setNombre] = useState("")
  const [mail, setMail] = useState("")
  const [password, setPassword] = useState("")
  const {dark} = useContext(DarkMode)
  const {language, setLanguage} = useContext(User)
  const navigate = useNavigate()
  const { t, i18n } = useTranslation("global")

  useEffect(()=>{
    const lang = localStorage.getItem("language")
    if(lang){
      setLanguage(JSON.parse(lang))
      i18n.changeLanguage(JSON.parse(lang))
    }
  },[language])

  const create = (e) => {
    e.preventDefault()
    axios.post("http://localhost:3001/signup", {nombre, mail, password}, {withCredentials: true}).then(resp => {console.log(resp);navigate("/signin")}).catch(err => {console.log(err)})
  }

  return (
    <div className="bg-2">
        <section className="font sign">
            <h1>{t("signup.title")}</h1>
            <form onSubmit={create} className={dark ? "sign-form dark-sign-form" : "sign-form clear-sign-form"}>
              <h3>blog mern.</h3>
              <input type="text" placeholder={t("signup.ph-name")} value={nombre} onChange={(e)=>{setNombre(e.target.value)}} maxLength="20"/>
              <input type="text" placeholder={t("signup.ph-email")} value={mail} onChange={(e)=>{setMail(e.target.value)}} />
              <input type="password" placeholder={t("signup.ph-password")} value={password} onChange={(e)=>{setPassword(e.target.value)}} maxLength="20"/>
              <button className="sign-btn signin-btn">{t("signup.button")}</button>
            </form>
            <p>{t("signup.message1")} <Link to="/signin" className="underline">{t("signup.message2")}</Link></p>
        </section>
    </div>
  );
}

export default SignUp;