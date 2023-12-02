const express = require("express");
const customerController = require("../controllers/customer-controller");
const { createJWT, verifyJWT } = require("../middleware/jwt");

const router = express.Router();

// CUSTOMER ROUTES

// GET ALL CUSTOMERS
router.get("/", customerController.GetCustomers);

// GET CUSTOMER BY ID
router.get("/single/:id", customerController.GetCustomerByID);

// CREATE NEW CUSTOMER
router.post("/", customerController.CreateCustomer);

// UPDATE CUSTOMER BY ID
router.patch("/:id", customerController.UpdateCustomer);

// DELETE CUSTOMER BY ID
router.delete("/:id", customerController.DeleteCustomer);

// REGISTER CUSTOMER
router.post("/register", customerController.RegisterCustomer, createJWT);

// TEST PROTECTED ROUTE
router.get("/test", verifyJWT, customerController.ProtectedRoute);

// // GOOGLE AUTHENTICATION
// router.get("/login/google", customerController.GoogleAuthenticate);
// router.get(
//   "/login/google/dashboard",
//   customerController.GoogleAuthenticateRedirect,
//   customerController.GoogleAuthenticated
// );

module.exports = router;
