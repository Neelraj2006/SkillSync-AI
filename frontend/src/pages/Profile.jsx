import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";

import "./Profile.css";


function Profile() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [skill, setSkill] = useState("");

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    const loadProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/me");

            setUser(
                response.data.data
            );

        } catch (error) {

            console.error(
                "Unable to load profile:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Unable to load your profile."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        loadProfile();

    }, []);


    const handleAddSkill = async (e) => {

        e.preventDefault();

        if (!skill.trim()) {
            return;
        }

        try {

            setActionLoading(true);
            setMessage("");
            setError("");

            await api.post(
                "/me/skills",
                null,
                {
                    params: {
                        skill: skill.trim()
                    }
                }
            );

            setMessage(
                "Skill added successfully."
            );

            setSkill("");

            await loadProfile();

        } catch (error) {

            console.error(
                "Unable to add skill:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.detail ||
                "Unable to add skill."
            );

        } finally {

            setActionLoading(false);
        }
    };


    const handleRemoveSkill = async (skillToRemove) => {

        try {

            setActionLoading(true);
            setMessage("");
            setError("");

            await api.delete(
                `/me/skills/${encodeURIComponent(skillToRemove)}`
            );

            setMessage(
                "Skill removed successfully."
            );

            await loadProfile();

        } catch (error) {

            console.error(
                "Unable to remove skill:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.detail ||
                "Unable to remove skill."
            );

        } finally {

            setActionLoading(false);
        }
    };


    const handleLogout = () => {

        localStorage.removeItem("access_token");
        localStorage.removeItem("token_type");

        navigate("/login");
    };


    if (loading) {

        return (
            <div className="profile-loading">

                <div className="profile-loading-orb">
                    ✦
                </div>

                <p>
                    Loading your profile...
                </p>

            </div>
        );
    }


    return (
        <div className="profile-page">

            {/* NAVBAR */}

            <nav className="profile-navbar">

                <div
                    className="profile-logo"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    Skill<span>Sync</span> AI
                </div>


                <div className="profile-nav-links">

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
                            navigate("/recommendations")
                        }
                    >
                        Recommendations
                    </button>

                    <button
                        onClick={handleLogout}
                        className="profile-logout"
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* CONTENT */}

            <main className="profile-content">

                {/* HERO */}

                <section className="profile-hero">

                    <p className="profile-eyebrow">
                        YOUR CAREER PROFILE
                    </p>

                    <h1>
                        Know your
                        <span> strengths.</span>
                    </h1>

                    <p>
                        Manage your SkillSync AI profile,
                        review your current skills, and keep
                        your career information up to date.
                    </p>

                </section>


                {/* MESSAGES */}

                {message && (

                    <div className="profile-success">
                        {message}
                    </div>

                )}


                {error && (

                    <div className="profile-error">
                        {error}
                    </div>

                )}


                {/* PROFILE GRID */}

                <section className="profile-grid">

                    {/* BASIC INFO */}

                    <div className="profile-card profile-info-card">

                        <div className="profile-card-heading">

                            <div className="profile-card-icon">
                                ◎
                            </div>

                            <div>

                                <p>
                                    ACCOUNT
                                </p>

                                <h2>
                                    Personal Information
                                </h2>

                            </div>

                        </div>


                        <div className="profile-info-list">

                            <div className="profile-info-item">

                                <span>
                                    Name
                                </span>

                                <strong>
                                    {user?.name || "Not available"}
                                </strong>

                            </div>


                            <div className="profile-info-item">

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {user?.email || "Not available"}
                                </strong>

                            </div>


                            <div className="profile-info-item">

                                <span>
                                    Resume
                                </span>

                                <strong>
                                    {user?.resume
                                        ? user.resume
                                        : "No resume uploaded"}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* SKILLS */}

                    <div className="profile-card profile-skills-card">

                        <div className="profile-card-heading">

                            <div className="profile-card-icon">
                                ◈
                            </div>

                            <div>

                                <p>
                                    SKILL PROFILE
                                </p>

                                <h2>
                                    Your Skills
                                </h2>

                            </div>

                        </div>


                        <form
                            className="add-skill-form"
                            onSubmit={handleAddSkill}
                        >

                            <input
                                type="text"
                                value={skill}
                                onChange={(e) =>
                                    setSkill(e.target.value)
                                }
                                placeholder="Add a skill..."
                            />

                            <button
                                type="submit"
                                disabled={
                                    actionLoading ||
                                    !skill.trim()
                                }
                            >
                                Add
                            </button>

                        </form>


                        <div className="profile-skills-container">

                            {user?.skills?.length > 0 ? (

                                user.skills.map(
                                    (currentSkill) => (

                                        <div
                                            className="profile-skill-pill"
                                            key={currentSkill}
                                        >

                                            <span>
                                                {currentSkill}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveSkill(
                                                        currentSkill
                                                    )
                                                }
                                                disabled={
                                                    actionLoading
                                                }
                                                aria-label={
                                                    `Remove ${currentSkill}`
                                                }
                                            >
                                                ×
                                            </button>

                                        </div>

                                    )
                                )

                            ) : (

                                <p className="profile-empty-skills">
                                    No skills added yet.
                                </p>

                            )}

                        </div>

                    </div>


                    {/* RESUME */}

                    <div className="profile-card profile-resume-card">

                        <div>

                            <div className="profile-card-heading">

                                <div className="profile-card-icon">
                                    ✦
                                </div>

                                <div>

                                    <p>
                                        RESUME INTELLIGENCE
                                    </p>

                                    <h2>
                                        Build your profile
                                    </h2>

                                </div>

                            </div>


                            <p className="profile-resume-description">

                                Upload your latest resume and let
                                SkillSync AI automatically discover
                                your technical skills and career
                                information.

                            </p>

                        </div>


                        <button
                            className="profile-resume-button"
                            onClick={() =>
                                navigate("/resume")
                            }
                        >
                            Analyze Resume →
                        </button>

                    </div>

                </section>

            </main>

        </div>
    );
}


export default Profile;