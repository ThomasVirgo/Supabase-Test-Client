import React, { useContext } from 'react'
import { SupaBaseContext } from '../../context/supabase_client'

const Account = () => {
    const supabase = useContext(SupaBaseContext)
    const user = supabase.auth.user()
    return (
        <div>Accounts Page --- {user.user_metadata.username}</div>
    )
}

export default Account;