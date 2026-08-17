import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCurrentUser } from "../services/authService";

import "./Dashboard.css";


function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const loadUser = async () => {

            try {

                const result = await getCurrentUser();

                setUser(result.data);

            } catch (error) {

                console.error(
                    "Authentication failed:",
                    error
                );

                localStorage.removeItem("access_token");
                localStorage.removeItem("token_type");

                navigate("/login");

            } finally {

                setLoading(false);

            }
        };


        loadUser();

    }, [navigate]);


    const handleLogout = () => {

        localStorage.removeItem("access_token");
        localStorage.removeItem("token_type");

        navigate("/login");

    };


    if (loading) {

        return (
            <div className="dashboard-loading">
                <div className="loading-orb"></div>
                <p>Loading your career workspace...</p>
            </div>
        );

    }


    return (

        <div className="dashboard-page">

            {/* SIDEBAR */}

            <aside className="dashboard-sidebar">

                <div className="sidebar-logo">

                    <div className="logo-mark">
                        S
                    </div>

                    <div>
                        <h2>SkillSync</h2>
                        <span>AI CAREER INTELLIGENCE</span>
                    </div>

                </div>


                <nav className="sidebar-nav">

                    <p className="nav-label">
                        WORKSPACE
                    </p>

                    <button className="nav-item active">
                        <span>⌂</span>
                        Overview
                    </button>

                    <button className="nav-item">
                        <span>✦</span>
                        Resume AI
                    </button>

                    <button className="nav-item">
                        <span>◇</span>
                        My Skills
                    </button>

                    <button className="nav-item">
                        <span>◈</span>
                        Job Opportunities
                    </button>


                    <p className="nav-label nav-label-profile">
                        ACCOUNT
                    </p>

                    <button className="nav-item">
                        <span>◎</span>
                        Profile
                    </button>

                </nav>


                <div className="sidebar-bottom">

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        <span>↪</span>
                        Logout
                    </button>

                </div>

            </aside>


            {/* MAIN CONTENT */}

            <main className="dashboard-main">

                {/* TOP BAR */}

                <header className="dashboard-header">

                    <div>

                        <p className="dashboard-eyebrow">
                            CAREER WORKSPACE
                        </p>

                        <h1>
                            Welcome back,{" "}
                            <span>
                                {user?.name || "there"}
                            </span>
                        </h1>

                        <p className="dashboard-header-text">
                            Your AI-powered career workspace is ready.
                        </p>

                    </div>


                    <div className="user-avatar">

                        {(user?.name || user?.email || "U")
                            .charAt(0)
                            .toUpperCase()}

                    </div>

                </header>


                {/* STAT CARDS */}

                <section className="dashboard-stats">

                    <div className="stat-card">

                        <div className="stat-icon">
                            ✦
                        </div>

                        <div>

                            <p>Resume Status</p>

                            <h3>
                                {user?.resume
                                    ? "Analyzed"
                                    : "Not Uploaded"}
                            </h3>

                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon">
                            ◇
                        </div>

                        <div>

                            <p>Skills Detected</p>

                            <h3>
                                {user?.skills?.length || 0}
                            </h3>

                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon">
                            ◈
                        </div>

                        <div>

                            <p>Job Matches</p>

                            <h3>
                                —
                            </h3>

                        </div>

                    </div>

                </section>


                {/* MAIN GRID */}

                <section className="dashboard-grid">


                    {/* RESUME CARD */}

                    <div className="dashboard-card resume-card">

                        <div className="card-heading">

                            <div>

                                <p className="card-kicker">
                                    RESUME INTELLIGENCE
                                </p>

                                <h2>
                                    Let AI understand your resume.
                                </h2>

                            </div>

                            <span className="card-symbol">
                                ✦
                            </span>

                        </div>


                        {user?.resume ? (

                            <div className="resume-status">

                                <div className="status-dot"></div>

                                <div>

                                    <strong>
                                        {user.resume}
                                    </strong>

                                    <p>
                                        Your resume is connected
                                        to your SkillSync profile.
                                    </p>

                                </div>

                            </div>

                        ) : (

                            <div className="resume-empty">

                                <p>
                                    Upload your resume to unlock
                                    AI-powered skill extraction,
                                    analysis and job matching.
                                </p>

                                <button>
                                    Analyze Resume →
                                </button>

                            </div>

                        )}

                    </div>


                    {/* SKILLS CARD */}

                    <div className="dashboard-card skills-card">

                        <div className="card-heading">

                            <div>

                                <p className="card-kicker">
                                    YOUR SKILLS
                                </p>

                                <h2>
                                    Skill profile
                                </h2>

                            </div>

                            <span className="card-symbol">
                                ◇
                            </span>

                        </div>


                        {user?.skills?.length > 0 ? (

                            <div className="skill-list">

                                {user.skills
                                    .slice(0, 8)
                                    .map((skill, index) => (

                                        <span
                                            className="skill-pill"
                                            key={index}
                                        >
                                            {skill}
                                        </span>

                                    ))}

                            </div>

                        ) : (

                            <div className="empty-card">

                                <p>
                                    No skills detected yet.
                                </p>

                                <span>
                                    Upload your resume to let
                                    SkillSync AI build your profile.
                                </span>

                            </div>

                        )}

                    </div>


                    {/* JOB MATCHING */}

                    <div className="dashboard-card jobs-card">

                        <div className="card-heading">

                            <div>

                                <p className="card-kicker">
                                    AI MATCHING
                                </p>

                                <h2>
                                    Recommended opportunities
                                </h2>

                            </div>

                            <span className="card-symbol">
                                ◈
                            </span>

                        </div>


                        <div className="jobs-placeholder">

                            <div className="jobs-glow">
                                ✦
                            </div>

                            <h3>
                                Your opportunities will appear here.
                            </h3>

                            <p>
                                SkillSync AI will compare your
                                skills against available jobs
                                and rank the strongest matches.
                            </p>

                            <button>
                                Explore Jobs →
                            </button>

                        </div>

                    </div>


                    {/* CAREER INSIGHT */}

                    <div className="dashboard-card insight-card">

                        <p className="card-kicker">
                            SKILLSYNC INSIGHT
                        </p>

                        <h2>
                            Your career profile is just getting started.
                        </h2>

                        <p>
                            Complete your profile and upload a resume
                            to unlock personalized career intelligence.
                        </p>

                        <div className="insight-line"></div>

                        <span>
                            AI-powered career decisions, simplified.
                        </span>

                    </div>

                </section>

            </main>

        </div>
    );
}


export default Dashboard;