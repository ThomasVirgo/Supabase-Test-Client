import { SupaBaseContext, supabase } from './context/supabase_client'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { Login, Register, Dashboard, Account, NotFound, ForgotPassword } from './pages'


function App() {
  return (
    <SupaBaseContext.Provider value={supabase}>
      <BrowserRouter>

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset_password" element={<ForgotPassword />} />
            <Route path="/reset_password/:token" element={<ForgotPassword />} />
            <Route path="/" element={<Dashboard />}>
              <Route path="account" element={<Account />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        
      </BrowserRouter>
    </SupaBaseContext.Provider>
  );
}

export default App;
