import React from 'react';
import Tilt from 'react-tilt'
import brain from './unnamed.png'
import './Logo.css'; 

const Logo = () =>{
	return(
		<div className='ma4 mt0'>
			<Tilt className="Tilt br2 shadow-2" options={{ max : 65 }} style={{ height: 150, width: 150 }} >
			 <div className="Tilt-inner pa2">
			 	<img style={{paddingTop:'20px'}} alt='logo' src={brain}/>
			 </div>
			</Tilt>
		</div>
		);
}

export default Logo;