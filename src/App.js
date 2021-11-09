import { SupaBaseContext, supabase } from './context/supabase_client'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { Login, Register, Dashboard, Account } from './pages'

// use multiple sets of routes, see documentation

function App() {
  return (
    <SupaBaseContext.Provider value={supabase}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />}>
            <Route path="account" element={<Account />} />
          </Route>
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/register" element={<Register/>} />
        </Routes>
      </BrowserRouter>
    </SupaBaseContext.Provider>
  );
}

export default App;
