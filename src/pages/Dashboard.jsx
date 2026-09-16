import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketResponse, projectResponse] =
          await Promise.all([
            api.get("/tickets"),
            api.get("/projects"),
          ]);

        setTickets(ticketResponse.data);
        setProjects(projectResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) =>
      ticket.status === "todo" ||
      ticket.status === "in-progress"
  ).length;

  const highPriority = tickets.filter(
    (ticket) => ticket.priority === "high"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) =>
      ticket.status === "resolved" ||
      ticket.status === "closed"
  ).length;

  const todoTickets = tickets.filter(
    (ticket) => ticket.status === "todo"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "in-progress"
  ).length;

  const closedTickets = tickets.filter(
    (ticket) => ticket.status === "closed"
  ).length;

  const mediumPriority = tickets.filter(
    (ticket) => ticket.priority === "medium"
  ).length;

  const lowPriority = tickets.filter(
    (ticket) => ticket.priority === "low"
  ).length;

  return (
    <div>

      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Overview of your projects and tickets
          </p>
        </div>

        <Link
          to="/tickets/create"
          className="primary-btn"
        >
          + Create Ticket
        </Link>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <span>Total Tickets</span>
          <strong>{totalTickets}</strong>
        </div>

        <div className="stat-card">
          <span>Open Tickets</span>
          <strong>{openTickets}</strong>
        </div>

        <div className="stat-card">
          <span>High Priority</span>
          <strong>{highPriority}</strong>
        </div>

        <div className="stat-card">
          <span>Resolved</span>
          <strong>{resolvedTickets}</strong>
        </div>

      </div>

      <div className="dashboard-grid">

        <section className="panel">

          <div className="panel-header">
            <h2>Recent Tickets</h2>

            <Link to="/tickets">
              View all
            </Link>
          </div>

          {tickets.slice(0, 5).map((ticket) => (
            <div
              className="ticket-row"
              key={ticket._id}
            >

              <div>
                <strong>{ticket.title}</strong>

                <span>
                  {ticket.project?.key || "PROJECT"}
                </span>
              </div>

              <span
                className={`priority ${ticket.priority}`}
              >
                {ticket.priority}
              </span>

            </div>
          ))}

          {tickets.length === 0 && (
            <div className="empty-state">
              No tickets yet.
            </div>
          )}

        </section>

        <section className="panel">

          <div className="panel-header">
            <h2>Projects</h2>

            <Link to="/projects">
              View all
            </Link>
          </div>

          {projects.slice(0, 5).map((project) => (
            <div
              className="project-row"
              key={project._id}
            >
              <div className="project-key">
                {project.key}
              </div>

              <div className="project-info">
                <strong>{project.name}</strong>

                <span>
                  {project.description ||
                    "No description"}
                </span>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="empty-state">
              No projects yet.
            </div>
          )}

        </section>

      </div>


      <div className="dashboard-stats-panels">

        <section className="panel">

          <div className="panel-header">
            <h2>Status Overview</h2>
          </div>

          <div className="overview-list">

            <div className="overview-item">
              <span>Todo</span>
              <strong>{todoTickets}</strong>
            </div>

            <div className="overview-item">
              <span>In Progress</span>
              <strong>{inProgressTickets}</strong>
            </div>

            <div className="overview-item">
              <span>Resolved</span>
              <strong>{tickets.filter(
                (ticket) => ticket.status === "resolved"
              ).length}</strong>
            </div>

            <div className="overview-item">
              <span>Closed</span>
              <strong>{closedTickets}</strong>
            </div>

          </div>

        </section>


        <section className="panel">

          <div className="panel-header">
            <h2>Priority Overview</h2>
          </div>

          <div className="overview-list">

            <div className="overview-item">
              <span>High</span>
              <strong>{highPriority}</strong>
            </div>

            <div className="overview-item">
              <span>Medium</span>
              <strong>{mediumPriority}</strong>
            </div>

            <div className="overview-item">
              <span>Low</span>
              <strong>{lowPriority}</strong>
            </div>

          </div>

        </section>

      </div>
    </div>
  );
};

export default Dashboard;