import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { HostAuthProvider } from '@/contexts/HostAuthContext.jsx';
import ProtectedHostRoute from '@/components/ProtectedHostRoute.jsx';
import GuestJourneyRouter from '@/components/GuestJourneyRouter.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import HostLoginPage from '@/pages/HostLoginPage.jsx';
import HostDashboard from '@/pages/HostDashboard.jsx';

function App() {
    return (
        <HostAuthProvider>
            <Router>
                <ScrollToTop />
                <Routes>
                    {/* Public Guest Journey */}
                    <Route path="/" element={<GuestJourneyRouter />} />
                    
                    {/* Host Routes */}
                    <Route path="/host-login" element={<HostLoginPage />} />
                    <Route 
                        path="/host-dashboard" 
                        element={
                            <ProtectedHostRoute>
                                <HostDashboard />
                            </ProtectedHostRoute>
                        } 
                    />
                </Routes>
            </Router>
        </HostAuthProvider>
    );
}

export default App;
