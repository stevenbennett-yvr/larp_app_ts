import { AppShell, Container, Header } from '@mantine/core';
import { useMediaQuery, useViewportSize } from '@mantine/hooks'
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { MageProvider } from './contexts/MageContext';
import { CabalProvider } from './contexts/CabalContext';

import PrivateRoute from './PrivateRoute';

import './App.css';
import Login from './components/Login'
import Dashboard from './components/Dashboard';
import Topbar from './topbar/Topbar';
import GenerateAwakened from './components/tatteredVeil/CreateAwakened'
import TatteredVeilVenueDashboard from './components/tatteredVeil/TatteredVeilDashboard'
import AwakenedPage from './components/tatteredVeil/AwakenedPage';

import { globals } from './globals';
import { UserProvider } from './contexts/UserContext';


function App() {
  const { height: viewportHeight, width: viewportWidth } = useViewportSize()
  globals.viewportHeightPx = viewportHeight
  globals.viewportWidthPx = viewportWidth
  globals.isPhoneScreen = useMediaQuery(`(max-width: ${globals.phoneScreenW}px)`)
  globals.isSmallScreen = useMediaQuery(`(max-width: ${globals.smallScreenW}px)`)

  useEffect(() => {
    globals.largeFontSize = globals.isPhoneScreen ? "21px" : "25px"
    globals.smallFontSize = globals.isPhoneScreen ? "16px" : "20px"
    globals.smallerFontSize = globals.isPhoneScreen ? "14px" : "16px"
  },  [] )

  return (
        <Router>
          <AuthProvider>
            <UserProvider>
              <MageProvider>
                <CabalProvider>
                <AuthenticatedApp></AuthenticatedApp>
                </CabalProvider>
              </MageProvider>
            </UserProvider>
          </AuthProvider>
        </Router>

  );
}


// TODO: Setup the side bar to display character levels. This will be difficult

function AuthenticatedApp() {
  const { currentUser } = useAuth();
  const showHeader = currentUser != null;

  return (
    <AppShell
      padding="0"
      header={showHeader?<Header height={75} p="xs"><Topbar /></Header>:<></>}
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      <Container h={"100%"}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/create-mage" element={<GenerateAwakened/>}/>
          <Route path="/tattered-veil" element={<TatteredVeilVenueDashboard/>}/>
          <Route path="/awakened-sheet/:characterId" element={<AwakenedPage/>}/>
        </Routes>
      </Container>
    </AppShell>
  );
}

export default App;
