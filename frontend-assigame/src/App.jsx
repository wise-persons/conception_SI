import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Navbar />
                <main style={{ flex: 1 }}>
                    <AppRoutes />
                </main>
                <Footer />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
