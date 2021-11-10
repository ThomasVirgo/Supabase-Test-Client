import React, { useEffect, useContext } from 'react'
import { SupaBaseContext } from '../../context/supabase_client'

const Chat = () => {
    const supabase = useContext(SupaBaseContext)
    useEffect(()=>{
        async function fecthData(){
            const { data, error } = await supabase.from('profiles').select()
            console.log('error', error);
            console.log(data);
        }
        fecthData()
    }, [supabase])
    return (
        <div>
            Chat 
        </div>
    )
}

export default Chat;