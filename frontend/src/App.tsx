import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/features/NavBar'
import HomePage from './pages/HomePage'
import GojuuonPage from './pages/GojuuonPage'
import QuizPage from './pages/QuizPage'
import QuizHistoryPage from './pages/QuizHistoryPage'
import VocabularyPage from './pages/VocabularyPage'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gojuuon" element={<GojuuonPage />} />
        <Route path="/gojuuon/quiz" element={<QuizPage />} />
        <Route path="/gojuuon/history" element={<QuizHistoryPage />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
