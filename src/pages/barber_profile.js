import React, { useState } from 'react';
import '../fonts/ITC Benguiat Gothic Std Book/ITC Benguiat Gothic Std Book.otf';
import '../css/modal.css';
import '../css/barber_profile.css';
import Swal from 'sweetalert2'
import { useLocation, useNavigate } from 'react-router-dom';
import { storage, db } from '../firebase/firebase';
import { collection, getDocs, query, where,deleteDoc,doc } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { deleteObject, getDownloadURL, uploadBytes } from 'firebase/storage'
import { getDatabase, ref, remove, update } from "@firebase/database";
import { getAuth, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, signOut } from "firebase/auth";
import { Modal, Form, Button } from 'react-bootstrap';

function BarberProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const currBarber = getAuth().currentUser;

  const db2 = getDatabase();

  const [openBarber, setOpenBarber] = useState(false);
  const [fotoBarbearia, setFotoBarber] = useState(null)
  const handleOpenBarber = () => setOpenBarber(true);
  const handleCloseBarber = () => setOpenBarber(false)
  const [openScheduler, setOpenScheduler] = useState(false);
  const handleBarberScheduler = () => setOpenScheduler(true);
  const handleCloseBarberScheduler = () => setOpenScheduler(false);

  const [state, setState] = useState({
    nameBarber: location.state.name,
    cityBarber: location.state.barber_city,
    phone_barber: location.state.phone_barber,
    email_barber: location.state.email_barber,
    barber_password: location.state.password_barber,

  })





  const barberProfileOperations = {
    handleChange: function (event) {
      const { name, value } = event.target;
      setState((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    },

    getDownloadURLBarber: function () {
      document.querySelector('html').setAttribute('barber_id', location.state.id_barber)
      getDownloadURL(storage.ref(`${location.state.barber_profile}`))
        .then((url) => {
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.open('GET', url);
          xhr.send();
          const img = document.getElementById('barber_profile');
          img.setAttribute('src', url);

        })
        .catch((error) => {
          console.log(error)
        });
    },

    removeBarber: function () {
      const user = getAuth();
      const barberAuthRef = getDatabase();
      const fotoBarberRef = storage.ref(`${location.state.barber_profile}`);
      const credential = EmailAuthProvider.credential(state.email_barber, state.barber_password)

      const currAuthBarber = getAuth().currentUser;
      reauthenticateWithCredential(user.currentUser, credential)
        .then(() => {
          remove(ref(barberAuthRef, 'barber/' + location.state.id_barber))
            .then(async () => {
         
               await deleteDoc(doc(db, "barbearias",nameBarber));

              currAuthBarber.delete()
                .then(function () {
                  deleteObject(fotoBarberRef).then(() => {
                    Swal.fire('Sucesso', 'Conta removida com sucesso', 'sucess')
                    navigate("/login-pag")
                  })
                    .catch((e) => {
                      console.log(e)
                    })
                })
                .catch((e) => {
                  console.log(e)
                })

            })
            .catch((e) => {
              console.log(e)
            })
        })

    },
    updateBarber: function () {
      const fotoNewBarbeariaRef = storage.ref(`fotoBarbearia/${fotoBarbearia.name}`);
      const user = getAuth();
      const credential = EmailAuthProvider.credential(state.email_barber, state.barber_password)

      reauthenticateWithCredential(user.currentUser, credential)
        .then(() => {
          uploadBytes(fotoNewBarbeariaRef, fotoBarbearia).then(() => {
            let newBarberData = {
              nome: state.nameBarber,
              cidade: state.cityBarber,
              telefone_cliente: state.phone_barber,
              email_barber: state.email_barber,
              barber_profile: fotoNewBarbeariaRef.fullPath
            }
            getDownloadURL(storage.ref(`${fotoBarbearia.name}`))
              .then((url) => {
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.open('GET', url);
                xhr.send();
                const img = document.getElementById('profile_picture');

                img.setAttribute('src', url);
              })
              .catch((error) => {
                console.log(error)
              })

            update(ref(db2, `barber/${location.state.id_barber}/barberData`),
              newBarberData
            )
              .then(() => {
                updateEmail(currBarber, state.email_barber)
                  .then(() => {

                  })
                  .catch((e) => {
                    alert(e)
                  })
                updatePassword(currBarber, state.barber_password).
                  then(() => {

                  })
                  .catch((e) => {
                    console.log(e)
                  })
                Swal.fire('Sucesso', 'Dados atualizados com sucesso, fa??a o login novamente para visualizar as mudan??as', 'sucess')
                handleCloseBarber();
                navigate("/login-pag");
              })
              .catch((e) => {
                alert(e)
              })
          })
        })
        .catch((e) => {
          console.log(e)
        })
    },

    signoutBarber: function () {
      const auth = getAuth();
      signOut(auth).then(() => {
        Swal.fire('Sucesso', 'Conta desconectada', 'sucess')
        navigate("/");
      }).catch((error) => {
        alert(error)
      });
    },

    checkScheduler: async function () {
      const q = query(collection(db, "agendamentos"), where("barber_uid", "==", `${location.state.id_barber}`));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        document.querySelector('html').setAttribute('scheduler_id', doc.id)
        const scheduler_checker = document.getElementById("check_scheduler");
        scheduler_checker.insertAdjacentHTML('afterbegin', `<span>Cliente : ${doc.data().nome_cliente}</span> <br> <span>Dia e hora : ${doc.data().horario_marcado} <br>  WhatsApp : <a href='//wa.me/55${doc.data().telefone_cliente}'>${doc.data().telefone_cliente}</a></span>`)
      });
    },

  }

  var loadFile = function (event) {
    var image = document.getElementById("pic-prof");
    image.src = URL.createObjectURL(event.target.files[0]);
    image.removeAttribute('class','hide')
  };


  const { nameBarber, cityBarber, phone_barber, email_barber } = state;
  const getDownloadURLBarber = barberProfileOperations.getDownloadURLBarber;
  const removeBarber = barberProfileOperations.removeBarber;
  const updateBarber = barberProfileOperations.updateBarber;
  const signoutBarber = barberProfileOperations.signoutBarber;
  const handleChange = barberProfileOperations.handleChange;
  const checkScheduler = barberProfileOperations.checkScheduler
  getDownloadURLBarber()

  return (
    <div className='barberPage'>
      <div className='barberSecion'>
        <button id='signout_barber' onClick={() => { signoutBarber() }}>SAIR</button>
        <div id='profile_picture'>
          <img alt='Barber Profile' id='barber_profile' src='' />
        </div>
        <span className='titleProfile'>Barbearia</span>
        <h3 id='nameBarber'>{location.state.name}</h3>
        <span id='cityBarber'>{location.state.cityBarber}</span>
        <div className='barberOperations'>
          <button onClick={(e) => { removeBarber(); e.preventDefault() }} id="delete_barber">Deletar conta</button>
          <button onClick={(e) => { handleOpenBarber(); e.preventDefault() }} id="edit_barber" >Editar dados</button>
          <button onClick={(e) => { handleBarberScheduler(); checkScheduler() }} id="check_schedule">Checar agendamento</button>
        </div>


        <Modal show={openScheduler} className='modalBarber'>
          <Modal.Header >
            <Modal.Title>Hor??rio marcado</Modal.Title>
            <Button variant="secondary" onClick={() => handleCloseBarberScheduler()} >
              <FontAwesomeIcon icon={faClose} />
            </Button>
          </Modal.Header>
          <Modal.Body>
            <div id="check_scheduler">

            </div>
          </Modal.Body>
        </Modal>


        <Modal show={openBarber} className='modalBarber'>
          <Modal.Header >
            <Modal.Title>Editar perfil da barbearia</Modal.Title>
            <Button variant="secondary" onClick={() => handleCloseBarber()} >
              <FontAwesomeIcon icon={faClose} />
            </Button>

          </Modal.Header>
          <Modal.Body>
            <Form className='infoBarber'>

              <Form.Group className="mb-3" controlId="formBasicNome">
                <Form.Label>Foto de perfil </Form.Label>
                <div id='profile_picture'>
                  <img alt="Profile pic" id='pic-prof' className='hide' src=''   />
                </div>
                <Form.Control type="file" onChange={(e) => { loadFile(e); setFotoBarber(e.target.files[0]) }} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicNome">
                <Form.Label>Nome * </Form.Label>
                <Form.Control type="text" name="nameBarber" onChange={handleChange} value={nameBarber} placeholder="??ngelo Miguel" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicCidade">
                <Form.Label>E-mail * </Form.Label>
                <Form.Control type="text" name="email_barber" onChange={handleChange} value={email_barber} placeholder="angelo@bol.com" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicCidade">
                <Form.Label>Cidade * </Form.Label>
                <Form.Control type="text" name="cityBarber" onChange={handleChange} value={cityBarber} placeholder="Feira de Santana" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPhone">
                <Form.Label>Telefone (Preencha sem o primeiro d??gito 9) * </Form.Label>
                <Form.Control type="phone" name="phone_barber" onChange={handleChange} value={phone_barber} placeholder="(75)9999-999" />
              </Form.Group>

              <Button variant="primary"  type="submit" onClick={(e) => { updateBarber(); e.preventDefault() }}>
                Enviar
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

      </div>
    </div>

  )
}
export default BarberProfile