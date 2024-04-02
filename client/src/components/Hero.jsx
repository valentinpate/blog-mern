import '../App.css';
import './css/responsive.css'
import { useContext, useEffect } from 'react';
import Header from './parts/Header';
import { useTranslation } from "react-i18next"
import { User } from '../context/User';


function Hero() {
    const {language, setLanguage} = useContext(User)
    const { t , i18n } = useTranslation("global")

    useEffect(()=>{
      const lang = localStorage.getItem("language")
      if(lang){
        setLanguage(JSON.parse(lang))
        i18n.changeLanguage(JSON.parse(lang))
      }
    },[language])

  return (
    <div className="bg-1">
        <Header/>
        <section className="hero">
            <h1>{t("hero.hero-title")}</h1>
            <h2>{t("hero.hero-title2")}</h2>
            <div className="hero-btns">
                {/* <a href="/signin"><button className="hero-btn signin-btn">Iniciar sesión</button></a> */}
                <a href="/signup"><button className="hero-btn signup-btn">{t("hero.hero-button")}</button></a>
            </div>
        </section>
    </div>
  );
}

export default Hero;