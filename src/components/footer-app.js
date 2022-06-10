import React from 'react'
import { SocialIcon } from 'react-social-icons';


function Footer(){
    return(
        <div className='container-social flex'>
        <span>Siga-nos</span>
      <div className="social-footer flex justify-center">
            <SocialIcon network='linkedin' url="https://www.linkedin.com/in/angelo-miguel-rib-cerq/"></SocialIcon>
            <SocialIcon network='instagram' url='https://www.instagram.com/therealmichelan/'></SocialIcon>
            <SocialIcon network='github' url='https://github.com/micheltechEr'></SocialIcon>
       </div>
    </div>
    )
}

export default Footer