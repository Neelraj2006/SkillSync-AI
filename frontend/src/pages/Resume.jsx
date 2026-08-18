import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { uploadResume } from "../services/resumeService";
import "./Resume.css";

function Resume() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState("");

    const [file, setFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);

    const [loadingJobs, setLoadingJobs] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);

    const [error, setError] = useState("");


    /* =========================
       LOAD JOBS
    ========================= */

    useEffect(() => {

        const loadJobs = async () => {

            try {

                const response = await api.get("/jobs/");

                setJobs(
                    response.data.data || []
                );

            } catch (error) {

                console.error(
                    "Unable to load jobs:",
                    error
                );

                setError(
                    "Unable to load available jobs."
                );

            } finally {

                setLoadingJobs(false);

            }
        };

        loadJobs();

    }, []);


    /* =========================
       FILE SELECTION
    ========================= */

    const handleFileChange = (event) => {

        const selectedFile =
            event.target.files[0];

        setError("");
        setAnalysis(null);

        if (!selectedFile) {
            setFile(null);
            return;
        }

        if (
            selectedFile.type !==
            "application/pdf"
        ) {

            setError(
                "Please upload a PDF resume."
            );

            setFile(null);

            return;
        }

        setFile(selectedFile);

    };


    /* =========================
       ANALYZE RESUME
    ========================= */

    const handleAnalyze = async (event) => {

        event.preventDefault();

        setError("");
        setAnalysis(null);


        if (!file) {

            setError(
                "Please select your resume first."
            );

            return;
        }


        if (!selectedJob) {

            setError(
                "Please select a job to analyze your match."
            );

            return;
        }


        setAnalyzing(true);


        try {

            const result = await uploadResume(
                file,
                selectedJob
            );

            setAnalysis(result);

        } catch (error) {

            console.error(
                "Resume analysis failed:",
                error
            );

            setError(
                error.response?.data?.detail ||
                error.response?.data?.error ||
                "Resume analysis failed. Please try again."
            );

        } finally {

            setAnalyzing(false);
        }

    };


    /* =========================
       LOGOUT
    ========================= */

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/login");

    };


    return (

        <div className="resume-page">


            {/* NAVBAR */}

            <nav className="resume-navbar">

                <div
                    className="resume-logo"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    Skill<span>Sync</span> AI
                </div>


                <div className="resume-nav-links">

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
                        className="resume-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>



            {/* CONTENT */}

            <main className="resume-content">


                {/* HEADER */}

                <section className="resume-header">

                    <p className="resume-eyebrow">
                        AI RESUME INTELLIGENCE
                    </p>


                    <h1>
                        Understand your
                        <span> career profile.</span>
                    </h1>


                    <p>

                        Upload your resume and let
                        SkillSync AI extract your skills,
                        experience, education, projects,
                        and career strengths.

                    </p>

                </section>



                {/* UPLOAD CARD */}

                <section className="resume-upload-card">


                    <div className="resume-card-heading">

                        <div>

                            <p className="resume-card-label">
                                STEP 01
                            </p>

                            <h2>
                                Upload your resume
                            </h2>

                            <p>
                                PDF files only
                            </p>

                        </div>

                        <div className="resume-card-icon">
                            ✦
                        </div>

                    </div>



                    <form
                        onSubmit={handleAnalyze}
                        className="resume-form"
                    >


                        {/* FILE */}

                        <label className="resume-dropzone">

                            <input
                                type="file"
                                accept=".pdf"
                                onChange={
                                    handleFileChange
                                }
                            />


                            <div className="upload-icon">
                                ↑
                            </div>


                            <strong>
                                {file
                                    ? file.name
                                    : "Choose your resume"}
                            </strong>


                            <span>
                                {file
                                    ? `${(
                                        file.size /
                                        1024
                                    ).toFixed(1)} KB`
                                    : "Click to browse PDF files"}
                            </span>

                        </label>



                        {/* JOB */}

                        <div className="resume-field">

                            <label>
                                Analyze against
                            </label>


                            <select
                                value={selectedJob}
                                onChange={(event) =>
                                    setSelectedJob(
                                        event.target.value
                                    )
                                }
                                disabled={loadingJobs}
                            >

                                <option value="">
                                    {loadingJobs
                                        ? "Loading jobs..."
                                        : "Select a job"}
                                </option>


                                {jobs.map(
                                    (job) => (

                                        <option
                                            key={job._id}
                                            value={job.title}
                                        >
                                            {job.title} —{" "}
                                            {job.company}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>



                        {/* ERROR */}

                        {error && (

                            <div className="resume-error">
                                {error}
                            </div>

                        )}



                        {/* BUTTON */}

                        <button
                            type="submit"
                            className="analyze-button"
                            disabled={
                                analyzing ||
                                !file ||
                                !selectedJob
                            }
                        >

                            {analyzing
                                ? "Analyzing with AI..."
                                : "Analyze Resume →"}

                        </button>


                    </form>

                </section>



                {/* RESULTS */}

                {analysis && (

                    <section className="resume-results">


                        {/* MATCH */}

                        <div className="match-result-card">

                            <div>

                                <p className="resume-card-label">
                                    AI MATCH
                                </p>

                                <h2>
                                    {analysis.job?.title}
                                </h2>

                                <p>
                                    {analysis.job?.company}
                                </p>

                            </div>


                            <div className="match-percentage">

                                {Math.round(
                                    analysis.skill_match
                                        ?.match_percentage || 0
                                )}
                                <span>%</span>

                            </div>

                        </div>



                        {/* SKILLS */}

                        <div className="analysis-card">

                            <div className="analysis-card-heading">

                                <p className="resume-card-label">
                                    EXTRACTED PROFILE
                                </p>

                                <h2>
                                    Skills
                                </h2>

                            </div>


                            <div className="analysis-skills">

                                {analysis.resume_analysis
                                    ?.skills?.length > 0 ? (

                                    analysis.resume_analysis.skills.map(
                                        (skill, index) => (

                                            <span
                                                key={index}
                                                className="analysis-skill"
                                            >
                                                {skill}
                                            </span>

                                        )
                                    )

                                ) : (

                                    <p>
                                        No technical skills
                                        were detected.
                                    </p>

                                )}

                            </div>

                        </div>



                        {/* MATCHED + MISSING */}

                        <div className="analysis-two-column">


                            <div className="analysis-card">

                                <p className="resume-card-label">
                                    MATCHED
                                </p>

                                <h2>
                                    Skills you have
                                </h2>


                                <div className="analysis-skills">

                                    {analysis.skill_match
                                        ?.matched_skills
                                        ?.length > 0 ? (

                                        analysis.skill_match
                                            .matched_skills
                                            .map(
                                                (
                                                    skill,
                                                    index
                                                ) => (

                                                    <span
                                                        key={index}
                                                        className="matched-skill"
                                                    >
                                                        ✓ {skill}
                                                    </span>

                                                )
                                            )

                                    ) : (

                                        <p>
                                            No matched skills yet.
                                        </p>

                                    )}

                                </div>

                            </div>



                            <div className="analysis-card">

                                <p className="resume-card-label">
                                    SKILL GAP
                                </p>

                                <h2>
                                    Skills to improve
                                </h2>


                                <div className="analysis-skills">

                                    {analysis.skill_match
                                        ?.missing_skills
                                        ?.length > 0 ? (

                                        analysis.skill_match
                                            .missing_skills
                                            .map(
                                                (
                                                    skill,
                                                    index
                                                ) => (

                                                    <span
                                                        key={index}
                                                        className="missing-skill"
                                                    >
                                                        + {skill}
                                                    </span>

                                                )
                                            )

                                    ) : (

                                        <p>
                                            Excellent match.
                                            No major skill gaps.
                                        </p>

                                    )}

                                </div>

                            </div>


                        </div>



                        {/* SUMMARY */}

                        <div className="analysis-card">

                            <p className="resume-card-label">
                                AI PROFILE
                            </p>

                            <h2>
                                Professional Summary
                            </h2>


                            <p className="resume-summary">

                                {analysis.resume_analysis
                                    ?.summary ||
                                    "No summary generated."}

                            </p>

                        </div>



                        {/* EDUCATION / EXPERIENCE / PROJECTS */}

                        <div className="analysis-two-column">


                            <div className="analysis-card">

                                <p className="resume-card-label">
                                    EDUCATION
                                </p>

                                <h2>
                                    Education
                                </h2>


                                {analysis.resume_analysis
                                    ?.education?.length > 0 ? (

                                    <ul>

                                        {analysis.resume_analysis
                                            .education
                                            .map(
                                                (
                                                    item,
                                                    index
                                                ) => (

                                                    <li
                                                        key={index}
                                                    >
                                                        {typeof item ===
                                                            "string"
                                                            ? item
                                                            : JSON.stringify(
                                                                item
                                                            )}
                                                    </li>

                                                )
                                            )}

                                    </ul>

                                ) : (

                                    <p>
                                        No education details detected.
                                    </p>

                                )}

                            </div>



                            <div className="analysis-card">

                                <p className="resume-card-label">
                                    EXPERIENCE
                                </p>

                                <h2>
                                    Experience
                                </h2>


                                {analysis.resume_analysis
                                    ?.experience?.length > 0 ? (

                                    <ul>

                                        {analysis.resume_analysis
                                            .experience
                                            .map(
                                                (
                                                    item,
                                                    index
                                                ) => (

                                                    <li
                                                        key={index}
                                                    >
                                                        {typeof item ===
                                                            "string"
                                                            ? item
                                                            : JSON.stringify(
                                                                item
                                                            )}
                                                    </li>

                                                )
                                            )}

                                    </ul>

                                ) : (

                                    <p>
                                        No experience details detected.
                                    </p>

                                )}

                            </div>

                        </div>



                        <div className="analysis-card">

                            <p className="resume-card-label">
                                PROJECTS
                            </p>

                            <h2>
                                Projects
                            </h2>


                            {analysis.resume_analysis
                                ?.projects?.length > 0 ? (

                                <ul>

                                    {analysis.resume_analysis
                                        .projects
                                        .map(
                                            (
                                                item,
                                                index
                                            ) => (

                                                <li
                                                    key={index}
                                                >
                                                    {typeof item ===
                                                        "string"
                                                        ? item
                                                        : JSON.stringify(
                                                            item
                                                        )}
                                                </li>

                                            )
                                        )}

                                </ul>

                            ) : (

                                <p>
                                    No projects detected.
                                </p>

                            )}

                        </div>


                    </section>

                )}

            </main>

        </div>
    );
}


export default Resume;