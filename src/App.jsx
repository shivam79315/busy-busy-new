import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Footer } from "./components/layout/Footer";
import { Toaster } from "sonner";
import Navbar from "./components/layout/Navbar";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import QueryProvider from "./providers/QueryProvider";

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <BrowserRouter>
          <div
            className="bg-super-grad min-h-screen"
            data-testid="store-app-shell"
          >
            <div
              className="pointer-events-none fixed inset-0 z-[1] opacity-[0.03]"
              style={{
                backgroundImage:
                  "url('https://grainy-gradients.vercel.app/noise.svg')",
              }}
            />
            <Navbar />
            <main
              className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-36 sm:px-6 md:px-10 md:pt-28"
              data-testid="app-main-content"
            >
              <AppRoutes />
            </main>
            <Footer />
            <Toaster richColors position="top-right" />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
