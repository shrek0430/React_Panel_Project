const mongoose = require('mongoose');
const { Validator } = require('node-input-validator');
const Booking = require('../../models/bookings');
const User = require('../../models/users');
const Services = require('../../models/services');
const Category = require('../../models/categeory');
const helper = require('../../helper/helper');

const createBooking = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            user_id: 'required',
            service_id: 'required',
            cat_id: 'required'  
        });

        const isValid = await validator.check();
        if (!isValid) {
            return helper.error(res, 'Invalid data', validator.errors);
        }

        const userId = req.body.user_id.trim();
        const serviceId = req.body.service_id.trim();
        const catId = req.body.cat_id.trim();

        const userExists = await User.exists({ _id: userId });
        const serviceExists = await Services.exists({ _id: serviceId });
        const carExists = await Category.exists({ _id: catId });

        if (!userExists) {
            return helper.error(res, 'User not found');
        }
        
        if (!serviceExists) {
            return helper.error(res, 'Service not found');
        }
        if (!carExists) {
            return helper.error(res, 'Car not found');
        }

        const newBooking = await Booking.create({
            user_id: userId,
            booking_code: req.body.booking_code,
            cat_id: catId,
            service_id: serviceId,
            amount: req.body.amount,
            no_of_booking: req.body.no_of_booking,
            description: req.body.description,
            location: req.body.location,
            date: req.body.date,
        });

        return helper.success(res, 'Booking Created Successfully', { data: newBooking });

    } catch (error) {
        console.error('Error creating booking:', error);
        return helper.error(res, 'Internal server error');
    }
};

const bookinglist = async (req, res) => {
    try {
        const { page = 1, size = 5 } = req.query; 
        const limit = parseInt(size, 10);
        const skip = (parseInt(page, 10) - 1) * limit;

        const totalCount = await Booking.countDocuments();
        const bookings = await Booking.find()
            .skip(skip)
            .limit(limit)
            .populate('user_id')
            .populate('service_id') 
            .populate('cat_id')     
            .exec();

        res.status(200).json({
            success: true,
            message: "Booking retrieved successfully",
            body: {
                data: bookings,
                pagination: {
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    currentPage: parseInt(page, 10),
                    pageSize: limit
                }
            }
        });
    } catch (error) {
        console.error("Error retrieving booking:", error);
        return helper.error(res, "Internal server error");
    }
};


const bookingView = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params._id)
           .populate("user_id")
           .populate('service_id')
           .populate('cat_id')
           .exec();

        res.status(200).json({
            success: true,
            message: "Booking retrieved successfully",
            body: booking
        });

    } catch (error) {
        console.error("Error retrieving booking:", error);
        return helper.error(res, "Internal server error");
    }
};

const status = async (req, res) => {
    try {
        const { id, status } = req.body;
        if (!["0", "1", "2"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }
        const updatebooking = await Booking.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (!updatebooking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Booking status updated successfully",
            data: updatebooking
        });
    } catch (error) {
        console.error("Error updating booking status:", error);
        return res.status(500).json({ message: "An error occurred while updating booking status" });
    }
};

module.exports = {
    createBooking,
    bookinglist,
    bookingView,
    status,
};
