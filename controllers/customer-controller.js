const Customer = require("../models/customer");
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");

//        ********** STRATEGIES ***********

// CUSTOMER GOOGLE STRATEGY
// passport.use(
//   "google-customer",
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:3000/customer/login/google/dashboard",
//     },
//     async function (accessToken, refreshToken, profile, done) {
//       console.log(profile);
//       try {
//         const customer = await Customer.findOne({ googleId: profile.id });
//         if (!customer) {
//           const newCustomer = new Customer({
//             googleId: profile.id,
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             imageURL: profile.photos[0].value,
//           });
//           await newCustomer.save();
//           console.log("New customer has been created");
//           return done(null, newCustomer);
//         } else {
//           console.log("Customer already exists");
//           return done(null, customer);
//         }
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

//        ********** FUNCTIONS ***********

// GET ALL CUSTOMERS
const GetCustomers = async (req, res, next) => {
  console.log("Get all customers");
  try {
    const customer = await Customer.find();
    return res.status(200).send(customer);
  } catch (error) {
    next({ error });
  }
};

// GET SINGLE CUSTOMER
const GetCustomerByID = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    return res.status(200).send(customer);
  } catch (error) {
    next({ error });
  }
};

// CREATE NEW CUSTOMER
const CreateCustomer = async (req, res, next) => {
  const customer = new Customer(req.body);
  try {
    await customer.save();
    return res.status(200).json(customer);
  } catch (error) {
    next({ error });
  }
};

// UPDATE CUSTOMER
const UpdateCustomer = async (req, res, next) => {
  if (req.body.email) {
    req.body.email = req.body.email.toLowerCase();
  }

  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(customer);
  } catch (error) {
    next({ error });
  }
};

// DELETE CUSTOMER
const DeleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    return res.status(200).json(customer);
  } catch (error) {
    next({ error });
  }
};

// REGISTER CUSTOMER ON SIGNUP
const RegisterCustomer = async (req, res, next) => {
  const { name, email, password } = req.body;
  const safeEmail = email.toLowerCase();

  try {
    // Check if the customer with the same email already exists
    const existingCustomer = await Customer.findOne({ email: safeEmail });
    if (existingCustomer) {
      return next({
        error: { message: "Customer with this email already exists" },
        status: 409,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newCustomer = new Customer({
      name,
      email: safeEmail,
      password: hashedPassword,
    });

    await newCustomer.save();
    req.user = newCustomer;
    next();
  } catch (error) {
    next({ error });
  }
};

// LOGIN CUSTOMER
const LoginCustomer = async (req, res, next) => {
  const { email, password } = req.body;
  const safeEmail = email.toLowerCase();

  try {
    const customer = await Customer.findOne({ email: safeEmail });

    if (!customer) {
      return next({
        error: { message: "Invalid email or password" },
        status: 401,
      });
    }

    const passwordMatch = await bcrypt.compare(password, customer.password);
    if (!passwordMatch) {
      return next({
        error: { message: "Invalid email or password" },
        status: 401,
      });
    }

    req.user = customer;
    next();
  } catch (error) {
    next({ error });
  }
};

// TEST FUNCTION
const ProtectedRoute = async (req, res) => {
  console.log(req.user);
  res.status(200).json(req.user);
};

// // GOOGLE AUTHENTICATION
// const GoogleAuthenticate = passport.authenticate("google-customer", {
//   scope: ["profile", "email"],
// });

// // GOOGLE AUTHENTICATION REDIRECT
// const GoogleAuthenticateRedirect = passport.authenticate("google-customer", {
//   failureRedirect: "http://localhost:5173/customer/login",
// });

// // GOOGLE AUTHENTICATION SUCCESS REDIRECT
// const GoogleAuthenticated = (req, res) => {
//   res.redirect(
//     `http://localhost:5173/customer/login?id=${req.user._id}&name=${req.user.name}&email=${req.user.email}&imageURL=${req.user.imageURL}`
//   );
// };

module.exports = {
  GetCustomers,
  GetCustomerByID,
  CreateCustomer,
  UpdateCustomer,
  DeleteCustomer,
  RegisterCustomer,
  LoginCustomer,
  ProtectedRoute,
  // GoogleAuthenticate,
  // GoogleAuthenticateRedirect,
  // GoogleAuthenticated,
};
