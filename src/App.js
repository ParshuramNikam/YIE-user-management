import Home from './Home'
import {Route, Routes} from 'react-router-dom'
import LoginPage from './LoginPage'
import RegistrationPage from './RegistrationPage'
import Dashboard from './Dashboard';

function App() {
  return (
    <div className="App min-vw-100 min-vh-100">
      <Routes>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/signup" element={<RegistrationPage />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
      </Routes>
    </div>
  );
}

export default App;
