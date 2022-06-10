import React from 'react'
import '../fonts/ITC Benguiat Gothic Std Book/ITC Benguiat Gothic Std Book.otf'
import '../css/login-page.css'
import '../css/modal.css'
import { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faClose} from '@fortawesome/free-solid-svg-icons'
import SignInCustomer from '../components/form_sign_in_customer';
import SignInBarber from '../components/sign_in_barber';
function LoginPage() {
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openBarber, setOpenBarber] = useState(false);
  const handleOpenCustomer = () => setOpenCustomer(true);
  const handleCloseCustomer = () => setOpenCustomer(false)

  const handleOpenBarber = () => setOpenBarber(true);
  const handleCloseBarber = () => setOpenBarber(false)

  return (

    <section className='login-page'>
      <Modal show={openCustomer} className='modalCustomer' aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header >
          <Modal.Title>Logar como cliente</Modal.Title>
          <Button variant="secondary" onClick={() => handleCloseCustomer()} >
           <FontAwesomeIcon icon={faClose}/>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form>
           <SignInCustomer />
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={openBarber} className='modalBarber'>
        <Modal.Header >
          <Modal.Title>Logar como barbearia</Modal.Title>
          <Button variant="secondary" onClick={() => handleCloseBarber()} >
           <FontAwesomeIcon icon={faClose}/>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form>
           <SignInBarber/>
          </Form>
        </Modal.Body>
      </Modal>


      <div className='content-choose-login'>
        <span className='chooseOp' onClick={() => handleOpenCustomer()}> SOU CLIENTE</span>
        <span className='chooseOp barber' onClick={() => handleOpenBarber()}> SOU BARBEARIA</span>
      </div>



    </section>
  )

}

export default LoginPage
