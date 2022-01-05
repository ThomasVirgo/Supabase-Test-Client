import React, { useState, useEffect, useContext } from "react";
import { SupaBaseContext } from "../../context/supabase_client";
import './style.css'

const Rankings = () => {
    const [ranks, setRanks] = useState([])
    const supabase = useContext(SupaBaseContext)
    const user = supabase.auth.user()
    useEffect(()=>{
        async function collectElo(){
            const { data, error } = await supabase
                    .from('elo')
                    .select()
                    .order('elo', { ascending: false })
            setRanks(data)
            console.log(data);
        }
        collectElo()
    }, [])

    const rankCards = ranks.map((r,idx) => <div className="rank_card">
        <div>{idx+1}</div>
        <div><strong>{r.username}</strong></div>
        <div>{r.elo} G points</div>
        <div>Bronze Division</div>
    </div>)

    return (
        <>
        <h1 className="rankings_header">Rankings</h1>
        {rankCards}
        </>
    )
}

export default Rankings;