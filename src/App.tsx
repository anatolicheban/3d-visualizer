import {useEffect, useState} from 'react'
import {Viewer} from "./Viewer";

function App() {
  const [, setViewer] = useState<Viewer | null>(null)

  useEffect(() => {
    setViewer(
      new Viewer(
        document.getElementById('viewer')! as HTMLCanvasElement,
        document.getElementById('viewer-wrap')!,
      )
    )
  }, []);

  return (
      <div id="viewer-wrap">
        <canvas id="viewer"></canvas>
      </div>
  )
}

export default App
