import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import panzoom, { type PanZoom } from "panzoom";

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
              zoomSpeed: 0.2,
              smoothScroll: false,
              // pinchSpeed: 8,
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

        const centerX = (containerRect.width - svgRect.width * scale) / 2;
        const centerY = (containerRect.height - svgRect.height * scale) / 2;

        panzoomInstanceRef.current.moveTo(centerX, centerY);
        panzoomInstanceRef.current.zoomAbs(0, 0, scale);
        setZoom(Math.round(scale * 100));
      }
    }
  };

  const handleCenter = () => {
    if (
      panzoomInstanceRef.current &&
      svgContainerRef.current &&
      containerRef.current
    ) {
      const svgElement = svgContainerRef.current.querySelector("svg");
      if (svgElement) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const svgRect = svgElement.getBBox();
        const transform = panzoomInstanceRef.current.getTransform();

        const centerX =
          (containerRect.width - svgRect.width * transform.scale) / 2;
        const centerY =
          (containerRect.height - svgRect.height * transform.scale) / 2;

        panzoomInstanceRef.current.moveTo(centerX, centerY);
      }
    }
  };

  return (
    <div className="preview-container">
      <div className="preview-header">
        <h2>Preview</h2>
        <div className="preview-controls">
          <div className="zoom-controls">
            <button
              onClick={handleZoomOut}
              className="control-btn"
              title="Zoom Out"
            >
              −
            </button>
            <span className="zoom-level">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              className="control-btn"
              title="Zoom In"
            >
              +
            </button>
          </div>
          <button onClick={handleCenter} className="control-btn" title="Center">
            ⊙
          </button>
          <button
            onClick={resetZoom}
            className="control-btn"
            title="Reset Zoom"
          >
            ⟲
          </button>
        </div>
      </div>
      <div ref={containerRef} className="mermaid-preview-wrapper">
        <div ref={svgContainerRef} className="mermaid-preview"></div>
      </div>
    </div>
  );
}
