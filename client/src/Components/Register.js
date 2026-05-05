import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchemaValidation } from "../Validations/UserValidations";
import { registerUser } from "../Features/UserSlice";
import logo from "../img/logo.png";

const Register = () => {
  const dispatch       = useDispatch();
  const navigate       = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPass,     setShowPass]     = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(userSchemaValidation),
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      dispatch(registerUser({ name: data.name, email: data.email, password: data.password }));
      alert("Account created! Please sign in.");
      navigate("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth2-page">

      {/* Left Panel */}
      <div className="auth2-left">
        <div className="auth2-left-inner">
          <img src={logo} alt="Ghars" className="auth2-logo" />
          <h1 className="auth2-brand">غرس</h1>
          <p className="auth2-tagline">Join Oman's growing plant community</p>
          <div className="auth2-features">
            <div className="auth2-feature">Tropical plants</div>
            <div className="auth2-feature">Citrus trees</div>
            <div className="auth2-feature">Stone fruits</div>
            <div className="auth2-feature">Rare and exotic</div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth2-right">
        <div className="auth2-card">

          <div className="auth2-header">
            <h2>Create Account</h2>
            <p>Join the Ghars community today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>

            <div className="auth2-field">
              <label>Full Name</label>
              <div className="auth2-input-wrap">
                <input type="text" placeholder="Your full name" {...register("name")} />
              </div>
              {errors.name && <p className="auth2-error">{errors.name.message}</p>}
            </div>

            <div className="auth2-field">
              <label>Email Address</label>
              <div className="auth2-input-wrap">
                <input type="email" placeholder="you@example.com" {...register("email")} />
              </div>
              {errors.email && <p className="auth2-error">{errors.email.message}</p>}
            </div>

            <div className="auth2-field">
              <label>Password</label>
              <div className="auth2-input-wrap">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="At least 4 characters"
                  {...register("password")}
                />
                <button type="button" className="auth2-show-pass" onClick={() => setShowPass(!showPass)}>
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <p className="auth2-error">{errors.password.message}</p>}
            </div>

            <div className="auth2-field">
              <label>Confirm Password</label>
              <div className="auth2-input-wrap">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your password"
                  {...register("confirmPassword")}
                />
                <button type="button" className="auth2-show-pass" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword && <p className="auth2-error">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" className="auth2-btn" disabled={isSubmitting}>
              {isSubmitting ? "Creating account…" : "Create My Account"}
            </button>

          </form>

          <div className="auth2-divider"><span>or</span></div>

          <p className="auth2-switch">
            Already have an account?{" "}
            <Link to="/login">Sign in here</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;