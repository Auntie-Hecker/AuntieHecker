
import Home from './components/Home';
import CaseWebs from './components/CaseWebs';
import ThreatLogs from './components/ThreatLogs';
import IOCMasterLists from './components/IOCMasterLists';
import ToolsAndScripts from './components/ToolsAndScripts';
import UploadDownloadZone from './components/UploadDownloadZone';
import ContactAbout from './components/ContactAbout';
import './App.css';

function App() {
  return (
    <div className="main-layout">
      <Home />
      <CaseWebs />
      <ThreatLogs />
      <IOCMasterLists />
      <ToolsAndScripts />
      <UploadDownloadZone />
      <ContactAbout />
    </div>
  );
}

export default App;
