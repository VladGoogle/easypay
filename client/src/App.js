import "./styles/reset.css";
import "./styles/style.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Home from "./pages/Home";
import Footer from "./components/footer/Footer";
import Accounts from "./pages/Accounts";
import Authorization from "./pages/Authorization";
import Registration from "./pages/Registration";
import Transfer from "./pages/Transfer";
import ScrollToTop from "./utils/ScrollToTop";
import TransferAmount from "./components/transferWindows/TransferAmount";
import TransferCredentials from "./components/transferWindows/TransferCredentials";
import TransferReview from "./components/transferWindows/TransferReview";
import TransferSuccess from "./components/transferWindows/TransferSuccess";
import Services from "./pages/Services";
import Aboutus from "./pages/Aboutus";
import Contactus from "./pages/Contactus";
import { TokenProvider } from "./TokenContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Unauthorized from "./components/unathorized/Unathorized";
import Authorized from "./components/unathorized/Authorized";
import SumSubFlow from "./components/sumsumflow/SumSubFlow";
import Settings from "./pages/Settings";

function App() {
  return (
    <TokenProvider>
      <Router>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/accounts"
            element={
              <Unauthorized>
                <Accounts />
              </Unauthorized>
            }
          />
          <Route path="/services" element={<Services />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/contactus" element={<Contactus />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/sumsub-verify/:applicantId" element={<SumSubFlow />} />
          <Route path="/authorization" element={<Authorization />} />
          <Route path="/registration" element={<Registration />} />
          <Route
            path="/transfer"
            element={
              <Unauthorized>
                <Transfer />
              </Unauthorized>
            }
          >
            <Route path="transferamount" element={<TransferAmount />} />
            <Route
              path="transfercredentials"
              element={<TransferCredentials />}
            />
            <Route path="transferreview" element={<TransferReview />} />
            <Route path="transfersuccess" element={<TransferSuccess />} />
          </Route>
        </Routes>
        <Footer />
      </Router>
      <ToastContainer />
    </TokenProvider>
  );
}

export default App;
