import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getJobRecommendations } from "../services/recommendationService";

import "./Recommendations.css";


function Recommendations() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    /* =========================
       LOAD RECOMMENDATIONS
    ========================= */

    useEffect(() => {

        const loadRecommendations = async () => {

            try {

                setLoading(true);
                setError("");

                const result =
                    await getJobRecommendations();


                setJobs(
                    Array.isArray(result?.data)
                        ? result.data
                        : []
                );


            } catch (error) {

                console.error(
                    "Failed to load recommendations:",
                    error
                );


                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {

                    setError(
                        "Your session has expired. Please login again."
                    );

                } else {

                    setError(
                        error.response?.data?.detail ||
                        error.response?.data?.message ||
                        "Unable to load recommendations."
                    );

                }

            } finally {

                setLoading(false);

            }

        };


        loadRecommendations();

    }, []);


    /* =========================
       LOGOUT
    ========================= */

    const handleLogout = () => {

        localStorage.removeItem("access_token");

        navigate("/login");

    };


    /* =========================
       LOADING
    ========================= */

    if (loading) {

        return (

            <div className="recommendations-loading">

                <div className="recommendations-loader">

                    <div className="loader-orb"></div>

                    <p>
                        Finding your best opportunities...
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div className="recommendations-page">


            {/* =========================
               NAVBAR
            ========================= */}

            <nav className="recommendations-navbar">

                <div
                    className="recommendations-logo"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >

                    Skill<span>Sync</span> AI

                </div>


                <div className="recommendations-nav-links">

                    <button
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        Dashboard
                    </button>


                    <button
                        onClick={() =>
                            navigate("/resume")
                        }
                    >
                        Resume
                    </button>


                    <button
                        onClick={() =>
                            navigate("/profile")
                        }
                    >
                        Profile
                    </button>


                    <button
                        className="recommendations-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>



            {/* =========================
               CONTENT
            ========================= */}

            <main className="recommendations-content">


                {/* HEADER */}

                <section className="recommendations-header">

                    <p className="recommendations-eyebrow">
                        AI CAREER MATCHING
                    </p>


                    <h1>
                        Opportunities built
                        <span> for you.</span>
                    </h1>


                    <p>
                        SkillSync AI compares your skills
                        against available opportunities
                        and ranks the roles that best match
                        your profile.
                    </p>

                </section>



                {/* ERROR */}

                {error && (

                    <div className="recommendations-error">

                        {error}

                    </div>

                )}



                {/* =========================
                   EMPTY STATE
                ========================= */}

                {!error && jobs.length === 0 && (

                    <section className="recommendations-empty">

                        <div className="empty-symbol">
                            ◇
                        </div>


                        <h2>
                            No recommendations yet
                        </h2>


                        <p>
                            Add your skills or analyze your
                            resume first. SkillSync AI will
                            then compare your profile with
                            available jobs.
                        </p>


                        <button
                            onClick={() =>
                                navigate("/resume")
                            }
                        >
                            Analyze My Resume →
                        </button>

                    </section>

                )}



                {/* =========================
                   JOB GRID
                ========================= */}

                {jobs.length > 0 && (

                    <section className="recommendations-grid">

                        {jobs.map((job) => {

                            const percentage =
                                Number(
                                    job.match_percentage
                                ) || 0;


                            return (

                                <article
                                    className="recommendation-card"
                                    key={job.job_id}
                                >


                                    {/* CARD TOP */}

                                    <div className="recommendation-card-top">

                                        <div className="company-mark">

                                            {job.company
                                                ?.charAt(0)
                                                ?.toUpperCase() ||
                                                "J"}

                                        </div>


                                        <span
                                            className={`match-badge ${percentage >= 80
                                                ? "high-match"
                                                : percentage >= 50
                                                    ? "medium-match"
                                                    : "low-match"
                                                }`}
                                        >

                                            {percentage}%

                                            <span>
                                                {" "}match
                                            </span>

                                        </span>

                                    </div>



                                    {/* TITLE */}

                                    <h2>
                                        {job.job_title}
                                    </h2>


                                    <p className="recommendation-company">

                                        {job.company}

                                    </p>



                                    {/* RECOMMENDATION */}

                                    <div className="recommendation-status">

                                        {job.recommendation}

                                    </div>



                                    {/* MATCHED SKILLS */}

                                    {job.matched_skills?.length > 0 && (

                                        <div className="skill-group">

                                            <p className="skill-group-title">
                                                Matched Skills
                                            </p>


                                            <div className="recommendation-skills matched-skills">

                                                {job.matched_skills.map(
                                                    (skill, index) => (

                                                        <span
                                                            key={index}
                                                        >
                                                            {skill}
                                                        </span>

                                                    )
                                                )}

                                            </div>

                                        </div>

                                    )}



                                    {/* MISSING SKILLS */}

                                    {job.missing_skills?.length > 0 && (

                                        <div className="skill-group">

                                            <p className="skill-group-title">
                                                Skills to Improve
                                            </p>


                                            <div className="recommendation-skills missing-skills">

                                                {job.missing_skills.map(
                                                    (skill, index) => (

                                                        <span
                                                            key={index}
                                                        >
                                                            {skill}
                                                        </span>

                                                    )
                                                )}

                                            </div>

                                        </div>

                                    )}



                                    {/* REQUIRED SKILLS */}

                                    {job.required_skills?.length > 0 && (

                                        <div className="skill-group">

                                            <p className="skill-group-title">
                                                Required Skills
                                            </p>


                                            <div className="recommendation-skills">

                                                {job.required_skills
                                                    .slice(0, 6)
                                                    .map(
                                                        (
                                                            skill,
                                                            index
                                                        ) => (

                                                            <span
                                                                key={
                                                                    index
                                                                }
                                                            >
                                                                {skill}
                                                            </span>

                                                        )
                                                    )}

                                            </div>

                                        </div>

                                    )}



                                    {/* ACTION */}

                                    <button
                                        className="recommendation-action"
                                        onClick={() =>
                                            navigate(
                                                `/resume?job=${encodeURIComponent(job.job_title)}`
                                            )
                                        }
                                    >
                                        View My Resume Match →
                                    </button>


                                </article>

                            );

                        })}

                    </section>

                )}

            </main>

        </div>

    );

}


export default Recommendations;