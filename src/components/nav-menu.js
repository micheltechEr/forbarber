import React from 'react'
import '../fonts/ITC Benguiat Gothic Std Book/ITC Benguiat Gothic Std Book.otf'
import '../css/nav-menu.css'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import logo from '../img/brad-two.png'

function NavMenu() {
  window.addEventListener('load', function () {
    if (window.location.pathname !== '/') {
      document.querySelector(".floatMenu").classList.add("menu-on");
      document.querySelector("nav ul li:nth-child(2)").classList.add("hide")
    }
    else {
      var lastScrollTop = 0;
      window.addEventListener(
        "scroll",
        function () {
          var st = window.pageYOffset || document.documentElement.scrollTop;
          if (st > lastScrollTop) {
            document.querySelector(".floatMenu").classList.add("menu-on");
          } else if (st === 0) {
            document.querySelector(".floatMenu").classList.remove("menu-on");
          }
          lastScrollTop = st <= 0 ? 0 : st;
        },
        false
      );
    }
  })

  function openMenuMobile() {
    let mobMenu = document.getElementById('floatMenu')
    if (mobMenu.className === 'floatMenu menu-on') {
      mobMenu.className += " responsive";
    }
    else {
      mobMenu.className = "floatMenu menu-on";
    }
  }

  const navigate = useNavigate();

  return (
    <main>
      <nav className='floatMenu' id="floatMenu" >
        <img src={logo} className='logoSite' alt='Logo' />
        <ul>
          <li><a href='#' onClick={() => { navigate("/forbarber"); window.location.reload() }}>Home</a></li>
          <li><a href="#about_project" >Sobre</a></li>
          <li><Link to={'/forbarber/login-pag'} reloadDocument={true}>Acessar </Link></li>
        </ul>
        <Button variant="secondary" id='floatMenuOpener' onClick={() => { openMenuMobile() }}>
          <FontAwesomeIcon icon={faBars} />
        </Button>
      </nav>


    </main>



  );
}

export default NavMenu;
