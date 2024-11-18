import './styles/reset.css';
import './styles/style.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Home from './pages/Home';
import Footer from './components/footer/Footer';
import Accounts from './pages/Accounts';

function App() {
  return (
    <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='accounts' element={<Accounts />} />
        </Routes>
        <Footer />
    </Router>
  );
}

export default App;