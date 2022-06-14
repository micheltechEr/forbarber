import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import { getDatabase, ref, get, child } from "@firebase/database";

import { Form, Button } from 'react-bootstrap'
function SignInBarber(props) {
    const [state, setState] = useState({
        emailBarbearia: "",
        senhaBarbearia: ""
    })

    const auth = getAuth();
    const navigate = useNavigate()
    var barberAuthFunctions = {
        handleChange: function (event) {
            const { name, value } = event.target;
            setState((prevState) => {
                return {
                    ...prevState,
                    [name]: value,
                };
            });
        },
        signbarberAuth: function () {
            if (state.emailBarbearia && state.senhaBarbearia) {
                signInWithEmailAndPassword(auth, state.emailBarbearia, state.senhaBarbearia)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        console.log('Logado ', user)

                        const barberAuth = auth.currentUser;
                        const barberAuthRef = ref(getDatabase())


                        get(child(barberAuthRef, 'barber/' + barberAuth.uid)).then((snapshot) => {
                            if (snapshot.exists()) {
                                console.log(snapshot.val());
                                let name = snapshot.val().barberData.nome_barber
                                let barber_profile = snapshot.val().barberData.barber_profile
                                let id_barber = snapshot.val().barberData.uid
                                let email_barber = snapshot.val().barberData.email_barber
                                let password_barber = snapshot.val().barberData.password_barber
                                let barber_city = snapshot.val().barberData.cidade
                                let phone_barber = snapshot.val().barberData.telefone_barbearia
                                navigate('/perfil_barbearia', { state: { name, barber_profile, id_barber, email_barber, password_barber, barber_city, phone_barber } })
                            } else {
                                Swal.fire('Ops', 'Nenhum dado encontrado, verifique as credenciais ou crie um acesso', 'error')
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

        sendResetPassBarber: function () {
            if (state.emailBarbearia) {
                sendPasswordResetEmail(auth, state.emailBarbearia)
                    .then(() => {
                        Swal.fire(
                            'Sucesso!',
                            'Um link de redefinição de senha foi enviado ao seu e-mail, verifique sua caixa de entrada',
                            'success'
                        )

                    })
                    .catch((error) => {
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


    const handleChange = barberAuthFunctions.handleChange
    const signbarberAuth = barberAuthFunctions.signbarberAuth
    const { emailBarbearia, senhaBarbearia } = state
    const sendResetPassBarber = barberAuthFunctions.sendResetPassBarber;
    return (
        <div>
            <Form.Group className="e-mail-pass" controlId="exampleForm.ControlInput1">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="seuzebarber@bol.com"
                    name="emailBarbearia"
                    onChange={handleChange} value={emailBarbearia}
                />
                <Form.Label>Senha</Form.Label>
                <Form.Control
                    type="password"
                    placeholder=""
                    name="senhaBarbearia"
                    onChange={handleChange} value={senhaBarbearia}
                />

                <Button onClick={() => { signbarberAuth() }}>Enviar</Button>
            </Form.Group>
            <span onClick={() => { sendResetPassBarber() }} id="forgot_password" >Esqueci a senha</span>
        </div>


    )
}

export default SignInBarber