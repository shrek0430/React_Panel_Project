import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import { axiosInstance, BASE_URL } from "../Config";
import Pagination from "../Pagination";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [isToastActive, setIsToastActive] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/categorylist`);

      if (response.data.success) {
        setCategories(response.data.body.data);
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Failed to load categories",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        "An error occurred while fetching the category list",
        "error"
      );
    }
  };

  const deleteCategory = async (_id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/deletecategory/${_id}`);
        fetchData();
        Swal.fire("Deleted!", "Category has been deleted.", "success");
      } catch (error) {
        Swal.fire(
          "Error!",
          error.response?.data?.message || "Error deleting category",
          "error"
        );
      }
    } else {
      Swal.fire("Cancelled", "Category deletion has been cancelled", "info");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "0" ? "1" : "0";

    try {
      const response = await axiosInstance.post(`/categorystatus`, {
        id,
        status: newStatus,
      });

      if (response.data.success) {
        fetchData();
        if (!isToastActive) {
          setIsToastActive(true);
          toast.success(
            `Category status changed to ${
              newStatus === "0" ? "Active" : "Inactive"
            }`
          );
          setTimeout(() => {
            setIsToastActive(false);
          }, 2000);
        }
      } else {
        toast.error(response.data.message || "Failed to change status");
      }
    } catch (error) {
      toast.error("An error occurred while changing category status");
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card my-4">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-2 pb-2">
                  <div className="d-flex justify-content-between align-items-center px-3">
                    <h6 className="text-white text-capitalize">Categories</h6>
                    <div className="d-flex align-items-center">
                      <div className="mx-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{
                            backgroundColor: "white",
                            paddingLeft: "10px",
                          }}
                        />
                      </div>
                      <div className="mt-1">
                        <Link
                          to="/categoryadd"
                          className="btn btn-light"
                          style={{ marginTop: "10px" }}
                        >
                          Add
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="section-body">
                <div className="card">
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table text-center">
                        <thead>
                          <tr>
                            <th>Sr_No.</th>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedCategories.map((category, index) => (
                            <tr key={category._id}>
                              <td>
                                {(currentPage - 1) * pageSize + index + 1}
                              </td>
                              <td>{category.name || "no category"}</td>
                              <td>
                                {category.image ? (
                                  <img
                                    src={`${BASE_URL}/${category.image}`}
                                    alt={category.name}
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      borderRadius: "50%",
                                    }}
                                  />
                                ) : (
                                  "No Image"
                                )}
                              </td>
                              <td>
                                <div className="form-check form-switch d-flex align-items-center justify-content-center">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`statusSwitch-${category._id}`}
                                    checked={category.status === "0"}
                                    onChange={() =>
                                      toggleStatus(
                                        category._id,
                                        category.status
                                      )
                                    }
                                    style={{
                                      backgroundColor:
                                        category.status === "0"
                                          ? "#D81B60"
                                          : "lightgray",
                                      borderColor:
                                        category.status === "0"
                                          ? "#D81B60"
                                          : "lightgray",
                                    }}
                                  />
                                </div>
                              </td>

                              <td>
                                <Link
                                  to={`/viewcategory/${category._id}`}
                                  className="has-icon btn btn-success m-1"
                                  style={{
                                    backgroundColor: "#D81B60",
                                    color: "white",
                                  }}
                                >
                                  <i className="me-100 fas fa-eye" />
                                </Link>
                                <Link
                                  to={`/updatecategory/${category._id}`}
                                  className="has-icon btn btn-success m-1"
                                  style={{
                                    backgroundColor: "#D81B60",
                                    color: "white",
                                  }}
                                >
                                  <i className="me-100 fas fa-edit" />
                                </Link>
                                <button
                                  onClick={() => deleteCategory(category._id)}
                                  className="has-icon btn m-1"
                                  style={{
                                    backgroundColor: "#D81B60",
                                    borderColor: "#D81B60",
                                    color: "#fff",
                                  }}
                                >
                                  <i className="me-100 fas fa-trash" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryList;
