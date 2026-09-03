import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Jobs.css";

function Jobs() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadJobs = async () => {

            try {

                const response = await api.get("/jobs/");

                const loadedJobs = Array.isArray(response.data?.data)
                    ? response.data.data
                    : [];

                setJobs(loadedJobs);

            } catch (err) {

                console.error("Unable to load jobs:", err);

                if (
                    err.response?.status === 401 ||
                    err.response?.status === 403
                ) {
                    localStorage.removeItem("access_token");
                    navigate("/login");
                    return;
                }

                setError(
                    err.response?.data?.detail ||
                    "Unable to load available jobs."
                );

            } finally {

                setLoading(false);

            }
        };

        loadJobs();

    }, [navigate]);


    const handleLogout = () => {

        localStorage.removeItem("access_token");
        localStorage.removeItem("token_type");

        navigate("/login");

    };


    const handleAnalyze = (jobTitle) => {

        navigate(
            `/resume?job=${encodeURIComponent(jobTitle)}`
        );

    };


    if (loading) {

        return (
            <div className="jobs-loading">

                <div className="jobs-loader">

                    <div className="jobs-loader-orb">
                        ✦
                    </div>

                    <p>
                        Loading opportunities...
                    </p>

                </div>

            </div>
        );

    }


    return (
        <div className="jobs-page">


            {/* =========================
                NAVBAR
            ========================= */}

            <nav className="jobs-navbar">

                <div
                    className="jobs-logo"
                    onClick={() => navigate("/dashboard")}
                >
                    SkillSync <span>AI</span>
                </div>


                <div className="jobs-nav-links">

                    <button
                        onClick={() => navigate("/dashboard")}
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/resume")}
                    >
                        Resume
                    </button>

                    <button
                        onClick={() => navigate("/recommendations")}
                    >
                        Recommendations
                    </button>

                    <button
                        onClick={() => navigate("/profile")}
                    >
                        Profile
                    </button>

                    <button
                        className="jobs-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* =========================
                CONTENT
            ========================= */}

            <main className="jobs-content">


                {/* =========================
                    HEADER
                ========================= */}

                <section className="jobs-header">

                    <p className="jobs-eyebrow">
                        OPPORTUNITY DISCOVERY
                    </p>

                    <h1>
                        Explore your next
                        <br />
                        <span>opportunity.</span>
                    </h1>

                    <p>
                        Browse available roles and use SkillSync AI
                        to understand how well your resume matches
                        each opportunity.
                    </p>

                </section>


                {/* =========================
                    ERROR
                ========================= */}

                {error && (

                    <div className="jobs-error">
                        {error}
                    </div>

                )}


                {/* =========================
                    EMPTY STATE
                ========================= */}

                {!error && jobs.length === 0 && (

                    <div className="jobs-empty">

                        <div className="jobs-empty-symbol">
                            ◇
                        </div>

                        <h2>
                            No opportunities available
                        </h2>

                        <p>
                            There are currently no job opportunities
                            available. Check back later for new roles.
                        </p>

                    </div>

                )}


                {/* =========================
                    JOB GRID
                ========================= */}

                {jobs.length > 0 && (

                    <section className="jobs-grid">

                        {jobs.map((job) => (

                            <article
                                className="job-card"
                                key={job.job_id || job._id || job.title}
                            >


                                <div className="job-card-top">

                                    <div className="company-mark">
                                        {job.company
                                            ?.charAt(0)
                                            ?.toUpperCase() || "J"}
                                    </div>

                                    <span className="job-type">
                                        OPEN ROLE
                                    </span>

                                </div>


                                <div className="job-main">

                                    <h2>
                                        {job.title}
                                    </h2>

                                    <p className="job-company">
                                        {job.company}
                                    </p>

                                </div>


                                {job.location && (

                                    <p className="job-location">
                                        📍 {job.location}
                                    </p>

                                )}


                                {job.description && (

                                    <p className="job-description">
                                        {job.description}
                                    </p>

                                )}


                                {Array.isArray(job.skills) &&
                                    job.skills.length > 0 && (

                                    <div className="job-skills">

                                        {job.skills
                                            .slice(0, 8)
                                            .map((skill, index) => (

                                                <span key={`${skill}-${index}`}>
                                                    {skill}
                                                </span>

                                            ))}

                                    </div>

                                )}


                                <button
                                    className="job-action"
                                    onClick={() =>
                                        handleAnalyze(job.title)
                                    }
                                >
                                    Analyze Resume
                                    <span>→</span>
                                </button>


                            </article>

                        ))}

                    </section>

                )}

            </main>

        </div>
    );
}

export default Jobs;