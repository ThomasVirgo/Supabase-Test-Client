import React, { useContext, useEffect } from 'react'
import { SupaBaseContext } from "../../context/supabase_client";
import { useNavigate, Outlet } from 'react-router-dom';
import { Nav } from '../../layout';

const Dashboard = () => {
    const supabase = useContext(SupaBaseContext)
    const navigate = useNavigate()
    const user = supabase.auth.user()
    console.log(user);

    useEffect(()=>{
        let location = window.location.href;
        let isReset = location.includes('#access_token')
        if (isReset){
            let hash = location.split('#')[1]
            let token_list = hash.split('&')[0]
            let access_token = token_list.split('=')[1]
            console.log(access_token);
            navigate(`/new_password/${access_token}`)
        }
        if (!user && !isReset){
            navigate('/login')
        } 
    }, [navigate, user, supabase])

    return (
        <>
        <Nav></Nav>
        {/* need outlet for children to render */}
        <Outlet/>
        </>
    )
}

export default Dashboard