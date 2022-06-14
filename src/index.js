import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
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
<Routes basename={process.env.PUBLIC_URL}>
        <Route  index path='/forbarber'  element={<Home/>}/>
        <Route path='/forbarber/login-pag' element={<LoginPage/>}/>
        <Route path='/forbarber/cadastro' element={<CadastroPage/>}/>
        <Route path='/forbarber/perfil_cliente' element={<CustomerProfile/>}/>
        <Route path='/forbarber/perfil_barbearia' element={<BarberProfile/>}/>
</Routes>  

<FooterApp />
</BrowserRouter>

);



