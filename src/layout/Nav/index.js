import React, { useContext } from 'react';
import { SupaBaseContext } from '../../context/supabase_client';
import { useNavigate, NavLink } from 'react-router-dom';
import { StyledButton, GandalfLogo } from '../../components';
import './style.css'


const Nav = () => {
    const supabase = useContext(SupaBaseContext)
    const user = supabase.auth.user()
    const navigate = useNavigate()
    async function logout(){
        const { error } = await supabase.auth.signOut()
        if (!error){
            navigate('/')
        }
    }
    return (
        <div className='nav_container'>
            { user &&
            <>  
                {/* <div>
                    <p>Welcome, {user.user_metadata.username}</p>
                </div> */}
                <GandalfLogo style={{textAlign: 'center'}}/>
                <div className='nav_links'>
                    <NavLink to='/'>Home</NavLink>
                    <NavLink to='/account'>Account</NavLink>
                    <NavLink to='/chat'>Chat</NavLink>
                    <NavLink to='/play'>Play</NavLink>
                    <StyledButton onClick = {logout} text='Logout' />
                </div>
            </>
            }
        </div>
    ) 
}

export default Nav;