import React, { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import { getDatabase, ref, get, child } from "@firebase/database";
import { Form, Button } from 'react-bootstrap'
function SignInCustomer(props) {
    const [state, setState] = useState({
        emailCliente: "",
        senhaCliente: ""
    })

    const auth = getAuth();
    const navigate = useNavigate()
    var customerAuthFunctions = {
        handleChange: function (event) {
            const { name, value } = event.target;
            setState((prevState) => {
                return {
                    ...prevState,
                    [name]: value,
                };
            });
        },
        signCustomerAuth: function () {
            if (state.emailCliente && state.senhaCliente) {
                signInWithEmailAndPassword(auth, state.emailCliente, state.senhaCliente)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        const customerAuth = auth.currentUser;
                        const customerAuthRef = ref(getDatabase())


                        get(child(customerAuthRef, 'customer/' + customerAuth.uid)).then((snapshot) => {
                            if (snapshot.exists()) {
                                console.log(snapshot.val());
                                let name = snapshot.val().custData.nome
                                let customer_profile = snapshot.val().custData.customer_profile
                                let id_customer = snapshot.val().custData.uid
                                let age_customer = snapshot.val().custData.data_nascimento
                                let city_customer = snapshot.val().custData.cidade
                                let email_customer = snapshot.val().custData.email_customer
                                let phone_customer = snapshot.val().custData.telefone_cliente
                                let password_customer = snapshot.val().custData.senha_customer
                                navigate('/perfil_cliente', { state: { name, customer_profile, id_customer, age_customer, city_customer, email_customer, phone_customer, password_customer } })

                            } else {
                                Swal.fire('Ops', 'Nenhum dado encontrado, verifique as credenciais ou crie um acesso', 'error');
                            }

                        }).catch((error) => {
                            console.error(error);
                        });
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;

                        let typeError = {
                            "Firebase: Error (auth/wrong-password).": errType => { errType === "auth/wrong-password" ? Swal.fire('Ops', 'Senha incorreta, tente novamente', 'error') : console.log('') },
                            "Firebase: Error (auth/user-not-found).": errType => { errType === "auth/user-not-found" ? Swal.fire('Ops', 'Usuário não encontrado, verifique se o e-mail está correto', 'error') : console.log('') },
                            "Firebase: Error (auth/account-exists-with-different-credential).": errType => { errType === "auth/account-exists-with-different-credential" ? Swal.fire('Ops', 'O usuário existe, porém com outra credencial, verifique e tente novamente', 'error') : console.log('') }
                        }

                        function errorReturn(errMessage, errType) {
                            return typeError[errMessage](errType)
                        }
                        errorReturn(errorMessage, errorCode)
                    });
            }
            else {
                Swal.fire(
                    'Atenção',
                    'Preencha todos os campos',
                    'warning'
                )
            }
        },
        sendResetPassCustomer: function () {
            if (state.emailCliente) {
                sendPasswordResetEmail(auth, state.emailCliente)
                    .then(() => {
                        Swal.fire(
                            'Sucesso!',
                            'Um link de redefinição de senha foi enviado ao seu e-mail, verifique sua caixa de entrada',
                            'success'
                        )

                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(errorMessage)
                    })
            }
            else {
                Swal.fire(
                    'Atenção',
                    'Preencha com o endereço de e-mail',
                    'warning'
                )

            }
        }
    }

    const handleChange = customerAuthFunctions.handleChange;
    const signCustomerAuth = customerAuthFunctions.signCustomerAuth;
    const sendResetPassCustomer = customerAuthFunctions.sendResetPassCustomer;
    const { emailCliente, senhaCliente } = state

    return (

        <div>

            <Form.Group className="e-mail-pass" controlId="exampleForm.ControlInput1">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="angelo@bol.com"
                    name="emailCliente"
                    onChange={handleChange} value={emailCliente}
                />

                <Form.Label>Senha</Form.Label>

                <Form.Control
                    type="password"
                    placeholder=""
                    name="senhaCliente"
                    onChange={handleChange} value={senhaCliente}
                />

                <Button onClick={() => { signCustomerAuth() }}>OK</Button>
            </Form.Group>
            <span onClick={() => { sendResetPassCustomer() }} id="forgot_password" >Esqueci a senha</span>


        </div>





    )



}

export default SignInCustomer