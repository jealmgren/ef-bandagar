const model = require("../model.js");
const express = require('express');
const mysql = require('mysql');

const router = express.Router();

// ADMIN: Returnera alla banor.
router.get('/getCircuitsAdmin', function (req, res) {
  let userName = req.cookies.userName;
  model.getCircuitsAdmin(userName,function(circuits, columns) {
    res.json({ circuits: circuits, columns: columns});
  });
});

// ADMIN: Returnera alla bandagar.
router.get('/getTrackdays', function (req, res) {
  let userName = req.cookies.userName;
  model.getTrackdays(userName, function(trackdays, columns) {
    res.json({ trackdays: trackdays, columns: columns});
  });
});

// ADMIN: Returnera alla bokningar.
router.get('/getBookings', function (req, res) {
  let userName = req.cookies.userName;
  model.getBookings(userName, function(bookings, columns) {
    res.json({ bookings: bookings , columns: columns});
  });
});

// ADMIN: Raderar en bokning.
router.post('/removeBooking', function (req, res) {
  let bookingID = parseInt(req.body.bookingID);
  let userName = req.cookies.userName;
  model.removeBooking(userName, bookingID, function(success) {
    if (success) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  });
});

// ADMIN: Lägger till en bandag.
router.post('/addCircuit', function (req, res) {
  let name = req.body.name;
  let length = parseInt(req.body.length);
  let adress = req.body.adress;
  let info = req.body.info;
  let url = req.body.url;
  let userName = req.cookies.userName;
  model.addCircuit(userName, name, length, adress, info, url, function(success) {
    if (success) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  });
});

// ADMIN: Raderar en bandag och bokningar denna dag.
router.post('/removeTrackday', function (req, res) {
  let trackdayID = parseInt(req.body.trackdayID);
  let userName = req.cookies.userName;
  model.removeTrackday(userName, trackdayID, function(success) {
    if (success) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  });
});

// ADMIN: Lägger till en bana.
router.post('/addTrackday', function (req, res) {
  let circuitID = parseInt(req.body.circuitID);
  let trackdayDate = req.body.trackdayDate;
  let noParticipants = parseInt(req.body.noParticipants);
  let pace = req.body.pace;
  let userName = req.cookies.userName;
  model.addTrackday(userName, circuitID, trackdayDate, noParticipants, pace, function(success) {
    if (success) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  });
});

// Returnerar kontouppgifter.
router.get('/getProfile', function (req, res) {
  let userName = req.cookies.userName;
  model.getProfile(userName,function(profile) {
    res.json({ profile: profile });
  });
});

// Uppdaterar kontouppgifter.
router.post('/updateProfile', function (req, res) {
  let userName = req.cookies.userName;
  let name = req.body.name;
  let phoneNo = req.body.phoneNo;
  let adress = req.body.adress;
  if (name == null ) { name = '';}
  if (phoneNo == null ) { phoneNo = '';}
  if (adress == null ) { adress = '';}
  if (userName.length < 30 && name.length < 30 && phoneNo.length < 30 && adress.length < 30) {
    model.updateProfile(name,phoneNo,adress,userName, function(success) {
      if (success) {
        res.sendStatus(200);
      } else {
        res.sendStatus(500);
      }
    });
  } else {
    res.sendStatus(406);
  }
});

// Ta bort kaka för att logga ut.
router.get('/logOut', function (req, res) {
  let userName = req.cookies.userName;
  res.cookie('userName', userName, { maxAge: 0, httpOnly: true }).json({user: true});
});

// Returnera alla banor.
router.get('/getCircuits', function (req, res) {
  model.getCircuits(function(circuits, columns) {
    res.json({ circuits: circuits, columns: columns});
  });
});

// Returnera alla bokningar till en användare.
router.get('/getBookingsByUser', function (req, res) {
  let userName = req.cookies.userName;
  model.getBookingsByUser(userName, function(bookings, columns) {
    res.json({ bookings: bookings , columns: columns});
  });
});

// Returnera alla unika datum per bana.
router.get('/getTrackdayDates', function (req, res) {
  model.getTrackdayDates(function(trackdayDates) {
    res.json({ trackdayDates: trackdayDates});
  });
});

// Returnera en bandag med olika grupper.
router.post('/getTrackdayForConfirmation', function (req, res) {
  let circuitID = parseInt(req.body.circuitID);
  let trackdayDate = req.body.trackdayDate;
  model.getTrackday(circuitID, trackdayDate, function(trackdays, columns) {
    res.json({ trackdays: trackdays, columns: columns});
  });
});

// Boka en bandag.
router.post('/confirmBooking', function (req, res) {
  let trackdayID = parseInt(req.body.trackdayID);
  let userName = req.cookies.userName;
  model.confirmBooking(userName, trackdayID, function(success) {
    if (success) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
})

// Returnera om användaren har loggat in eller inte.
router.get('/isLoggedIn', function (req, res) {
  let userName = req.cookies.userName;
  model.checkValidUser(userName, function(loggedIn) {
    res.json({ loggedIn: loggedIn });
  })
});

// Lägger till en användare.
router.post('/addUser', function (req, res) {
  let new_username = req.body.new_username;
  let new_password = req.body.new_password;
  if (new_username.length < 30 && new_username.length > 1 && new_password.length < 40 && new_password.length > 1) {
    model.addNewUser(new_username,new_password,function(newUser) {
      if (newUser) {
        res.cookie('userName', new_username, { maxAge: 900000, httpOnly: true }).json({newUser: newUser});
      } else {
      res.json({ newUser: newUser });
      }
    });
  } else if ( new_username.length < 8 ) { res.json({ newUser: "toShortUsername" })
  } else if ( new_username.password < 8 ) { res.json({ newUser: "toShortPassword" })
  } else { res.json({ newUser: "toLong" })
  }
});

// Loggar in användaren.
router.post('/loginUser', function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  model.loginUser(username,password, function(user, isAdmin) {
    if (user) {
      //Skapa en kaka med userName.
      res.cookie('userName', username, { maxAge: 90000000, httpOnly: true }).json({user: user, isAdmin: isAdmin});
    } else {
      res.json({user: user});
    }
  });
});

module.exports = router;
