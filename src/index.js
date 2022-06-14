import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter,Routes,Route, HashRouter} from 'react-router-dom'
import Home from './pages/home';
import LoginPage from './pages/login-pag';
import CadastroPage from './pages/cadastro';
import NavMenu from './components/nav-menu';
import CustomerProfile from './pages/customer_profile';
import BarberProfile from './pages/barber_profile';
import FooterApp from './components/footer-app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<BrowserRouter>
<NavMenu />
<HashRouter>
<Route  index path='/'  element={<Home/>}/>
        <Route path='/login-pag' element={<LoginPage/>}/>
        <Route path='/cadastro' element={<CadastroPage/>}/>
        <Route path='/perfil_cliente' element={<CustomerProfile/>}/>
        <Route path='/perfil_barbearia' element={<BarberProfile/>}/>
</HashRouter>



<FooterApp />
</BrowserRouter>

);



