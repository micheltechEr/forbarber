import React, { useState } from 'react'
import '../fonts/ITC Benguiat Gothic Std Book/ITC Benguiat Gothic Std Book.otf'
import '../css/cadastro.css'
import Form_SignUp from '../components/form_sign_up._customer';
import Form_SignUpBarber from '../components/form_sign_up_barber';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faScissors } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { Form } from 'react-bootstrap'

function SignUpPage() {
    const [selectRadio, setSelectRadio] = useState('')
    const handleCustomerSelect = () => {
        setSelectRadio("customer")
        document.getElementById("sign-up_customer").style.display = 'flex'
        document.getElementById("sign-up_barber").style.display = 'none'
    }

    const handleBarberSelect = () => {
        setSelectRadio("barber")
        document.getElementById("sign-up_barber").style.display = 'flex'
        document.getElementById("sign-up_customer").style.display = 'none'
    }

    const changeBackground = () => {
        window.onload = function () {
            if(window.location.pathname === '/cadastro'){
                document.querySelector('body').style.background = `url(/img/1371360.jpg) top center fixed`;
            }
        }
    }
    changeBackground()

    return (
        <section className='pagCadastro'>

            <main className='contentCadastro'>
                <div id='containerCadastro'>
                    <div className='chooseCadastro' id='chooseCadastro'>

                        <label for="customer">
                            <Form.Control type='radio' className="customer" id="customer" value={selectRadio === "customer"} onChange={handleCustomerSelect} />
                            <FontAwesomeIcon icon={faUser} />
                        </label>


                        <label for="barber">
                            <Form.Control type='radio' className="barber" id="barber" value={selectRadio === "barber"} onChange={handleBarberSelect} />
                            <FontAwesomeIcon icon={faScissors} />
                        </label>
                    </div>
                    <Form_SignUpBarber />
                    <Form_SignUp />
                </div>

            </main>

        </section>
    )
}

export default SignUpPage