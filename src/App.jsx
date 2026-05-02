import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Services from './pages/Services'
import Framework from './pages/Framework'
import Lab from './pages/Lab'
import Vulnerabilities from './pages/Vulnerabilities'
import Dashboard from './pages/Dashboard'
import Docs from './pages/Docs'
import News from './pages/News'
import About from './pages/About'
import Contact from './pages/Contact'

function App() {
  return (
    <BrowserRouter basename="/tanasiom-aegis-v3">
      <Navbar />
      <div style={{ background: '#050810', minHeight: '100vh', color: '#c8d4e8' }}>
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/services"        element={<Services />} />
          <Route path="/framework"       element={<Framework />} />
          <Route path="/lab"             element={<Lab />} />
          <Route path="/vulnerabilities" element={<Vulnerabilities />} />
          <Route path="/dashboard"       element={<Dashboard />} />
          <Route path="/docs"            element={<Docs />} />
          <Route path="/news"            element={<News />} />
          <Route path="/about"           element={<About />} />
          <Route path="/contact"         element={<Contact />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
