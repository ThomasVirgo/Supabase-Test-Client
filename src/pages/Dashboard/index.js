import React, { useContext, useEffect } from 'react'
import { SupaBaseContext } from "../../context/supabase_client";
import { useNavigate } from 'react-router-dom';
import { Nav } from '../../layout';

const Dashboard = () => {
    const supabase = useContext(SupaBaseContext)
    const navigate = useNavigate()
    const user = supabase.auth.user()
    console.log(user);

    useEffect(()=>{
        if (!user){
            navigate('/login')
        }
    }, [navigate, user, supabase])

    return (
        <>
        <Nav></Nav>
        <div>Dashboard</div>
        </>
    )
}

export default Dashboard