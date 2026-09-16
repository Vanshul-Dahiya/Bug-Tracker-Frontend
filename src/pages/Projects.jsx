import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Projects = () => {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);

  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");

  const [editingProject, setEditingProject] = useState(null);

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

  const resetForm = () => {
    setName("");
    setKey("");
    setDescription("");
    setEditingProject(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      if (editingProject) {
        // Update project
        await api.put(`/projects/${editingProject._id}`, {
          name,
          key,
          description,
        });
      } else {
        // Create project
        await api.post("/projects", {
          name,
          key,
          description,
        });
      }

      resetForm();
      fetchProjects();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to save project"
      );
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);

    setName(project.name);
    setKey(project.key);
    setDescription(project.description || "");

    setError("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/projects/${id}`);

      fetchProjects();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete project"
      );
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Projects</h1>
          <p>Manage your team's projects</p>
        </div>
      </div>

      <div className="content-grid">

        {/* CREATE / EDIT PROJECT */}

        {user?.role === "admin" && (
          <section className="panel">
            <h2>
              {editingProject
                ? "Edit Project"
                : "Create Project"}
            </h2>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

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
                  setKey(
                    e.target.value.toUpperCase()
                  )
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

              <div className="form-actions">

                <button
                  type="submit"
                  className="primary-btn"
                >
                  {editingProject
                    ? "Update Project"
                    : "Create Project"}
                </button>

                {editingProject && (
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}

              </div>

            </form>
          </section>
        )}

        {/* ALL PROJECTS */}

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

                <div className="project-main">

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

                  {/* ADMIN ACTIONS */}

                  {user?.role === "admin" && (
                    <div className="project-actions">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(project)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(project._id)
                        }
                      >
                        Delete
                      </button>

                    </div>
                  )}

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