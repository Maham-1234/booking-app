import AppRoutes from "./routes/AppRoutes";
// If you add a toast notification system, you'd import its component here
// import { Toaster } from 'sonner';
import Navbar from './components/PageComponents/Navbar'
import Footer from './components/PageComponents/Footer'

function App() {
  return (
    <>
    <Navbar />
      <AppRoutes />
      <Footer />
    </>
  );
}

export default App;
