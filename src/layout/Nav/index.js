import React, { useContext } from 'react';
import { SupaBaseContext } from '../../context/supabase_client';
import { useNavigate, NavLink } from 'react-router-dom';


const Nav = () => {
    const supabase = useContext(SupaBaseContext)
    const user = supabase.auth.user()
    const navigate = useNavigate()
    async function logout(){
        const { error } = await supabase.auth.signOut()
        console.log(error);
        navigate('/')
    }
    return (
        <div>
            { user &&
            <>
                <p>Welcome, {user.user_metadata.username}</p>
                <NavLink to='/account'>Account</NavLink>
                <NavLink to='/'>Home</NavLink>
                <button onClick = {logout}>Logout</button>
            </>
            }
        </div>
    ) 
}

export default Nav;