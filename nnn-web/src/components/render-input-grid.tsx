export const RenderInputGrid = ({
  gridRef,
  startDrawing,
  stopDrawing,
  handleDraw,
  inputLayer,
  nodesRef,
}: {
  gridRef: React.RefObject<HTMLDivElement | null>;
  startDrawing: () => void;
  stopDrawing: () => void;
  handleDraw: (e: React.MouseEvent | React.TouchEvent) => void;
  inputLayer: number[];
  nodesRef: React.RefObject<{
    [key: string]: HTMLDivElement[];
  }>;
}) => (
  <div
    ref={gridRef}
    className="grid grid-cols-10 w-[250px] h-[250px] bg-white border rounded-lg shadow-sm overflow-hidden"
    onMouseDown={startDrawing}
    onMouseUp={stopDrawing}
    onMouseLeave={stopDrawing}
    onMouseMove={handleDraw}
    onTouchStart={startDrawing}
    onTouchEnd={stopDrawing}
    onTouchMove={handleDraw}
  >
    {inputLayer.map((value, i) => (
      <div
        key={i}
        ref={(el) => {
          if (el) {
            nodesRef.current.input[i] = el;
          }
        }}
        className={`w-full h-full border-[0.5px] border-gray-100 transition-colors ${
          value === 1 ? "bg-blue-500" : "hover:bg-blue-50"
        }`}
      />
    ))}
  </div>
);
