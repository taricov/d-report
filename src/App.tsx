import Footer from "./components/Footer";
import Header from "./components/Header";
import Incorporate from "./components/Incorporate";

import {
  QueryClient,
  QueryClientProvider

} from 'react-query'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import Home from "./pages/Home";
import About from "./pages/About";
import Reports from "./pages/Reports";
import Report from "./pages/Report";

const queryClient = new QueryClient()


function App() {
  return (
    <>
        <QueryClientProvider client={queryClient}>
          <Header />
          <BrowserRouter>
<Routes>
<Route  path='/' element={<Home/>} />
<Route  path='/about' element={<About/>} />
<Route  path='/reports' element={<Reports/>} />
<Route  path='/reports/:id' element={<Report/>} />

</Routes>

</BrowserRouter>
    <Footer/>
    </QueryClientProvider>
    </>
  );
}

export default App;
