import React from "react";
import { storage,db } from '../firebase/firebase';
import { uploadBytes } from 'firebase/storage'
import Swal from 'sweetalert2'
import { Form, Button } from 'react-bootstrap'
import { useState } from "react";
import {  useNavigate } from 'react-router-dom';
import '../css/cadastro.css';
import { collection, addDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "@firebase/database";

function Form_SignUpBarber() {
  const auth = getAuth();
  const [fotoBarbearia, setfotoBarbearia] = useState(null)
  const navigate = useNavigate()
  const [state, setState] = useState({
    cidade: "",
    email_barbearia: "",
    nome_barbearia: "",
    senha_barbearia: "",
    telefone_barbearia: "",
  })


  var barberFunctions = {

    handleChange: function (event) {
      const { name, value } = event.target;
      setState((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    },

    validateEmailBarber: function validateEmailBarber(email) {
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
    },


    saveEmailandPassword: function () {
      const validateEmailBarber = barberFunctions.validateEmailBarber
      const fotoBarberiaRef = storage.ref(`fotoBarbearia/${fotoBarbearia.name}`);

      if (state.cidade !== ""  && state.nome !== "" && state.telefone_barbearia !== "") {
        if (fotoBarbearia == null) return;
        if (state.email_barbearia !== '' && state.senha_barbearia !== '') {
          if (validateEmailBarber(state.email_barbearia)) {
            createUserWithEmailAndPassword(auth, state.email_barbearia, state.senha_barbearia)
              .then((userCredential) => {
                const barberAuth = auth.currentUser;
                const barberAuthRef = getDatabase()
                uploadBytes(fotoBarberiaRef, fotoBarbearia).then(() => {
                  console.log('Upload');
                  try {
                    let barberData = {
                      cidade: state.cidade,
                      nome_barber: state.nome_barbearia,
                      telefone_barbearia: state.telefone_barbearia,
                      uid: auth.currentUser.uid,
                      barber_profile: fotoBarberiaRef.fullPath,
                      email_barber : state.email_barbearia,
                      password_barber : state.senha_barbearia
                    }
                    
                    set(ref(barberAuthRef, 'barber/' + barberAuth.uid), {
                      barberData
                    })

                    addDoc(collection(db, "agendamentos"), {
                      email_barber: state.email_barbearia,
                      nome_barber: state.nome_barbearia,
                      password_barber: state.senha_barbearia,
                      telefone_barbearia: state.telefone_barbearia,
                      uid: auth.currentUser.uid
                    })

                    Swal.fire('Sucesso','Cadastro efetuado com sucesso!','success')
                    navigate('/')

                  }
                  catch (e) {
                    console.log('Error ' + e)
                  }
                })
                  .catch((error) => {
                    const errorCode = error.code
                    const errorMessage = error.message

                    let typeError = {
                      "Firebase: Error (storage/unknown).": errType => { errType === "storage/unknown" ? Swal.fire('Ops', 'Ocorreu um erro desconhecido, tente novamente', 'error') : console.log('') },
                      "Firebase: Error (storage/object-not-found).": errType => { errType === "storage/object-not-found" ? Swal.fire('Ops', 'Nenhum arquivo encontrado', 'error') : console.log('') },
                      "Firebase: Error (storage/retry-limit-exceeded).": errType => { errType === "storage/retry-limit-exceeded" ? Swal.fire('Ops', 'Limite de tempo para operação foi excedido, tente novamente', 'error') : console.log('') },
                      "Firebase: Error (storage/canceled).": errType => { errType === "storage/canceled" ? Swal.fire('Ops', 'A operação foi cancelada!', 'error') : console.log('') }
                    }

                    function errorReturn(errMessage, errType) {
                      return typeError[errMessage](errType)
                    }
                    errorReturn(errorMessage, errorCode)

                  })

              })
              .catch((error) => {

                let typeError = {
                  "Firebase: Error (auth/account-exists-with-different-credential).": errType => { errType === "auth/account-exists-with-different-credential" ? Swal.fire('Ops', 'Conta existente, porém com outra credencial', 'error') : console.log('') },
                  "Firebase: Error (auth/credential-already-in-use).": errType => { errType === "auth/credential-already-in-us" ? Swal.fire('Ops', 'Credencial em uso, por favor tente outra', 'error') : console.log('') },
                  "Firebase: Error (auth/email-already-in-use).": errType => { errType === "auth/email-already-in-use" ? Swal.fire('Ops', 'E-mail já cadastrado, por favor utilize outro ', 'error') : console.log('') },
                  "Firebase: Error (auth/internal-error).": errType => { errType === "auth/internal-error" ? Swal.fire('Ops', 'Ocorreu um erro interno, por favor tente novamente', 'error') : console.log('') }
                }

                const errorCode = error.code
                const errorMessage = error.message

                function errorReturn(errMessage, errType) {
                  return typeError[errMessage](errType)
                }
                errorReturn(errorMessage, errorCode)
              })
          }
          else {
            Swal.fire('Atenção', 'Por favor, preencha com um endereço de e-mail válido', 'warning')
          }
        }
        else {
          Swal.fire('Atenção', 'Por favor, preencha o e-mail e senha', 'warning')
        }
      }
      else {
        Swal.fire('Ops', 'Por favor, preencha todos os campos que possuem  * ', 'warning')
      }

    },
  }


  const handleChange = barberFunctions.handleChange
  const saveEmailandPassword = barberFunctions.saveEmailandPassword
  const { cidade, email_barbearia, nome_barbearia, senha_barbearia, telefone_barbearia } = state;



  return (
    <div className="content-sign-up_barber hide" id="sign-up_barber">
      <Form className='cadastrobarber'
      >  <Form.Group className="mb-3" controlId="formBasicNome">
          <Form.Label>Nome da Barbearia * </Form.Label>
          <Form.Control type="text" name="nome_barbearia" placeholder="Barbaria Corte Dourado" onChange={handleChange} value={nome_barbearia} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCidade">
          <Form.Label>Cidade * </Form.Label>
          <Form.Control type="text" name="cidade" placeholder="Feira de Santana" onChange={handleChange} value={cidade} />
        </Form.Group>


        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email * </Form.Label>
          <Form.Control type="email" name="email_barbearia" placeholder="henriquealves@gmail.com" onChange={handleChange} value={email_barbearia} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Senha * </Form.Label>
          <Form.Control type="password" name="senha_barbearia" placeholder="Senha" onChange={handleChange} value={senha_barbearia} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPhone">
          <Form.Label>Telefone (Preencha sem o primeiro dígito 9) * </Form.Label>
          <Form.Control type="phone" name="telefone_barbearia" placeholder="(75)9999-999" onChange={handleChange} value={telefone_barbearia} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicFile">
          <Form.Label>Foto de perfil</Form.Label>
          <Form.Control type="file" onChange={(e) => { setfotoBarbearia(e.target.files[0]) }}  accept="image/png, image/jpeg" />
        </Form.Group>

        <Button variant="primary" type="submit" onClick={(e) => { saveEmailandPassword(); e.preventDefault() }}>
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default Form_SignUpBarber
