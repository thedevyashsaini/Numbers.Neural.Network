import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast"

export const RenderLayer = ({
  nodes,
  label,
  nodesRef,
  layerKey,
  weights,
  biases,
}: {
  nodes: number[];
  label: string;
  nodesRef: React.RefObject<{
    [key: string]: HTMLDivElement[];
  }>;
  layerKey: keyof typeof nodesRef.current;
  weights: number[][] | undefined;
  biases: number[][] | undefined;
}) => {
  const { toast } = useToast()

  return (
  <div className="flex flex-col items-center mx-4">
    <p className="text-sm font-medium mb-2">
      {label}{" "}
      <Copy
        onClick={() => {
          navigator.clipboard.writeText(
            JSON.stringify({
              Weights: weights,
              Biases: biases,
            })
          );
          toast({
            description: `${label !== "Output" ? label : label + " layer"} parameters copied to clipboard.`,
          });  
        }}
        className="inline h-4 mb-1 cursor-pointer"
      />
    </p>
    <div className="flex flex-col gap-1">
      {nodes.map((activation, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) {
              nodesRef.current[layerKey][i] = el;
            }
          }}
          className="w-6 relative border border-gray-300 rounded-lg bg-white overflow-hidden"
          style={{ height: "24px" }}
        >
          <div
            className="absolute bottom-0 left-0 w-full bg-blue-600 transition-all duration-200"
            style={{ height: `${activation * 100}%` }}
          />
          {label === "Output" && (
            <span className="absolute inset-0 text-xs flex items-center justify-center z-10">
              {i}
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
)};
