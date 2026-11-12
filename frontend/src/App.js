import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "./components/layout/Navbar.jsx";
import Sidebar from "./components/layout/Sidebar";
import Login from "./components/Login";
import Register from "./components/Register";
import StationList from "./components/stations/StationList";
import {
  StationFormPage
} from "./components/stations/StationForm.jsx";
import HealthJournal from "./components/health/HealthJournal";
import CorrelationInsights from "./components/research/CorrelationInsights";
import Dashboard from "./components/dashboard/DashBoard";
import { ThemeProvider } from "./components/ThemeToggle";
import Icon from "./components/common/Icon";
import { readUser, canManageStations } from "./utils/session";
import { logout } from "./store/slices/authSlice";

import "./App.css";

const modules = [
  [
    "/stations",
    "Air quality stations",
    "Explore monitoring locations and station readings.",
    "station"
  ],
  [
    "/health",
    "Health journal",
    "Record symptoms and review your daily observations.",
    "heart"
  ],
  [
    "/insights",
    "Research insights",
    "Compare environmental data and reported health outcomes.",
    "research"
  ],
  [
    "/trends",
    "AQI trends",
    "Explore available readings across time.",
    "chart"
  ]
];

function Modules() {
  return (
    <>
      <header className="page-heading">
        <span className="eyebrow">WORKSPACE</span>
        <h1>All modules</h1>
        <p>
          Everything you need to explore your environment and health.
        </p>
      </header>

      <div className="module-grid">
        {modules.map(([to, title, description, icon]) => (
          <Link
            className="panel module-card hover-card"
            key={to}
            to={to}
          >
            <span className="icon-tile">
              <Icon name={icon} />
            </span>

            <h2>{title}</h2>
            <p>{description}</p>

            <span className="text-link">
              Open module
              <Icon name="arrow" size={17} />
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}

function NoAccess() {
  return (
    <section className="panel empty-state">
      <Icon name="lock" size={32} />

      <h1>Access restricted</h1>

      <p>
        Your account can view stations. Station changes require an
        authorised officer or administrator.
      </p>

      <Link className="btn secondary" to="/stations">
        View stations
      </Link>
    </section>
  );
}

function Application() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const reduxUser = useSelector((state) => state.auth?.user);
  const user = reduxUser || readUser();

  const authPath = ["/login", "/register"].includes(
    location.pathname
  );
  const authLayout = authPath || !user;

  useEffect(() => {
    const expired = () => {
      dispatch(logout());

      navigate("/login", {
        replace: true,
        state: { expired: true }
      });
    };

    window.addEventListener(
      "aerobreath:session-expired",
      expired
    );

    return () => {
      window.removeEventListener(
        "aerobreath:session-expired",
        expired
      );
    };
  }, [dispatch, navigate]);

  const protectedPage = (element) =>
    user ? element : <Navigate to="/login" replace />;

  return (
    <div
      className={`App app-shell ${
        authLayout ? "auth-shell" : ""
      }`}
    >
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      {!authLayout && <Navbar />}

      <div
        className={
          authLayout ? "auth-layout" : "workspace-layout"
        }
      >
        {!authLayout && <Sidebar />}

        <main
          id="main-content"
          className={
            authLayout ? "auth-main" : "main-content"
          }
          tabIndex={-1}
        >
          <Routes>
            <Route
              path="/"
              element={
                user ? <Dashboard user={user} /> : <Login />
              }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/home"
              element={<Navigate to="/" replace />}
            />

            <Route
              path="/dashboard"
              element={<Navigate to="/" replace />}
            />

            <Route
              path="/stations"
              element={protectedPage(<StationList />)}
            />

            <Route
              path="/admin/stations"
              element={protectedPage(
                canManageStations(user?.role) ? (
                  <StationList />
                ) : (
                  <NoAccess />
                )
              )}
            />

            <Route
              path="/add-station"
              element={protectedPage(
                canManageStations(user?.role) ? (
                  <StationFormPage />
                ) : (
                  <NoAccess />
                )
              )}
            />

            <Route
              path="/health"
              element={protectedPage(<HealthJournal />)}
            />

            <Route
              path="/health-journal"
              element={<Navigate to="/health" replace />}
            />

            <Route
              path="/insights"
              element={protectedPage(<CorrelationInsights />)}
            />

            <Route
              path="/research"
              element={<Navigate to="/insights" replace />}
            />

            <Route
              path="/trends"
              element={protectedPage(
                <Dashboard user={user} trendsOnly />
              )}
            />

            <Route
              path="/modules"
              element={protectedPage(<Modules />)}
            />

            <Route
              path="*"
              element={
                <section className="empty-state">
                  <h1>Page not found</h1>

                  <p>
                    This address is not part of your workspace.
                  </p>

                  <Link to="/" className="btn primary">
                    Return to overview
                  </Link>
                </section>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Application />
    </ThemeProvider>
  );
}