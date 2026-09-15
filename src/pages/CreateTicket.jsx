import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

const CreateTicket = () => {
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] =
        useState("");

    const [project, setProject] = useState("");
    const [priority, setPriority] = useState("medium");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [assignedTo, setAssignedTo] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsResponse, usersResponse] =
                    await Promise.all([
                        api.get("/projects"),
                        api.get("/users"),
                    ]);

                setProjects(projectsResponse.data);
                setUsers(usersResponse.data);

                if (projectsResponse.data.length > 0) {
                    setProject(projectsResponse.data[0]._id);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await api.post("/tickets", {
                title,
                description,
                project,
                priority,  
                assignedTo: assignedTo || null,
            });

            navigate("/tickets");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create ticket"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>

            <div className="page-header">

                <div>
                    <h1>Create Ticket</h1>

                    <p>
                        Report a new issue
                    </p>
                </div>

            </div>

            <section className="panel form-panel">

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <label>Title</label>

                    <input
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        placeholder="Describe the issue briefly"
                        required
                    />

                    <label>Description</label>

                    <textarea
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        placeholder="Describe the issue in detail..."
                        rows={7}
                        required
                    />

                    <div className="form-row">

                        <div>
                            <label>Project</label>

                            <select
                                value={project}
                                onChange={(e) =>
                                    setProject(e.target.value)
                                }
                                required
                            >

                                <option value="">
                                    Select project
                                </option>

                                {projects.map((p) => (
                                    <option
                                        key={p._id}
                                        value={p._id}
                                    >
                                        {p.key} - {p.name}
                                    </option>
                                ))}

                            </select>

                        </div>

                        <div>
                            <label>Priority</label>

                            <select
                                value={priority}
                                onChange={(e) =>
                                    setPriority(e.target.value)
                                }
                            >
                                <option value="low">
                                    Low
                                </option>

                                <option value="medium">
                                    Medium
                                </option>

                                <option value="high">
                                    High
                                </option>

                            </select>

                        </div>

                        <div>
                            <label>Assign To</label>

                            <select
                                value={assignedTo}
                                onChange={(e) =>
                                    setAssignedTo(e.target.value)
                                }
                            >
                                <option value="">
                                    Unassigned
                                </option>

                                {users.map((user) => (
                                    <option
                                        key={user._id}
                                        value={user._id}
                                    >
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>


                    </div>

                    <div className="form-actions">

                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={() =>
                                navigate("/tickets")
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating..."
                                : "Create Ticket"}
                        </button>

                    </div>

                </form>

            </section>

        </div>
    );
};

export default CreateTicket;