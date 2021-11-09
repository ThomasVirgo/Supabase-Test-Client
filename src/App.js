import { SupaBaseContext, supabase } from './context/supabase_client'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { Login, Register, Dashboard } from './pages'

function App() {
  return (
    <SupaBaseContext.Provider value={supabase}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Dashboard/>} />
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/register" element={<Register/>} />
        </Routes>
      </BrowserRouter>
    </SupaBaseContext.Provider>
  );
}

export default App;
