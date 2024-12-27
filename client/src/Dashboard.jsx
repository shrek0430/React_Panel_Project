import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import ApexChart from './ApexChart';
import { axiosInstance} from './Config';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [users, setUsers] = useState(0);
  const [categories, setCategories] = useState(0);
  const [subCategories, setSubCategories] = useState(0);
  const [bookings, setBookings] = useState(0);
  const [contact, setContact] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token missing');
        navigate('/'); 
        return;
      }

      const response = await axiosInstance.get(`/dash_board`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setUsers(response.data.body.userCount);
        setCategories(response.data.body.data); 
        setSubCategories(response.data.body.subdata); 
        setBookings(response.data.body.databooking); 
        setContact(response.data.body.datacontact); 
      } else {
        toast.error('Failed to fetch dashboard data');
      }
    } catch (error) {
      toast.error('An error occurred while fetching the dashboard data');
    }
  };

  useEffect(() => {
    fetchDashboardData();
    if (location.state && location.state.message) {
      toast.success(location.state.message);
    }
  }, [location.state]);

  return (
    <>
      <ToastContainer />
      <div className='container-fluid py-4'>
        <div className="row">
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
            <Link to="/userlist" >
              <div className="card">
                <div className="card-header p-3 pt-2">
                  <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                    <i className="material-icons opacity-10">person</i>
                  </div>
                  <div className="text-end ">
                    <h4> Users</h4>
                    <h4>{users}</h4>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
            <Link to="/categorylist"> 
              <div className="card">
                <div className="card-header p-3 pt-2">
                  <div className="icon icon-lg icon-shape bg-gradient-dark shadow-dark text-center border-radius-xl mt-n4 position-absolute">
                    <i className="material-icons opacity-10">weekend</i>
                  </div>
                  <div className="text-end ">
                    <h4>Categories</h4>
                    <h4>{categories}</h4>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
            <Link to="/subcategory">
              <div className="card">
                <div className="card-header p-3 pt-2">
                  <div className="icon icon-lg icon-shape bg-gradient-success shadow-success text-center border-radius-xl mt-n4 position-absolute">
                    <i className="material-icons opacity-10">list</i>
                  </div>
                  <div className="text-end pt-1">
                    <h4>Sub Categories</h4>
                    <h4>{subCategories}</h4>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-xl-3 col-sm-6">
            <Link to="/bookinglist">
              <div className="card">
                <div className="card-header p-3 pt-2">
                  <div className="icon icon-lg icon-shape bg-gradient-info shadow-info text-center border-radius-xl mt-n4 position-absolute">
                    <i className="material-icons opacity-10">calendar_today</i>
                  </div>
                  <div className="text-end pt-1">
                    <h4>Bookings</h4>
                    <h4>{bookings}</h4>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-xl-3 col-sm-6 mt-5">
            <Link to="/contacts">
              <div className="card">
                <div className="card-header p-3 pt-2">
                  <div className="icon icon-lg icon-shape bg-gradient-warning shadow-info text-center border-radius-xl mt-n4 position-absolute">
                  <i className="material-icons opacity-10">contacts</i>
                  </div>
                  <div className="text-end pt-1">
                    <h4>Contacts</h4>
                    <h4>{contact}</h4>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-xl-3 col-sm-6 mt-5">
            <Link to="/map">
              <div className="card">
                <div className="card-header p-3 pt-2">
                  <div className="icon icon-lg icon-shape bg-gradient-danger shadow-info text-center border-radius-xl mt-n4 position-absolute">
                  <i className="material-icons opacity-10">map</i>
                  </div>
                  <div className="text-end pt-1">
                    <h4>Map</h4>
                    <h4>Current location</h4>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-xl-3 col-sm-6 mt-5">
            <Link to="/calendar">
              <div className="card">
                <div className="card-header p-3 pt-2">
                  <div className="icon icon-lg icon-shape bg-gradient-primary shadow-info text-center border-radius-xl mt-n4 position-absolute">
                  <i className="material-icons opacity-10">event</i>
                  </div>
                  <div className="text-end pt-1">
                    <h4>Calendar</h4>
                    <h4>Event</h4>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className='container-fluid'>
        <ApexChart />
      </div>
    </>
  );
};

export default Dashboard;
