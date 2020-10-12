import React from 'react'
import { FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import '../styles/pages/landing.scss'

import logoImg from '../images/logo.svg'

function Landing() {
  return (
    <div id="page-landing">
      <div className="content-wrapper">
        <img src={logoImg} alt="Happy logo" />

        <main>
          <h1>Leve felicidade para o mundo</h1>
          <p>Visite orfanatos e mude o dia de muitas crianças.</p>
        </main>

        <div className="location">
          <strong>Marau</strong>
          <span>Rio Grande do Sul</span>
        </div>

        <Link to="/app" className="enter-app">
          <FiArrowRight size={26} color="#0008" />
        </Link>
      </div>
    </div>
  )
}
export default Landing