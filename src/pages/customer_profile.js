import React, { useState} from 'react';
import '../fonts/ITC Benguiat Gothic Std Book/ITC Benguiat Gothic Std Book.otf';
import '../css/modal.css';
import '../css/customer_profile.css';
import Swal from 'sweetalert2'
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, query, where, addDoc } from "firebase/firestore";
import { storage, db } from '../firebase/firebase';
import { deleteObject, getDownloadURL, uploadBytes } from 'firebase/storage'
import { getDatabase, ref, remove, update } from "@firebase/database";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { getAuth, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, signOut } from "firebase/auth";
import { Modal, Form, Button } from 'react-bootstrap';

function CustomerProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const currCustomer = getAuth().currentUser;
  const customerAuthRef = getDatabase();
  const db2 = getDatabase();
  const fotoClienteRef = storage.ref(`${location.state.customer_profile}`);

  const [openCustomer, setOpenCustomer] = useState(false);
  const [openScheduler, setOpenScheduler] = useState(false);
  const [openCheckScheduler, setCheckScheduler] = useState(false)

  const [fotoCliente, setFotoCliente] = useState(null);

  const handleOpenCustomer = () => setOpenCustomer(true);
  const handleCustomerScheduler = () => setOpenScheduler(true);
  const handleCloseCustomerScheduler = () => setOpenScheduler(false)
  const handleCheckScheduler = () => setCheckScheduler(true);
  const handleCloseCheckScheduler = () => setCheckScheduler(false)
  const handleCloseCustomer = () => setOpenCustomer(false);



  const [state, setState] = useState({
    nameCustomer: location.state.name,
    ageCustomer: location.state.age_customer,
    city_customer: location.state.city_customer,
    phone_customer: location.state.phone_customer,
    email_customer: location.state.email_customer,
    customer_password: location.state.password_customer
  })

  const [agendar, setAgendar] = useState({
    horario_marcado: ''
  })


  var age_customer = location.state.age_customer

  function getAge(age_customer) {
    var today = new Date();
    var birthDate = new Date(age_customer);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  var finalAge = getAge(age_customer)

  const customerProfileOperations = {
    handleChange: function (event) {
      const { name, value } = event.target;
      setState((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    },
    handleChangeScheduler: function (event) {
      const { name, value } = event.target;
      setAgendar((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    },

    getDownloadURLCustomer: function () {
      getDownloadURL(storage.ref(`${location.state.customer_profile}`))
        .then((url) => {
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.open('GET', url);
          xhr.send();
          const img = document.getElementById('customer_profile');
          img.setAttribute('src', url);

        })
        .catch((error) => {
          console.log(error)
        });
    },

    removeCustomer: function () {
      const user = getAuth();
      const credential = EmailAuthProvider.credential(state.email_customer, state.customer_password)
      const currAuthCustomer = getAuth().currentUser;
      reauthenticateWithCredential(user.currentUser, credential)
        .then(() => {
          remove(ref(customerAuthRef, 'customer/' + location.state.id_customer))
            .then(() => {
              currAuthCustomer.delete()
                .then(function () {
                  deleteObject(fotoClienteRef).then(() => {
                    Swal.fire('Sucesso', 'Conta removida com sucesso', 'sucess')
                    navigate("/")
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

    updateCustomer: function () {
      const fotoNewClienteRef = storage.ref(`fotoCliente/${fotoCliente.name}`);
      const user = getAuth();
      const credential = EmailAuthProvider.credential(user.currentUser.email, state.customer_password)

      user.currentUser.getIdToken(true)
        .then(() => {
          reauthenticateWithCredential(user.currentUser, credential)
            .then(() => {
              uploadBytes(fotoNewClienteRef, fotoCliente).then(() => {
                let newCustomerData = {
                  nome: state.nameCustomer,
                  data_nascimento: state.ageCustomer,
                  cidade: state.city_customer,
                  telefone_cliente: state.phone_customer,
                  email_customer: state.email_customer,
                  password_barber: state.customer_password,
                  customer_profile: fotoNewClienteRef.fullPath
                }
                getDownloadURL(storage.ref(`${fotoCliente.name}`))
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
                  });


                update(ref(db2, `customer/${location.state.id_customer}/custData`),
                  newCustomerData
                )
                  .then(() => {
                    updateEmail(currCustomer, state.email_customer)
                      .then(() => {

                      })

                    updatePassword(currCustomer, state.customer_password).
                      then(() => {})

                    Swal.fire('Sucesso', 'Dados atualizados com sucesso, faça o login novamente para visualizar as mudanças', 'sucess')
                    handleCloseCustomer();
                    navigate("/");
                  })
                  .catch((e) => {
                    alert(e)
                  })
              })
            })
            .catch((e) => {
              console.log(e)
            })
        })

    },

    signoutCustomer: function () {
      const auth = getAuth();
      signOut(auth).then(() => {
        Swal.fire('Sucesso', 'Conta desconectada', 'sucess')
        navigate("/");
      }).catch((error) => {
        alert(error)
      });
    },

    createScheduler: async function () {
      var barberValue = document.getElementById('barber_names');
      var barberUid = barberValue.value;
      var barberName = barberValue.options[barberValue.selectedIndex].text;

      function getLocalDate(scheduler_date) {
        var dt = new Date(scheduler_date);
        var minutes = dt.getTimezoneOffset();
        dt = new Date(dt.getTime() + minutes * 60000);
        return dt;
      }

      const horario_check = getLocalDate(agendar.horario_marcado).toLocaleString();
      await addDoc(collection(db, "agendamentos"), {
        barber_uid: barberUid,
        horario_marcado: horario_check,
        nome_barber: barberName,
        nome_cliente: location.state.name,
        user_uid: location.state.id_customer
      }).then(() => {
        Swal.fire('Sucesso', 'Agendamento feito com sucesso', 'sucess')
        handleCloseCustomerScheduler()
      })
        .catch((e) => {
          Swal.fire('Ops!', 'Ocorreu algum erro, tente novamente', 'error')
        })

    },
    checkScheduler: async function () {
      const q = query(collection(db, "agendamentos"), where("user_uid", "==", location.state.id_customer));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
        document.querySelector('html').setAttribute('scheduler_id', doc.id)
        const scheduler_checker = document.getElementById("check_scheduler");
        scheduler_checker.insertAdjacentHTML('afterbegin', `<span>Barbearia : ${doc.data().nome_barber}</span> <br> <span>Dia e hora : ${doc.data().horario_marcado}</span>`)
      });
    },
    deleteScheduler: async function () {
      const scheduler_id = document.querySelector('html').getAttribute('scheduler_id')
      try {
        await deleteDoc(doc(db, "agendamentos", scheduler_id));
        Swal.fire('Sucesso', 'Deleção feita com sucesso', 'sucess')
        setCheckScheduler(false)
      }
      catch {
        Swal.fire('Erro', 'Ocorreu algum problema ao deletar', 'error')
      }
    }


  }

  var loadFile = function (event) {
    var image = document.getElementById("profile_picture_up");
    image.insertAdjacentHTML('afterbegin', `<img id='pic-prof' src='' />`);
    var imagelink = document.getElementById('pic-prof');
    imagelink.src = URL.createObjectURL(event.target.files[0]);
  };



  async function listBarber() {
    const objectsArray = [];
    const querySnapshot = await getDocs(collection(db, "barbearias"))
    querySnapshot.forEach((doc) => {
      objectsArray.push(doc.data());
    })

    const sel = document.getElementById('barber_names');

    if (sel !== null) {
      for (var i = 0; i < objectsArray.length; i++) {
        var opt = document.createElement('option');
        opt.innerHTML = objectsArray[i].nome_barber;
        opt.value = objectsArray[i].uid;
        sel.appendChild(opt);
      }
    }
  }

  listBarber()


  const { nameCustomer, ageCustomer, city_customer, phone_customer, email_customer, customer_password } = state;
  const { horario_marcado } = agendar;

  const getDownloadURLCustomer = customerProfileOperations.getDownloadURLCustomer;
  const removeCustomer = customerProfileOperations.removeCustomer;
  const updateCustomer = customerProfileOperations.updateCustomer;
  const signoutCustomer = customerProfileOperations.signoutCustomer;
  const handleChange = customerProfileOperations.handleChange;
  const createScheduler = customerProfileOperations.createScheduler;
  const handleChangeScheduler = customerProfileOperations.handleChangeScheduler;
  const deleteScheduler = customerProfileOperations.deleteScheduler;
  const checkScheduler = customerProfileOperations.checkScheduler;

  getDownloadURLCustomer()
  return (
    <div className='customerPage'>
      <div className='customerSecion'>
        <button id='signout_customer' onClick={() => { signoutCustomer() }}>SAIR</button>
        <div id='profile_picture'>
          <img alt='Customer profile' id='customer_profile' src='' />
        </div>
        <span className='titleProfile'>Cliente</span>
        <h3 id='nameCustomer'>{location.state.name}</h3>
        <span id='ageCustomer'>{finalAge}</span>
        <span id='cityCustomer'>{location.state.city_customer}</span>

        <div className='customerOperations'>
          <button onClick={(e) => { handleCustomerScheduler(); e.preventDefault() }} id="add_schedule">Adicionar agendamento</button>
          <button onClick={(e) => { handleCheckScheduler(); checkScheduler() }} id="check_schedule">Consultar agendamento</button>
          <button onClick={(e) => { removeCustomer(); e.preventDefault() }} id="delete_customer">Deletar conta</button>
          <button onClick={(e) => { handleOpenCustomer(); e.preventDefault() }} id="edit_customer" >Editar dados</button>
        </div>


        <Modal show={openCheckScheduler} className='modalCustomer'>
          <Modal.Header >
            <Modal.Title>Horário marcado</Modal.Title>
            <Button variant="secondary" onClick={() => handleCloseCheckScheduler()} >
              <FontAwesomeIcon icon={faClose} />
            </Button>
          </Modal.Header>
          <Modal.Body>
            <div id="check_scheduler">

              <button onClick={(e) => { deleteScheduler(); e.preventDefault() }}>Excluir agendamento</button>
            </div>
          </Modal.Body>
        </Modal>

        <Modal show={openScheduler} className='modalCustomer'>
          <Modal.Header >
            <Modal.Title>Agende um novo horário</Modal.Title>
            <Button variant="secondary" onClick={() => handleCloseCustomerScheduler()} >
              <FontAwesomeIcon icon={faClose} />
            </Button>
          </Modal.Header>
          <Modal.Body>
            <div className='scheduler_container'>
              <select id='barber_names'>
              </select>

              <input className='date-scheduler' type={'datetime-local'} name="horario_marcado" onChange={handleChangeScheduler} value={horario_marcado} />
            </div>

            <div className='containter-btn'>
              <Button variant="primary" type="submit" onClick={(e) => { createScheduler(); e.preventDefault() }}>
                Salvar mudanças
              </Button>
            </div>

          </Modal.Body>
        </Modal>

        <Modal show={openCustomer} className='modalCustomer'>
          <Modal.Header>
            <Modal.Title>Editar informações</Modal.Title>
            <Button variant="secondary" className='editCustomer' onClick={() => handleCloseCustomer()} >
              <FontAwesomeIcon icon={faClose} />
            </Button>
          </Modal.Header>
          <Modal.Body>
            <Form className='infoCustomer'>
              <Form.Group className="mb-3" controlId="formBasicNome">
                <Form.Label>Foto de perfil </Form.Label>
                <div id='profile_picture_up'>
                </div>
                <Form.Control type="file" onChange={(e) => { loadFile(e); setFotoCliente(e.target.files[0]) }} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicNome">
                <Form.Label>Nome * </Form.Label>
                <Form.Control type="text" name="nameCustomer" onChange={handleChange} value={nameCustomer} placeholder="Ângelo Miguel" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicCidade">
                <Form.Label>E-mail * </Form.Label>
                <Form.Control type="email" name="email_customer" onChange={handleChange} value={email_customer} placeholder="angelo@bol.com" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicCidade">
                <Form.Label>Senha * </Form.Label>
                <Form.Control type="password" name="customer_password" onChange={handleChange} value={customer_password} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicCidade">
                <Form.Label>Cidade * </Form.Label>
                <Form.Control type="text" name="city_customer" onChange={handleChange} value={city_customer} placeholder="Feira de Santana" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicDataNascimento">
                <Form.Label>Data de nascimento * </Form.Label>
                <Form.Control type="date" name="ageCustomer" onChange={handleChange} value={ageCustomer} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPhone">
                <Form.Label>Celular (Sem o primeiro dígito 9) * </Form.Label>
                <Form.Control type="phone" name="phone_customer" onChange={handleChange} value={phone_customer} placeholder="(75)9999-999" />
              </Form.Group>
              <div className='containter-btn'>
                <Button variant="primary" type="submit" onClick={(e) => { updateCustomer(); e.preventDefault() }}>
                  Salvar mudanças
                </Button>
              </div>

            </Form>
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>

      </div>

    </div>

  )
}
export default CustomerProfile