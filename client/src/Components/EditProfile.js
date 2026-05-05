import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../Features/UserSlice";
import * as ENV from "../config";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user     = useSelector((state) => state.users.user);

  const [userName,        setUserName]        = useState(user.name || "");
  const [pwd,             setPwd]             = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic,      setProfilePic]      = useState(user.profilePic);
  const [preview,         setPreview]         = useState(
    user.profilePic ? `${ENV.SERVER_URL}/uploads/${user.profilePic}` : null
  );
  const [showPwd,     setShowPwd]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [errors,      setErrors]      = useState({});

  const handleFileChange = (e) => {
    const uploadFile = e.target.files[0];
    if (!uploadFile) return;
    setProfilePic(uploadFile);
    setPreview(URL.createObjectURL(uploadFile));
  };

  const validate = () => {
    const newErrors = {};
    if (!userName.trim())              newErrors.name = "Name is required.";
    if (pwd && pwd.length < 4)         newErrors.pwd  = "Password must be at least 4 characters.";
    if (pwd && pwd !== confirmPassword) newErrors.confirm = "Passwords do not match.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleUpdate = (e) => {
  e.preventDefault();
  if (!validate()) return;

  setSaving(true);
  const formData = new FormData();
  formData.append("name", userName.trim());

  // ✅ Only send password if user typed a new one
  if (pwd) {
    formData.append("password", pwd);
  }

  if (profilePic && typeof profilePic !== "string") {
    formData.append("profilePic", profilePic);
  }

  dispatch(updateUserProfile({ email: user.email, formData }));
  setTimeout(() => {
    setSaving(false);
    navigate("/profile");
  }, 1000);
};

  const initial = userName?.charAt(0).toUpperCase() || "G";

  return (
    <div className="ep-page">
      <div className="ep-container">

        {/* ── Left Panel ── */}
        <div className="ep-left">
          <div className="ep-avatar-wrap">
            {preview
              ? <img src={preview} alt="avatar" className="ep-avatar-img" />
              : <span className="ep-avatar-initial">{initial}</span>
            }
            <label className="ep-avatar-overlay">
              <span>Change Photo</span>
              <input type="file" accept="image/*" onChange={handleFileChange} hidden />
            </label>
          </div>
          <h3 className="ep-username">{userName || "Your Name"}</h3>
          <p className="ep-useremail">{user.email}</p>
          <div className="ep-tip">
            Click the photo to upload a new profile picture
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="ep-right">
          <div className="ep-right-header">
            <div>
              <h2>Edit Profile</h2>
              <p>Update your account information</p>
            </div>
            <button className="ep-back-btn" onClick={() => navigate("/profile")}>
              ← Back
            </button>
          </div>

          <form onSubmit={handleUpdate}>

            {/* ── Name ── */}
            <div className="ep-field">
              <label>Full Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your full name"
                className={errors.name ? "ep-input error" : "ep-input"}
              />
              {errors.name && <span className="ep-error">{errors.name}</span>}
            </div>

            {/* ── Email ── */}
            <div className="ep-field">
              <label>Email Address</label>
              <input
                type="text"
                value={user.email}
                disabled
                className="ep-input ep-disabled"
              />
              <span className="ep-hint">Email cannot be changed</span>
            </div>

            <div className="ep-divider">
              <span>Change Password</span>
            </div>
            <p className="ep-hint" style={{ marginBottom: "1rem" }}>
              Leave blank to keep your current password
            </p>

            {/* ── New Password ── */}
            <div className="ep-field">
              <label>New Password</label>
              <div className="ep-input-wrap">
                <input
                  type={showPwd ? "text" : "password"}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="New password"
                  className={errors.pwd ? "ep-input error" : "ep-input"}
                />
                <button type="button" className="ep-toggle" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? "Hide" : "Show"}
                </button>
              </div>
              {errors.pwd && <span className="ep-error">{errors.pwd}</span>}
            </div>

            {/* ── Confirm Password ── */}
            <div className="ep-field">
              <label>Confirm Password</label>
              <div className="ep-input-wrap">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className={errors.confirm ? "ep-input error" : "ep-input"}
                />
                <button type="button" className="ep-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirm && <span className="ep-error">{errors.confirm}</span>}
            </div>

            {/* ── Actions ── */}
            <div className="ep-actions">
              <button type="button" className="ep-cancel-btn" onClick={() => navigate("/profile")}>
                Cancel
              </button>
              <button type="submit" className="ep-save-btn" disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;