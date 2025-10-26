import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import panzoom, { type PanZoom } from "panzoom";
import { CardContent, CardHeader } from "@/ui/card";
import { Button } from "@/ui/button";
import { ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface MermaidPreviewProps {
  code: string;
}

export default function MermaidPreview({ code }: MermaidPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const panzoomInstanceRef = useRef<PanZoom | null>(null);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
    });
  }, []);

  useEffect(() => {
    if (!svgContainerRef.current || !code.trim()) return;

    const renderDiagram = async () => {
      try {
        const id = "mermaid-" + Math.random().toString(36).substring(2, 11);
        const { svg } = await mermaid.render(id, code);
        if (svgContainerRef.current) {
          svgContainerRef.current.innerHTML = svg;

          // Initialize panzoom after rendering
          if (panzoomInstanceRef.current) {
            panzoomInstanceRef.current.dispose();
          }

          const svgElement = svgContainerRef.current.querySelector("svg");
          if (svgElement) {
            const instance = panzoom(svgElement, {
              maxZoom: 20,
              minZoom: 0.1,
              bounds: true,
              boundsPadding: 0.1,
              zoomSpeed: 0.2, // using 3 if apply Cmd + Zoom
              smoothScroll: false,
              // Only allow zoom when Ctrl (Windows) or Cmd (Mac) is pressed
              // beforeWheel: (e) => {
              //   // Allow zoom only if Ctrl or Cmd key is pressed
              //   const shouldZoom = e.ctrlKey || e.metaKey;
              //   return !shouldZoom; // return true to prevent panzoom handling
              // },
            });

            panzoomInstanceRef.current = instance;

            // Update zoom percentage on zoom
            instance.on("zoom", () => {
              const transform = instance.getTransform();
              setZoom(Math.round(transform.scale * 100));
            });

            // Reset zoom to fit content
            resetZoom();
          }
        }
      } catch (error) {
        if (svgContainerRef.current) {
          svgContainerRef.current.innerHTML = `<div class="error">Error rendering diagram: ${
            error instanceof Error ? error.message : "Unknown error"
          }</div>`;
        }
      }
    };

    renderDiagram();

    return () => {
      if (panzoomInstanceRef.current) {
        panzoomInstanceRef.current.dispose();
      }
    };
  }, [code]);

  const handleZoomIn = () => {
    if (panzoomInstanceRef.current) {
      panzoomInstanceRef.current.smoothZoom(0, 0, 1.2);
    }
  };

  const handleZoomOut = () => {
    if (panzoomInstanceRef.current) {
      panzoomInstanceRef.current.smoothZoom(0, 0, 0.8);
    }
  };

  const resetZoom = () => {
    if (panzoomInstanceRef.current && svgContainerRef.current) {
      const svgElement = svgContainerRef.current.querySelector("svg");
      if (svgElement && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const svgRect = svgElement.getBBox();

        const scaleX = (containerRect.width - 100) / svgRect.width;
        const scaleY = (containerRect.height - 100) / svgRect.height;
        const scale = Math.min(scaleX, scaleY, 1);

        // Position at top-left with 50px padding
        const topLeftX = 50;
        const topLeftY = 50;

        panzoomInstanceRef.current.moveTo(topLeftX, topLeftY);
        panzoomInstanceRef.current.zoomAbs(0, 0, scale);
        setZoom(Math.round(scale * 100));
      }
    }
  };

  // const handleCenter = () => {
  //   if (
  //     panzoomInstanceRef.current &&
  //     svgContainerRef.current &&
  //     containerRef.current
  //   ) {
  //     const svgElement = svgContainerRef.current.querySelector("svg");
  //     if (svgElement) {
  //       const containerRect = containerRef.current.getBoundingClientRect();
  //       const svgRect = svgElement.getBBox();
  //       const transform = panzoomInstanceRef.current.getTransform();

  //       const centerX =
  //         (containerRect.width - svgRect.width * transform.scale) / 2;
  //       const centerY =
  //         (containerRect.height - svgRect.height * transform.scale) / 2;

  //       panzoomInstanceRef.current.moveTo(centerX, centerY);
  //     }
  //   }
  // };

  return (
    <div className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          {/* <CardTitle>Preview</CardTitle> */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5 border rounded-md">
              <Button
                onClick={handleZoomOut}
                variant="ghost"
                size="sm"
                className="h-7 w-7"
                title="Zoom Out"
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-xs font-medium px-1 min-w-[2.5rem] text-center">
                {zoom}%
              </span>
              <Button
                onClick={handleZoomIn}
                variant="ghost"
                size="sm"
                className="h-7 w-7"
                title="Zoom In"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
            {/* <Button
              onClick={handleCenter}
              variant="outline"
              size="icon"
              title="Center"
            >
              <Maximize2 className="h-4 w-4" />
            </Button> */}
            <Button
              onClick={resetZoom}
              variant="ghost"
              size="sm"
              className="h-7 w-7"
              title="Reset Zoom"
            >
              <RotateCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <div ref={containerRef} className="w-full h-full relative">
          <div
            ref={svgContainerRef}
            className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          ></div>
        </div>
      </CardContent>
    </div>
  );
}
