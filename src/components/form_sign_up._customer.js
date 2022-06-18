import React from "react";
import { storage } from '../firebase/firebase';
import { uploadBytes } from 'firebase/storage'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import { useState } from "react";
import '../css/cadastro.css';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getDatabase, ref, set } from "@firebase/database";

function Form_SignUp() {
  const auth = getAuth();
  const [fotoCliente, setFotoCliente] = useState(null)
  const navigate = useNavigate()
  const [state, setState] = useState({
    cidade: "",
    data_nascimento: "",
    email_cliente: "",
    nome_cliente: "",
    senha_cliente: "",
    telefone_cliente: "",
  })



  var customerFunctions = {

    handleChange: function (event) {
      const { name, value } = event.target;
      setState((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    },

    validateEmailCustomer: function validateEmailCustomer(email) {
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
    },

    saveEmailandPassword: function () {
      const validateEmailCustomer = customerFunctions.validateEmailCustomer
      const fotoClienteRef = storage.ref(`fotoCliente/${fotoCliente.name}`);
      if (state.cidade !== "" && state.data_nascimento !== "" && state.nome !== "" && state.telefone_cliente !== "") {
        if (fotoCliente == null) return;
        if (state.email_cliente !== '' && state.senha_cliente !== '') {
          if (validateEmailCustomer(state.email_cliente)) {

            createUserWithEmailAndPassword(auth, state.email_cliente, state.senha_cliente)
              .then((userCredential) => {
                const customerAuth = auth.currentUser;
                const customerAuthRef = getDatabase()

                uploadBytes(fotoClienteRef, fotoCliente).then(() => {

                  console.log(fotoClienteRef.fullPath)
                  try {
                    let custData = {
                      cidade: state.cidade,
                      data_nascimento: state.data_nascimento,
                      nome: state.nome_cliente,
                      telefone_cliente: state.telefone_cliente,
                      uid: auth.currentUser.uid,
                      email_customer: auth.currentUser.email,
                      senha_customer: state.senha_cliente,
                      customer_profile: fotoClienteRef.fullPath
                    }

                    localStorage.setItem("customer_profile", fotoClienteRef.fullPath)
                    set(ref(customerAuthRef, 'customer/' + customerAuth.uid), {
                      custData
                    });

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

                sendEmailVerification(auth.currentUser)
                  .then(() => {
                    Swal.fire('Sucesso!', 'Cadastro efetuado com sucesso, confirme clicando no link enviado ao seu e-mail', 'sucess')
                  });
                  navigate("/login-pag");
              })
              .catch((error) => {
                const errorCode = error.code
                const errorMessage = error.message

                let typeError = {
                  "Firebase: Error (auth/account-exists-with-different-credential).": errType => { errType === "auth/account-exists-with-different-credential" ? Swal.fire('Ops', 'Conta existente, porém com outra credencial', 'error') : console.log('') },
                  "Firebase: Error (auth/credential-already-in-use).": errType => { errType === "auth/credential-already-in-us" ? Swal.fire('Ops', 'Credencial em uso, por favor tente outra', 'error') : console.log('') },
                  "Firebase: Error (auth/email-already-in-use).": errType => { errType === "auth/email-already-in-use" ? Swal.fire('Ops', 'E-mail já cadastrado, por favor utilize outro ', 'error') : console.log('') },
                  "Firebase: Error (auth/internal-error).": errType => { errType === "auth/internal-error" ? Swal.fire('Ops', 'Ocorreu um erro interno, por favor tente novamente', 'error') : console.log('') }
                }

                function errorReturn(errMessage, errType) {
                  return typeError[errMessage](errType)
                }
                errorReturn(errorMessage, errorCode)

              })
          }

          else {
            Swal.fire('Atenção', 'Por favor, preencha o e-mail e senha', 'warning')
          }

        }

        else {
          Swal.fire('Atenção', 'Por favor, preencha com um endereço de e-mail válido', 'warning')
        }
      }
      else {
        Swal.fire('Ops', 'Por favor, preencha todos os campos que possuem  * ', 'warning')
      }



    },


  }

  const handleChange = customerFunctions.handleChange
  const saveEmailandPassword = customerFunctions.saveEmailandPassword
  const { cidade, data_nascimento, email_cliente, nome_cliente, senha_cliente, telefone_cliente } = state;



  return (
    <div className="content-sign-up_customer hide" id="sign-up_customer">
      <Form className='cadastroCustomer'
      >  <Form.Group className="mb-3" controlId="formBasicNome">
          <Form.Label>Nome * </Form.Label>
          <Form.Control type="text" name="nome_cliente" placeholder="Ângelo Miguel" onChange={handleChange} value={nome_cliente} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCidade">
          <Form.Label>Cidade * </Form.Label>
          <Form.Control type="text" name="cidade" placeholder="Feira de Santana" onChange={handleChange} value={cidade} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicDataNascimento">
          <Form.Label>Data de nascimento * </Form.Label>
          <Form.Control type="date" name="data_nascimento" onChange={handleChange} value={data_nascimento} max="2999-12-31" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email * </Form.Label>
          <Form.Control type="email" name="email_cliente" placeholder="angelomiguel@bol.com" onChange={handleChange} value={email_cliente} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Senha * </Form.Label>
          <Form.Control type="password" name="senha_cliente" placeholder="Senha" onChange={handleChange} value={senha_cliente} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPhone">
          <Form.Label>Telefone (Preencha sem o primeiro dígito 9) * </Form.Label>
          <Form.Control type="phone" name="telefone_cliente" placeholder="(75)9999-999" onChange={handleChange} value={telefone_cliente} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicFile">
          <Form.Label>Foto de perfil</Form.Label>
          <Form.Control type="file" onChange={(e) => { setFotoCliente(e.target.files[0]) }}   accept="image/png, image/jpeg"/>
        </Form.Group>

        <Button variant="primary" type="submit" onClick={(e) => { saveEmailandPassword(); e.preventDefault() }}>
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default Form_SignUp
