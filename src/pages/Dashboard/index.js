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
        if (!user && !location.includes('#access_token')){
            navigate('/login')
        } else {
            let access_token = location.search.split('access_token=')[1]
            navigate(`/reset_password/${access_token}`)
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