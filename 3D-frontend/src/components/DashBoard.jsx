import { useRef, useState, useEffect } from "react";
import { uploadModel, getModels, deleteModel } from "../api";
import "../styles/DashBoard.css";

const DashBoard = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [models, setModels] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setIsFetching(true);
      const res = await getModels();
      setModels(res.data);
    } catch (error) {
      console.error("Failed to fetch models:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
      // Don't alert here to avoid spamming if 404
      if (error.response?.status !== 404) {
        console.error("Critical error fetching models.");
      } else {
        setModels([]);
      }
    } finally {
      setIsFetching(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
  if (!file) return alert("Select a 3D asset first.");

  const allowedExtension = ".glb";
  if (!file.name.toLowerCase().endsWith(allowedExtension)) {
    return alert("Invalid file type. Only .glb files are supported.");
  }

  const formData = new FormData();
  formData.append("model", file); // ✅ key must match backend

  try {
    setIsLoading(true);
    const res = await uploadModel(formData);
    console.log("Upload response:", res.data);
    console.log("File uploaded successfully:", res.status, res.statusText);
    alert("Success: Model uploaded!");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    fetchModels(); // refresh model list
  } catch (err) {
    console.error("Upload failed:", err);
    console.error("Upload error details:", {
      status: err.response?.status,
      statusText: err.response?.statusText,
      message: err.message,
      url: err.config?.url,
      baseURL: err.config?.baseURL,
      data: err.response?.data,
    });
    alert("Error uploading model. Check console (F12) for details.");
  } finally {
    setIsLoading(false);
  }
};


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this model from the grid?")) return;

    try {
      await deleteModel(id);
      setModels(models.filter(m => m._id !== id));
      alert("Asset purged from system.");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Error: Failed to delete asset.");
    }
  };

  return (
    <div className="dashboard-container">
      <div className={`card ${dragActive ? "drag-active" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}>

        <div className="cyber-corner top-left"></div>
        <div className="cyber-corner top-right"></div>
        <div className="cyber-corner bottom-left"></div>
        <div className="cyber-corner bottom-right"></div>

        <div className="card-header">
          <span className="status-dot"></span>
          <h2>3D model upload</h2>
        </div>

        <div className="upload-zone">
          <p className="upload-hint">Deploy .glb files</p>
          <label htmlFor="file-upload" className="custom-file-upload">
            {file ? file.name : "Select Asset"}
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".glb"
            onChange={(e) => setFile(e.target.files[0])}
            className="file-input-hidden"
            ref={fileInputRef}
          />
        </div>

        {isLoading ? (
          <div className="loading-orbit">
            <div className="orbit-dot"></div>
            <p>Syncing...</p>
          </div>
        ) : (
          <button onClick={handleUpload} className="upload-button neon-glow" disabled={!file}>
            Upload
          </button>
        )}

        {/* Model Management List */}
        <div className="model-management">
          <h3>3D List</h3>
          {isFetching ? (
            <p className="fetching-text">Scanning repository...</p>
          ) : models.length > 0 ? (
            <div className="model-list">
              {models.map(model => (
                <div key={model._id} className="model-list-item">
                  <span className="model-filename">
                    {model.filename.split('-').slice(1).join('-') || model.filename}
                  </span>
                  <button
                    onClick={() => handleDelete(model._id)}
                    className="delete-button"
                  >
                   Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-models-text">No model found.</p>
          )}
        </div>

        <div className="scanline"></div>
      </div>
    </div>
  );
};

export default DashBoard;
