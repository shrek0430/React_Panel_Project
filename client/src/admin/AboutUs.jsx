import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AboutUs = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const response = await axios.get("http://localhost:8000/aboutus");
        const { data } = response.data;
        setTitle(data.title || "");
        setContent(data.content || "<p><br></p>");
      } catch (error) {
        console.error("Error fetching About Us:", error);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (content.trim() === "<p><br></p>") {
      setError("About Us cannot be empty.");
      return;
    }

    setError("");
    setSubmitError("");

    try {
      await axios.post("http://localhost:8000/updateabout", {
        title,
        content,
      });
      toast.success("About Us updated successfully");
      navigate("/aboutus");
    } catch (error) {
      setSubmitError("Error submitting About Us. Please try again.");
      toast.error("Error submitting About Us. Please try again.");
      console.error("Error submitting About Us:", error);
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
                    About Us
                  </h6>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-4">
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="title">Title</label>
                      <input
                        id="title"
                        type="text"
                        className="form-control"
                        value={title}
                        readOnly
                        style={{paddingLeft:'10px',backgroundColor:'lightpink'}}
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="content">Content</label>
                      <div style={{ position: "relative" }}>
                        <ReactQuill
                          id="content"
                          style={{ height: "300px", marginBottom: "50px" }}
                          theme="snow"
                          value={content}
                          onChange={setContent}
                          modules={{
                            toolbar: [
                              [{ header: "1" }, { header: "2" }, { font: [] }],
                              [{ list: "ordered" }, { list: "bullet" }],
                              ["bold", "italic", "underline"],
                              [{ color: [] }, { background: [] }],
                              [{ align: [] }],
                              ["clean"],
                            ],
                          }}
                        />
                        {content.trim() === "<p><br></p>" && (
                          <div
                            style={{
                              position: "absolute",
                              top: 55,
                              left: 18,
                              right: 0,
                              bottom: 0,
                              pointerEvents: "none",
                              color: "red",
                              fontStyle: "italic",
                            }}
                          >
                            About Us cannot be empty.
                          </div>
                        )}
                      </div>
                      {error && <p className="text-danger">{error}</p>}
                      {submitError && (
                        <p className="text-danger">{submitError}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 d-flex justify-content-end">
                    <button type="submit" className="btn " style={{ backgroundColor: '#D81B60', color:"white" }}>
                      Update
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
