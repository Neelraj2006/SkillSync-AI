import { useState } from "react";
import { registerUser } from "../services/authService";
import "./Register.css";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {

        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {

            const result = await registerUser({
                name,
                email,
                password
            });

            setMessage(
                result.message || "Account created successfully."
            );

        } catch (error) {

            setMessage(
                error.response?.data?.detail ||
                "Unable to create your account."
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            <section className="register-brand">

                <div className="register-badge">
                    START YOUR CAREER JOURNEY
                </div>

                <h1 className="register-title">
                    Build your
                    <br />
                    <span>career profile.</span>
                </h1>

                <p className="register-description">
                    Create your SkillSync AI profile and let AI
                    understand your skills, experience and career goals.
                </p>

                <div className="register-points">

                    <div>
                        <span>01</span>
                        Create your profile
                    </div>

                    <div>
                        <span>02</span>
                        Upload your resume
                    </div>

                    <div>
                        <span>03</span>
                        Discover matching opportunities
                    </div>

                </div>

            </section>


            <section className="register-section">

                <div className="register-card">

                    <h2>
                        Create account
                    </h2>

                    <p className="register-subtitle">
                        Join SkillSync AI and start building your future.
                    </p>

                    <form onSubmit={handleRegister}>

                        <div className="register-form-group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                placeholder="Enter your full name"
                                required
                            />

                        </div>


                        <div className="register-form-group">

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


                        <div className="register-form-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Create a secure password"
                                required
                            />

                        </div>


                        <button
                            className="register-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating account..."
                                : "Create Account"
                            }
                        </button>

                    </form>


                    {message && (
                        <div className="register-message">
                            {message}
                        </div>
                    )}

                    <div className="register-footer">
                        Your career journey starts here.
                    </div>

                </div>

            </section>

        </div>
    );
}

export default Register;