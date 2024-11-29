import './styles/reset.css';
import './styles/style.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Home from './pages/Home';
import Footer from './components/footer/Footer';
import Accounts from './pages/Accounts';
import Authorization from './pages/Authorization';
import Registration from './pages/Registration';
import Transfer from './pages/Transfer';
import ScrollToTop from './utils/ScrollToTop';
import TransferAmount from './components/transferWindows/TransferAmount';
import TransferCredentials from './components/transferWindows/TransferCredentials';
import TransferReview from './components/transferWindows/TransferReview';
import TransferSuccess from './components/transferWindows/TransferSuccess';
import Services from './pages/Services';
import Aboutus from './pages/Aboutus';
import Contactus from './pages/Contactus';

function App() {
  return (
    <Router>
      <ScrollToTop />
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/accounts' element={<Accounts />} />
          <Route path='/services' element={<Services />} />
          <Route path='/aboutus' element={<Aboutus />} />
          <Route path='/contactus' element={<Contactus />} />
          <Route path='/authorization' element={<Authorization />} />
          <Route path='/registration' element={<Registration />} />
          <Route path="/transfer" element={<Transfer />}>
            <Route path="transferamount" element={<TransferAmount />} />
            <Route path="transfercredentials" element={<TransferCredentials />} />
            <Route path="transferreview" element={<TransferReview />} />
            <Route path="transfersuccess" element={<TransferSuccess />} />
          </Route>
        </Routes>
        <Footer />
    </Router>
  );
}

export default App;