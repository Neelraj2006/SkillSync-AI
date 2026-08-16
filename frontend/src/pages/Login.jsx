import { useState } from "react";
import { loginUser } from "../services/authService";
import "./Login.css";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {

            const result = await loginUser({
                email,
                password
            });

            setMessage(
                result.message || "Login successful"
            );

        } catch (error) {

            setMessage(
                error.response?.data?.detail ||
                "Unable to login. Please check your credentials."
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            {/* LEFT BRANDING */}

            <section className="login-brand">

                <div className="brand-badge">
                    AI-POWERED CAREER INTELLIGENCE
                </div>

                <h1 className="brand-title">
                    Find the right skills.
                    <br />
                    Find the right <span>career.</span>
                </h1>

                <p className="brand-description">
                    SkillSync AI analyzes your resume, understands
                    your skills, and connects you with opportunities
                    that actually match your profile.
                </p>

                <div className="feature-list">

                    <div className="feature">
                        ✦ Resume Intelligence
                    </div>

                    <div className="feature">
                        ◈ AI Skill Matching
                    </div>

                    <div className="feature">
                        ⌁ Smart Job Recommendations
                    </div>

                </div>

            </section>


            {/* LOGIN */}

            <section className="login-section">

                <div className="login-card">

                    <h2>
                        Welcome back
                    </h2>

                    <p className="login-subtitle">
                        Sign in to continue to SkillSync AI.
                    </p>

                    <form onSubmit={handleLogin}>

                        <div className="form-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="you@example.com"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                                required
                            />

                        </div>


                        <button
                            className="login-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign In"
                            }
                        </button>

                    </form>


                    {message && (
                        <div className="login-message">
                            {message}
                        </div>
                    )}


                    <div className="login-footer">
                        Your career journey, powered by AI.
                    </div>

                </div>

            </section>

        </div>
    );
}

export default Login;