import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import api from "../services/api";

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);

  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] =
    useState("");

  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");

      setProjects(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await api.post("/projects", {
        name,
        key,
        description,
      });

      setName("");
      setKey("");
      setDescription("");

      fetchProjects();
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to create project"
      );
    }
  };

  return (
    <div>

      <div className="page-header">
        <div>
          <h1>Projects</h1>
          <p>
            Manage your team's projects
          </p>
        </div>
      </div>

      <div className="content-grid">

        <section className="panel">

          <h2>Create Project</h2>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateProject}>

            <label>Project Name</label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Bug Tracker"
              required
            />

            <label>Project Key</label>

            <input
              value={key}
              onChange={(e) =>
                setKey(e.target.value.toUpperCase())
              }
              placeholder="BUG"
              maxLength={10}
              required
            />

            <label>Description</label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Project description"
              rows={4}
            />

            {user?.role === "admin" && (
              <button
                type="submit"
                className="primary-btn"
              >
                Create Project
              </button>
            )}

          </form>

        </section>

        <section className="panel">

          <div className="panel-header">
            <h2>All Projects</h2>

            <span>
              {projects.length} projects
            </span>
          </div>

          <div className="project-list">

            {projects.map((project) => (
              <div
                className="project-card"
                key={project._id}
              >

                <div className="project-key">
                  {project.key}
                </div>

                <div>
                  <h3>{project.name}</h3>

                  <p>
                    {project.description ||
                      "No description"}
                  </p>

                  <small>
                    Created by{" "}
                    {project.createdBy?.name ||
                      "Unknown"}
                  </small>
                </div>

              </div>
            ))}

            {projects.length === 0 && (
              <div className="empty-state">
                No projects found.
              </div>
            )}

          </div>

        </section>

      </div>

    </div>
  );
};

export default Projects;