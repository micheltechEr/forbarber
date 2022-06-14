import React from 'react'
import '../fonts/ITC Benguiat Gothic Std Book/ITC Benguiat Gothic Std Book.otf'
import '../css/home.css'

import { Link } from 'react-router-dom';

function Home() {
    return (
        <section className='home-page' >
            <header className='header-home flex justify-center'>
                <div className='home-banner'>
                    <h2>ForBarber</h2>
                    <h3>Sistema de agendamento para barbearia</h3>
                    <Link to={'/forbarber/cadastro'} className='buttonSignUp' reloadDocument={true}>
                        <span>comece agora</span>
                    </Link>
                </div>
            </header>

            <main className='content-home-page flex' id='about_project'>
                <h2>Sobre o projeto</h2>
                <p>Um sistema de agendamento de horário para serviços na barbearia, visando o controle diário oferecendo o poder de escolha dos clientes com base nos horários disponíveis da barbearia.
                    Esse sistema irá resolver a questão de filas e de perca de tempo do cliente sendo que se o horário não estiver disponível o cliente pode ir em outro horário disponível assim realizando seu serviço e aproveitando melhor o seu tempo.</p>

                <h2>Beneficios</h2>
                <div className='containerMotivation flex justify-center '>
                    <div className='contentMotivation flex justify-center'>
                        <span>Economize o seu tempo ⌚ </span>
                        <p>O tempo é algo valioso, agendando um horário poupará tempo para outras atividades</p>
                    </div>
                    <div className='contentMotivation flex justify-center'>
                        <span>Contato via WhatsApp 📱</span>
                        <p>Você poderá entrar em contato com o WhatsApp de sua barbearia.</p>
                    </div>

                    <div className='contentMotivation flex justify-center'>
                        <span>Profissionalize o seu negócio 🏆️</span>
                        <p>Adicione um diferencial tecnológico ao seu negócio e conquiste mais clientes</p>
                    </div>

                </div>

                <h2>Como funciona?</h2>
                <div className='howWork flex justify-center'>
                    <p>Inicialmente você criará uma conta no sistema, escolhendo se você será o barbearia ou cliente, preencha as informações necessárias e clique em enviar.
                        Feito isso, você poderá acessar sua conta e gerencia-la. Caso você seja cliente, poderá editar suas informações, assim como excluir sua conta, podendo também agendar um horário, ou deletar ele. Caso seja barbearia , poderá editar suas informações, excluir a conta ou consultar os agendamentos feitos.
                    </p>
                </div>
            </main>
        </section>
    )

}

export default Home