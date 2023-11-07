import { AppShell, Container, Header } from '@mantine/core';
import { useMediaQuery, useViewportSize } from '@mantine/hooks'
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { MageProvider } from './contexts/MageContext';
import { CabalProvider } from './contexts/CabalContext';
import { CharacterProvider } from './contexts/CharacterContext';
import { CoterieProvider } from './contexts/CoterieContext';

import PrivateRoute from './PrivateRoute';

import './assets/css/App.css';
import Login from './pages/Login/Login'
import Dashboard from './pages/Home/Dashboard';
import Topbar from './topbar/Topbar';
import GenerateAwakened from './pages/TatteredVeilGenerator/CreateAwakened'
import TatteredVeilVenueDashboard from './pages/TatteredVeilDashboard/TatteredVeilDashboard'
import AwakenedPage from './pages/TatteredVeilEditor/AwakenedPage';
import GoodIntentionsDashboard from './pages/GoodIntentionsDashboard/GoodIntentionsDashboard';
import AwakenedSTEditor from './pages/TatteredVeilSTEditor/AwakenedSTEditor';
import GenerateKindred from './pages/GoodIntentionsGenerator/GoodIntentionsGenerator';

import { globals } from './assets/globals';
import { UserProvider } from './contexts/UserContext';
import KindredPage from './pages/GoodIntentionsEditor/KindredPage';


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
                  <CharacterProvider>
                    <CoterieProvider>
                <AuthenticatedApp></AuthenticatedApp>
                    </CoterieProvider>
                  </CharacterProvider>
                </CabalProvider>
              </MageProvider>
            </UserProvider>
          </AuthProvider>
        </Router>

  );
}

function AuthenticatedApp() {
  const { currentUser } = useAuth();
  const showHeader = currentUser != null;

  return (
    <AppShell
      padding="0"
      header={showHeader?<Header className='no-print' height={75} p="xs"><Topbar /></Header>:<></>}
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      <Container h={"100%"}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/create-mage" element={<PrivateRoute><GenerateAwakened/></PrivateRoute>}/>
          <Route path="/tattered-veil/:venueId" element={<PrivateRoute><TatteredVeilVenueDashboard/></PrivateRoute>}/>
          <Route path="/awakened-sheet/:characterId" element={<PrivateRoute><AwakenedPage/></PrivateRoute>}/>
          <Route path="/good-intentions/:venueId" element={<PrivateRoute><GoodIntentionsDashboard/></PrivateRoute>}/>
          <Route path='/awakened-full-edit/:characterId' element={<PrivateRoute><AwakenedSTEditor></AwakenedSTEditor></PrivateRoute>}/>
          <Route path='/create-kindred/:venueId' element={<PrivateRoute><GenerateKindred/></PrivateRoute>}/>
          <Route path='/kindred-sheet/:characterId' element={<PrivateRoute><KindredPage/></PrivateRoute>}/>
        </Routes>
      </Container>
    </AppShell>
  );
}

export default App;
