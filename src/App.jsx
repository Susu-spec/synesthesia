import React from 'react';
import Homepage from './Homepage';
import VisualizerPage from './VisualizerPage';
import {BrowserRouter , Routes , Route} from 'react-router-dom'


function App() {
  // Define state variables for audioFile and setAudioFile
  // const [audioFile, setAudioFile] = React.useState(null);

  return (
    <BrowserRouter>
      <Routes>
      <Route exact path='/' element={<Homepage/>} />
      <Route exact path='/visualizer' element={<VisualizerPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;