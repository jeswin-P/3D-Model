import { getModels } from "../api";
import LazyModel from "./LazyModel";
import "../styles/Viewer.css";
import { useEffect, useState } from "react";

const Viewer = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getModels();
        setModels(res.data);
      } catch (error) {
        console.error("Failed to load models:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return (
    <div className="loading-container">
      <div className="orbit-dot"></div>
      <p>INITIALIZING GRID...</p>
    </div>
  );

  return (
    <div className="viewer-container">
      <div className="viewer-header">
        <h1>3D models</h1>
      </div>

      <div className="models-grid">
        {models.map((model) => (
          <div key={model._id} className={`model-card ${expandedId === model._id ? 'expanded' : ''}`}>
            {expandedId === model._id && (
              <button className="close-expanded" onClick={() => setExpandedId(null)} />
            )}

            <LazyModel url={`${API_BASE}/files/${model.fileId || model.filename}`} isExpanded={expandedId === model._id} />

            <div className="card-overlay">
              <span className="model-name">{model.filename.split('-').slice(1).join('-')}</span>
              <button className="expand-btn" onClick={() => setExpandedId(model._id)}>
                {expandedId === model._id ? 'COLLAPSE' : 'FULL VIEW'}
              </button>
            </div>
            <div className="scanline-card"></div>
          </div>
        ))}
      </div>

      {expandedId && <div className="model-backdrop" onClick={() => setExpandedId(null)}></div>}
    </div>
  );
};

export default Viewer;
