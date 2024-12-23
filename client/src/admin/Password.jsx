import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { axiosInstance } from '../Config';

const Password = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const reset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("No token found. Please log in again.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/change_password`,
        { password, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        localStorage.setItem('token', response.data.body.token); 
        toast.success("Your password was reset successfully");
        navigate("/");
      } else {
        toast.error(response.data.message || "Password reset failed");
      }
    } catch (error) {
      toast.error("An error occurred while resetting the password: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="container-fluid ">
        <div className="row">
          <div className="col-12">
            <div className="card my-4">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
                  <h6 className="text-white text-capitalize ps-3">
                    Change Password
                  </h6>
                </div>
              </div>
              <form onSubmit={reset} className='mt-4 '>
                <div className="form-group mx-3 mb-3">
                  <label htmlFor="password">Old Password</label>
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    style={{paddingLeft:'10px',backgroundColor:'lightpink'}}
                  />
                </div>
                <div className="form-group mx-3 mb-2">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    id="newPassword"
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    style={{paddingLeft:'10px',backgroundColor:'lightpink'}}
                    required
                  />
                </div>
                <div className="form-group mx-3 mb-4">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    style={{paddingLeft:'10px',backgroundColor:'lightpink'}}
                    required
                  />
                </div>
                <div className="d-flex justify-content-start mx-3">
                  <button type="submit" className="btn btn-primary" >
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Password;
