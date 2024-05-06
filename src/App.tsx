import { Route, Routes } from "react-router-dom"
import HomePage from "./components/HomePage"

function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path='/sign-up' element={<p>TODO</p>} />
      <Route path='/sign-in' element={<p>TODO</p>} />
    </Routes>
  )
}

export default App
