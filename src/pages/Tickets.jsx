import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import api from "../services/api";

const Tickets = () => {
    const { user } = useAuth();

    const [tickets, setTickets] = useState([]);
    const [projects, setProjects] = useState([]);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [project, setProject] = useState("");

    const [myTickets, setMyTickets] = useState(false);

    const fetchTickets = async () => {
        try {
            const params = {};

            if (search) params.search = search;
            if (status) params.status = status;
            if (priority) params.priority = priority;
            if (project) params.project = project;

            if (myTickets && user?.id) {
                params.assignedTo = user.id;
            }
            const response = await api.get("/tickets", {
                params,
            });

            setTickets(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this ticket?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/tickets/${id}`);

            fetchTickets();
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete ticket"
            );
        }
    };


    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response =
                    await api.get("/projects");

                setProjects(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTickets();
        }, 300);

        return () => clearTimeout(timer);
    }, [search, status, priority, project, myTickets]);


    return (
        <div>

            <div className="page-header">

                <div>
                    <h1>Tickets</h1>

                    <p>
                        Manage and track project issues
                    </p>
                </div>

                <Link
                    to="/tickets/create"
                    className="primary-btn"
                >
                    + Create Ticket
                </Link>

            </div>

            <section className="panel">

                <div className="filters">

                    <input
                        type="text"
                        placeholder="Search tickets..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                    >
                        <option value="">All Statuses</option>
                        <option value="todo">Todo</option>
                        <option value="in-progress">
                            In Progress
                        </option>
                        <option value="resolved">
                            Resolved
                        </option>
                        <option value="closed">
                            Closed
                        </option>
                    </select>

                    <select
                        value={priority}
                        onChange={(e) =>
                            setPriority(e.target.value)
                        }
                    >
                        <option value="">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">
                            Medium
                        </option>
                        <option value="high">High</option>
                    </select>

                    <select
                        value={project}
                        onChange={(e) =>
                            setProject(e.target.value)
                        }
                    >
                        <option value="">All Projects</option>

                        {projects.map((p) => (
                            <option
                                key={p._id}
                                value={p._id}
                            >
                                {p.key} - {p.name}
                            </option>
                        ))}

                    </select>

                    <label className="my-tickets">
                        <input
                            type="checkbox"
                            checked={myTickets}
                            onChange={(e) =>
                                setMyTickets(e.target.checked)
                            }
                        />

                        My Tickets
                    </label>
                </div>

                <div className="ticket-list">

                    {tickets.map((ticket) => (
                        <div
                            className="ticket-card"
                            key={ticket._id}
                        >

                            <div className="ticket-main">

                                <div className="ticket-title-row">

                                    <span className="ticket-project">
                                        {ticket.project?.key}
                                    </span>

                                    <h3>{ticket.title}</h3>

                                </div>

                                <p>
                                    {ticket.description}
                                </p>

                                <div className="ticket-meta">

                                    <span>
                                        Status:{" "}
                                        <strong>
                                            {ticket.status}
                                        </strong>
                                    </span>

                                    <span>
                                        Assigned to:{" "}
                                        <strong>
                                            {ticket.assignedTo?.name ||
                                                "Unassigned"}
                                        </strong>
                                    </span>

                                    <span>
                                        Updated by:{" "}
                                        <strong>
                                            {ticket.updatedBy?.name || "N/A"}
                                        </strong>
                                    </span>

                                    <span>
                                        Updated:{" "}
                                        <strong>
                                            {new Date(ticket.updatedAt).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, })}
                                        </strong>
                                    </span>

                                </div>

                            </div>

                            <div className="ticket-side">

                                <span
                                    className={`priority ${ticket.priority}`}
                                >
                                    {ticket.priority}
                                </span>

                                <div className="ticket-actions">

                                    <Link
                                        to={`/tickets/${ticket._id}/edit`}
                                        className="edit-btn"
                                    >
                                        Edit
                                    </Link>

                                    {user?.role === "admin" && (
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(ticket._id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                    
                                </div>

                            </div>
                        </div>
                    ))}

                    {tickets.length === 0 && (
                        <div className="empty-state">
                            No tickets match your filters.
                        </div>
                    )}

                </div>

            </section>

        </div>
    );
};

export default Tickets;