import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const results = await Promise.allSettled([
                    api.get("/me"),
                    api.get("/jobs/"),
                    api.get("/recommendations/")
                ]);

                // USER
                if (results[0].status === "fulfilled") {

                    setUser(
                        results[0].value.data.data
                    );

                }

                // JOBS
                if (results[1].status === "fulfilled") {

                    setJobs(
                        results[1].value.data.data || []
                    );

                }

                // RECOMMENDATIONS
                if (results[2].status === "fulfilled") {

                    setRecommendations(
                        results[2].value.data.data || []
                    );

                }

            } catch (error) {

                console.error(
                    "Unable to load dashboard:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        loadDashboard();

    }, []);


    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/login");

    };


    if (loading) {

        return (
            <div className="dashboard-loading">

                <div className="loading-content">

                    <div className="loading-orb">
                        ✦
                    </div>

                    <p>
                        Loading your career intelligence...
                    </p>

                </div>

            </div>
        );

    }


    const topRecommendations =
        [...recommendations]
            .sort(
                (a, b) =>
                    b.match_percentage -
                    a.match_percentage
            )
            .slice(0, 3);


    return (

        <div className="dashboard-page">

            {/* NAVBAR */}

            <nav className="dashboard-navbar">

                <div
                    className="dashboard-logo"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    Skill<span>Sync</span> AI
                </div>


                <div className="dashboard-nav-links">

                    <button
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        Dashboard
                    </button>


                    <button
                        onClick={() =>
                            navigate("/profile")
                        }
                    >
                        Profile
                    </button>


                    <button
                        onClick={handleLogout}
                        className="logout-button"
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* MAIN */}

            <main className="dashboard-content">


                {/* HERO */}

                <section className="dashboard-hero">

                    <div>

                        <p className="dashboard-eyebrow">
                            CAREER INTELLIGENCE
                        </p>


                        <h1>

                            Welcome back,

                            <span>
                                {" "}
                                {user?.name || "there"}
                            </span>

                            .

                        </h1>


                        <p>

                            Your AI-powered career workspace.
                            Discover opportunities, understand
                            your skills, and find where you
                            are the strongest match.

                        </p>

                    </div>

                </section>



                {/* STAT CARDS */}

                <section className="dashboard-stats">


                    <div className="stat-card">

                        <div className="stat-icon">
                            ✦
                        </div>

                        <div>

                            <p>
                                Resume
                            </p>

                            <h3>
                                {user?.resume
                                    ? "Uploaded"
                                    : "Not uploaded"}
                            </h3>

                        </div>

                    </div>



                    <div className="stat-card">

                        <div className="stat-icon">
                            ◈
                        </div>

                        <div>

                            <p>
                                Your Skills
                            </p>

                            <h3>
                                {user?.skills?.length || 0}
                            </h3>

                        </div>

                    </div>



                    <div className="stat-card">

                        <div className="stat-icon">
                            ◎
                        </div>

                        <div>

                            <p>
                                Available Jobs
                            </p>

                            <h3>
                                {jobs.length}
                            </h3>

                        </div>

                    </div>

                </section>



                {/* FEATURE GRID */}

                <section className="dashboard-grid">


                    {/* RESUME */}

                    <div className="dashboard-feature resume-feature">

                        <div>

                            <div className="feature-top">

                                <span className="feature-label">
                                    AI RESUME
                                </span>

                                <span className="feature-symbol">
                                    ✦
                                </span>

                            </div>


                            <h2>
                                Resume Intelligence
                            </h2>


                            <p>

                                Upload your resume and let
                                SkillSync AI extract your skills,
                                education, experience, projects,
                                and professional profile.

                            </p>

                        </div>


                        <button
                            onClick={() =>
                                navigate("/resume")
                            }
                        >
                            Analyze Resume →
                        </button>

                    </div>



                    {/* JOBS */}

                    <div className="dashboard-feature jobs-feature">

                        <div className="feature-top">

                            <span className="feature-label">
                                OPPORTUNITIES
                            </span>

                            <span className="feature-symbol">
                                ◈
                            </span>

                        </div>


                        <h2>
                            Explore Jobs
                        </h2>


                        <p>

                            {jobs.length > 0

                                ? `${jobs.length} opportunities are currently available.`
                                : "Discover opportunities that match your career profile."

                            }

                        </p>


                        <button
                            onClick={() =>
                                navigate("/jobs")
                            }
                        >
                            Browse Jobs →
                        </button>

                    </div>



                    {/* RECOMMENDATIONS */}

                    <div className="dashboard-feature recommendation-feature">

                        <div className="feature-top">

                            <span className="feature-label">
                                AI RECOMMENDATIONS
                            </span>

                            <span className="feature-symbol">
                                ⌁
                            </span>

                        </div>


                        <h2>
                            Smart Recommendations
                        </h2>


                        <p>

                            {recommendations.length > 0

                                ? `${recommendations.length} jobs analyzed against your skills.`
                                : "Upload your resume to generate personalized recommendations."

                            }

                        </p>


                        <button
                            onClick={() =>
                                navigate("/recommendations")
                            }
                        >
                            View Recommendations →
                        </button>

                    </div>

                </section>



                {/* TOP MATCHES */}

                <section className="matches-section">


                    <div className="section-heading">

                        <div>

                            <p className="dashboard-eyebrow">
                                AI MATCHING
                            </p>

                            <h2>
                                Your Top Matches
                            </h2>

                        </div>


                        {recommendations.length > 0 && (

                            <button
                                onClick={() =>
                                    navigate("/recommendations")
                                }
                            >
                                View All →
                            </button>

                        )}

                    </div>



                    {topRecommendations.length > 0 ? (

                        <div className="matches-list">

                            {topRecommendations.map(
                                (recommendation, index) => (

                                    <div
                                        className="match-card"
                                        key={`${recommendation.job_title}-${index}`}
                                    >

                                        <div className="match-main">

                                            <div className="match-rank">
                                                0{index + 1}
                                            </div>


                                            <div>

                                                <h3>
                                                    {recommendation.job_title}
                                                </h3>

                                                <p>
                                                    {recommendation.company}
                                                </p>

                                            </div>

                                        </div>


                                        <div className="match-details">

                                            <div className="match-score">

                                                <strong>
                                                    {Math.round(
                                                        recommendation.match_percentage
                                                    )}%
                                                </strong>

                                                <span>
                                                    Match
                                                </span>

                                            </div>


                                            <span
                                                className={`recommendation-badge ${
                                                    recommendation.match_percentage >= 80
                                                        ? "high-match"
                                                        : recommendation.match_percentage >= 50
                                                            ? "medium-match"
                                                            : "low-match"
                                                }`}
                                            >
                                                {recommendation.recommendation}
                                            </span>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="empty-matches">

                            <div className="empty-icon">
                                ⌁
                            </div>

                            <div>

                                <h3>
                                    No recommendations yet
                                </h3>

                                <p>
                                    Upload your resume to let
                                    SkillSync AI analyze your skills
                                    and find suitable opportunities.
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    navigate("/resume")
                                }
                            >
                                Analyze Resume →
                            </button>

                        </div>

                    )}

                </section>



                {/* SKILLS */}

                <section className="skills-section">


                    <div className="section-heading">

                        <div>

                            <p className="dashboard-eyebrow">
                                YOUR PROFILE
                            </p>

                            <h2>
                                Current Skills
                            </h2>

                        </div>


                        <button
                            onClick={() =>
                                navigate("/profile")
                            }
                        >
                            Manage Profile →
                        </button>

                    </div>



                    <div className="skills-container">

                        {user?.skills?.length > 0 ? (

                            user.skills.map(
                                (skill, index) => (

                                    <span
                                        className="skill-pill"
                                        key={index}
                                    >
                                        {skill}
                                    </span>

                                )
                            )

                        ) : (

                            <p className="empty-skills">

                                Upload your resume to automatically
                                discover your technical skills.

                            </p>

                        )}

                    </div>

                </section>

            </main>

        </div>
    );
}


export default Dashboard;