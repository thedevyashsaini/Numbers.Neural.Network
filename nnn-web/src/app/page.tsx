'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Brain, Copy } from 'lucide-react';
import { RenderLayer } from '@/components/render-layer';
import { RenderInputGrid } from '@/components/render-input-grid';
import {loadModelParams, feedForward, ModelParams} from '@/NNfunctions';
import { useToast } from '@/hooks/use-toast';

function Home() {
  const { toast } = useToast()
  const [isDrawing, setIsDrawing] = useState(false);
  const [inputLayer, setInputLayer] = useState<number[]>(Array(100).fill(0));
  const [modelParams, setModelParams] = useState<ModelParams | null>(null);
  const [activations, setActivations] = useState({
    hidden1: Array(20).fill(0),
    hidden2: Array(20).fill(0),
    hidden3: Array(10).fill(0),
    output: Array(10).fill(0)
  });
  const svgRef = useRef<SVGSVGElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<{ [key: string]: HTMLDivElement[] }>({
    input: [],
    hidden1: [],
    hidden2: [],
    hidden3: [],
    output: []
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      drawConnections();
    }, 100);
    
    const fetchModelParams = async () => {
      try {
        const params = await loadModelParams();
        setModelParams(params);
      } catch (error) {
        console.error("Error loading model parameters:", error);
      }
    };

    fetchModelParams();


    return () => clearTimeout(timer);
  }, []);

  const startDrawing = () => setIsDrawing(true);
  const stopDrawing = () => setIsDrawing(false);

  const handleDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !gridRef.current) return;

    const grid = gridRef.current;
    const rect = grid.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = Math.floor(((clientX - rect.left) / rect.width) * 10);
    const y = Math.floor(((clientY - rect.top) / rect.height) * 10);
    
    if (x >= 0 && x < 10 && y >= 0 && y < 10) {
      const index = y * 10 + x;
      const newInputLayer = [...inputLayer];
      newInputLayer[index] = 1;
      const prediction = handlePredict(newInputLayer);
      prediction && setActivations({
        hidden1: prediction.A1,
        hidden2: prediction.A2,
        hidden3: prediction.A3,
        output: prediction.yHat
      });
      setInputLayer(newInputLayer);
    }
  };

  const handlePredict = (input: number[]) => {
    if (!modelParams) return;
    return feedForward(modelParams, input);
  };

  const clearGrid = () => {
    setInputLayer(Array(100).fill(0));
    setActivations({
      hidden1: Array(20).fill(0),
      hidden2: Array(20).fill(0),
      hidden3: Array(10).fill(0),
      output: Array(10).fill(0)
    });
  };

  const drawConnections = () => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const svgRect = svg.getBoundingClientRect();
    
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const getNodePositions = (elements: HTMLDivElement[]) => {
      return elements.map(el => {
        const rect = el.getBoundingClientRect();
        return {
          left: rect.left - svgRect.left,
          right: rect.right - svgRect.left,
          center: {
            y: rect.top + rect.height / 2 - svgRect.top
          }
        };
      });
    };

    const createConnectionsBetweenLayers = (startLayer: HTMLDivElement[], endLayer: HTMLDivElement[]) => {
      const startPositions = getNodePositions(startLayer);
      const endPositions = getNodePositions(endLayer);

      startPositions.forEach(start => {
        endPositions.forEach(end => {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', String(start.right));
          line.setAttribute('y1', String(start.center.y));
          line.setAttribute('x2', String(end.left));
          line.setAttribute('y2', String(end.center.y));
          line.setAttribute('stroke', 'rgba(59, 130, 246, 0.1)');
          line.setAttribute('stroke-width', '0.5');
          svg.appendChild(line);
        });
      });
    };

    // Connect layers
    createConnectionsBetweenLayers(nodesRef.current.input, nodesRef.current.hidden1);
    createConnectionsBetweenLayers(nodesRef.current.hidden1, nodesRef.current.hidden2);
    createConnectionsBetweenLayers(nodesRef.current.hidden2, nodesRef.current.hidden3);
    createConnectionsBetweenLayers(nodesRef.current.hidden3, nodesRef.current.output);
  };


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Brain className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">
            Number&apos;s Neural Network (NNN)
          </h1>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg relative">
          <svg
            ref={svgRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
          />
          
          <div className="flex flex-wrap items-center justify-center gap-8 relative" style={{ zIndex: 1 }}>
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium mb-2 text-black">Input Layer (10x10) <Copy onClick={() => {
          navigator.clipboard.writeText(
            JSON.stringify(inputLayer)
          );
          toast({
            description: `Input layer copied to clipboard.`,
          });  
        }} className="inline h-4 mb-1 cursor-pointer" /></p>
              <RenderInputGrid gridRef={gridRef} startDrawing={startDrawing} stopDrawing={stopDrawing} handleDraw={handleDraw} inputLayer={inputLayer} nodesRef={nodesRef}/> 
              <button
                onClick={clearGrid}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear
              </button>
            </div>

            <div className="flex items-center space-x-4 text-black">
              <RenderLayer nodes={activations.hidden1} label='H-Layer 1' nodesRef={nodesRef} layerKey='hidden1' weights={modelParams?.W1} biases={modelParams?.b1} />
              <RenderLayer nodes={activations.hidden2} label='H-Layer 2' nodesRef={nodesRef} layerKey='hidden2' weights={modelParams?.W2} biases={modelParams?.b2}/>
              <RenderLayer nodes={activations.hidden3} label='H-Layer 3' nodesRef={nodesRef} layerKey='hidden3' weights={modelParams?.W3} biases={modelParams?.b3}/>
              <RenderLayer nodes={activations.output} label='Output' nodesRef={nodesRef} layerKey='output' weights={modelParams?.W4} biases={modelParams?.b4}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;