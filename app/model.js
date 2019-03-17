/* jslint node: true */
"use strict";

// För att hasha lösenord.
const crypto = require('crypto');

// För skapa en kontakt med databasen.
const mysql = require('mysql');

// Upprättar en kontakt till databasen. FÖR LOKAL DATABAS
// const db = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     password: "qwerty",
//     database: 'trackdaybas',
//     charset: 'utf8mb4'});

// Upprättar en kontakt till databasen. FÖR LOKAL DATABAS
const db = mysql.createPool({
    port: 3306,
    host: "remotemysql.com",
    user: "3eloxajk72",
    password: "1n2h4sH39l",
    database: '3eloxajk72',
    supportBigNumbers: true
    });

// ADMIN: Returnera alla banor.
exports.getCircuitsAdmin = function(username, callback) {
  isAdmin(username)
  .then( function(isAdmin) {
    if (isAdmin) {
      let sql = 'SELECT DISTINCT * FROM circuits';
      let values;
      queryDatabase(sql, values, function(circuits, columns) {
        callback(circuits, columns);
      })
    } else {
      callback(false, false);
    }
  })
}

// ADMIN: Returnera alla bandagar.
exports.getTrackdays = function(username, callback) {
  isAdmin(username)
  .then( function(isAdmin) {
    if (isAdmin) {
      let sql =
        `SELECT trackdayID, circuitID, trackdayDate as Datum, noParticipants AS Antal_deltagare, pace AS Grupp
        FROM trackdays`;
      let values;
      queryDatabase(sql, values, function(trackdays, columns) {
        callback(trackdays, columns);
      })
    } else {
      callback(false, false);
    }
  })
}

// ADMIN: Returnera alla bokningar.
exports.getBookings = function(username, callback) {
  isAdmin(username)
  .then( function(isAdmin) {
    if (isAdmin) {
      let sql = `SELECT bookingID, trackdayDate, pace, C.name as Bana, U.name as Deltagarnamn, U.phoneNo
                  FROM bookings B
                  JOIN users U ON U.userName = B.userName
                  JOIN trackdays T ON T.trackdayID = B.trackdayID
                  JOIN circuits C ON C.circuitID = T.circuitID
                  WHERE B.trackdayID = T.trackdayID AND U.userName = B.userName`
      let values;
      queryDatabase(sql, values, function(bookings,columns) {
        callback(bookings, columns);
      })
    } else {
      callback(false, false);
    }
  })
}
  
// ADMIN: Ta bort en specifik bokning.
exports.removeBooking = function(username, bookingID, callback) {
  isAdmin(username)
  .then( function(isAdmin) {
    if (isAdmin) {
      let sql = `DELETE FROM bookings WHERE bookingID = ?`;
      let values = [bookingID];
      queryDatabase(sql, values, function(status) {
        callback(status);
      });
    } else {
      callback(false);
    }
  })
}

// ADMIN: Lägger till en ny bana.
exports.addCircuit = function(username, name, length, adress, info, url, callback) {
  isAdmin(username)
  .then( function(isAdmin) {
    if (isAdmin) {
      let sql = `INSERT INTO circuits VALUES(null,?,?,?,?,?)`
      let values = [name, length, adress, info, url];
      queryDatabase(sql, values, function(status) {
        callback(status);
      });
    } else {
      callback(false);
    }
  })
}

// ADMIN: Ta bort en specifik bandag och bokningar den dagen.
exports.removeTrackday = function(username, trackdayID, callback) {
  isAdmin(username)
  .then( function(isAdmin) {
    if (isAdmin) {
      removeBookingTrackday(trackdayID)
      .then(function(success) {
        if (success) {
          let sql = `DELETE FROM trackdays WHERE trackdayID = ?`;
          let values = [trackdayID];
          queryDatabase(sql, values, function(status) {
            callback(success);
          });
        }
      });
    } else {
      callback(false);
    }
  })
}

// ADMIN: Lägger till en ny bana.
exports.addTrackday = function(username, circuitID, trackdayDate, noParticipants, pace, callback) {
  isAdmin(username)
  .then( function(isAdmin) {
    if (isAdmin) {
      let sql = `INSERT INTO trackdays VALUES(null,?,?,?,?)`
      let values = [circuitID, trackdayDate, noParticipants, pace];
      queryDatabase(sql, values, function(status) {
        callback(status);
      });
    } else {
      callback(false);
    }
  })
}

// Returnerar kontouppgifter.
exports.getProfile = function(userName, callback) {
  let sql = 'SELECT name, phoneNo, adress FROM users WHERE userName = ?';
  let values = [userName];
  queryDatabase(sql, values, function(profile) {
    callback(profile);
  });
}
// Uppdaterar DB med uppdaterade kontouppgifter.
exports.updateProfile = function(name,phoneNo,adress,userName, callback) {
  let sql = 'UPDATE users SET name=?, phoneNo=?, adress=? WHERE userName=?'
  let values = [name,phoneNo,adress,userName];
  queryDatabase(sql, values, function(status) {
    callback(status);
  });
}

// Returnera alla banor.
exports.getCircuits = function(callback) {
  let sql = 'SELECT DISTINCT * FROM circuits';
  let values;
  queryDatabase(sql, values, function(circuits, columns) {
    callback(circuits, columns);
  })
}

// Returnera unika datum per bana.
exports.getTrackdayDates = function(callback) {
  let sql = 'SELECT DISTINCT trackdayDate AS trackdayDate, circuitID FROM trackdays';
  let values;
  queryDatabase(sql, values, function(trackdayDates) {
    callback(trackdayDates);
  })
}

// Returnera alla bokningar till en användare.
exports.getBookingsByUser = function(userName, callback) {
  let sql = `SELECT trackdayDate AS Datum, pace AS Grupp, C.name as Bana
              FROM bookings B
              JOIN users U ON U.userName = B.userName
              JOIN trackdays T ON T.trackdayID = B.trackdayID
              JOIN circuits C ON C.circuitID = T.circuitID
              WHERE U.userName = ?`
  let values = [userName];
  queryDatabase(sql, values, function(bookings,columns) {
    callback(bookings, columns);
  })
}

// Returnerar en bandag.
exports.getTrackday = function(circuitID, trackdayDate, callback) {
  let sql = `
    SELECT T.trackdayID, T.pace, T.noParticipants as NoParticipants, count(B.trackdayID) AS NoBooked, T.noParticipants-count(B.trackdayID) as NoOfVacan
    FROM bookings B
    RIGHT JOIN trackdays T ON T.trackdayID = B.trackdayID
    WHERE T.circuitID = ? AND T.trackdayDate = ?
    GROUP BY T.trackdayID`
  let values = [circuitID, trackdayDate];
  queryDatabase(sql, values, function(trackdays, columns) {
    callback(trackdays, columns);
  })
}

// Kontrollera om en bokning är möjlig och utför denna.
exports.confirmBooking = function(username, trackdayID, callback) {
  checkNewUser(username)
  .then(function(result) {
    if (result === 1) {
      callback(false);
    } else {
      checkNoOfBookings(trackdayID)
      .then(function(success) {
        if (success) {
          makeBooking(trackdayID, username)
          .then(function(success) {
            if (success) {
              callback(success)
            } else {
              callback(success)
            }
          })
        } else {
          callback(false)
        }
      })
    }
  });
}

//Lägger in ny unik användare i DB med hashad (salt + lösenord).
exports.addNewUser = function(new_username,new_password,callback) {
  checkNewUser(new_username)
  .then(function(result) {
    if (result != 1) {
      callback(false);
    } else {
      let {salt, hash} = saltHashPassword(new_password);
      let sql = 'insert into users values (?,?,?, NULL, NULL, NULL, 0)';
      let values = [new_username, hash, salt];
      queryDatabase(sql,values,function() {
        callback(true);
      })

    }
  });
}

// Kontrollerar om användaren finns i databasen
exports.checkValidUser = function(username, callback) {
  checkNewUser(username)
  .then(function(result) {
    if (result === 1) {
      callback(false);
    } else {
      callback(true);
    }
  })
};

// Kontrollerar att användarnamn och lösenord stämmer.
exports.loginUser = function(username,password,callback) {
  getSalt(username)
  .then(function(salt) {
    if (salt === 1) {
      callback(false);
    } else {
      controlPassword(password,salt)
      .then(function(hashChecked) {
        if (hashChecked === 1){
          callback(false);
        } else {
          isAdmin(username)
          .then(function(isAdmin) {
            if (isAdmin) {
              callback(true,true)
            } else {
              callback(true)
            }
          })
        }
      });
    }
  });
}

// Tar bort bokningar med givet trackdayID.
function removeBookingTrackday(trackdayID) {
  return new Promise(function(resolve, reject) {
    let sql = `DELETE FROM bookings WHERE trackdayID = ?`;
    let values = [trackdayID];
    queryDatabase (sql, values, function (success) {
        resolve(success);
    })
  })
}

// Kontrollerar om hash av givet password+salt stämmer med DB.
function controlPassword(password,salt) {
  return new Promise(function(resolve, reject){
    const newHash = crypto.createHmac('sha512', salt).update(password).digest('hex')
    let sql = 'SELECT password_hash FROM users WHERE password_hash = ?';
    let values = [newHash];
    queryDatabase (sql, values, function(user) {
      if (user.length > 0) {
        resolve(user[0].password_hash);
      } else {
        resolve(1);
      }
    })
  });
}

// Hämtar salt till en användare.
function getSalt(username) {
  return new Promise(function(resolve, reject){
    let sql = 'SELECT salt FROM users WHERE username = ?';
    let values = [username];
    queryDatabase (sql, values, function(user) {
      if (user.length > 0) {
        resolve(user[0].salt);
      } else {
        resolve(1);
      }
    })
  });
}

// Jämför givet användarnamn mot databasen.
function checkNewUser(new_username) {
  return new Promise(function(resolve, reject){
    let sql = 'SELECT userName FROM users WHERE username = ?';
    let values = [new_username];
    queryDatabase (sql, values, function(user) {
      if (user.length > 0) {
        resolve(user[0].userName);
      } else {
        resolve(1);
      }
    })
  });
}

// Hämta antalet möjliga platser på en bandag.
function noOfGroup(trackdayID) {
  return new Promise(function(resolve, reject) {
    let sql = `
        SELECT noParticipants
        FROM trackdays
        WHERE trackdayID = ?`
    let values = [trackdayID];
    queryDatabase (sql, values, function(result) {
      if (result.length > 0) {
        resolve(result[0].noParticipants);
      } else {
        resolve(false);
      }
    })
  })
}

// Hämta antalet bokningar av en bandag.
function getNoOfBooked(trackdayID) {
  return new Promise(function(resolve, reject) {
    let sql = `
        SELECT count(*) as NoBooked
        FROM bookings
        WHERE trackdayID = ?`
    let values = [trackdayID];
    queryDatabase (sql, values, function(result) {
      if (result.length > 0) {
        resolve(result[0].NoBooked);
      } else {
        resolve(false);
      }
    })
  })
}

// Kontrollera att det finns minst en plats ledig.
function checkNoOfBookings(trackdayID) {
  return new Promise(function(resolve, reject) {
    noOfGroup(trackdayID)
    .then(function (noParticipants) {
      getNoOfBooked(trackdayID)
      .then(function(noBooked){
        let NoOfVacancies = noParticipants - noBooked;
        if (NoOfVacancies > 0) {
          resolve(true)
        } else {
          resolve(false);
        }
      })
    })
  })
}

// Utför bokningen i databasen.
function makeBooking(trackdayID, username) {
  return new Promise(function(resolve, reject) {
    let sql = `INSERT INTO bookings VALUES (null,?,?);`
    let values = [trackdayID, username];
    queryDatabase (sql, values, function (success) {
      resolve(success)
    })
  })
}

// Kontrollera om användaren är admin.
function isAdmin(username) {
  return new Promise(function(resolve, reject) {
    let sql = `SELECT isAdmin FROM users WHERE userName = ?`
    let values = [username];
    queryDatabase (sql, values, function(result) {
      if (result.length > 0) {
        if (result[0].isAdmin === 1) {
          resolve(true);
        } else {
        resolve(false);
        }
      } else {
        resolve(false);
      }
    })
  })
}

// För att skicka SQL-queries och ta emot data.
function queryDatabase(sql, values, callback) {
  db.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(
      sql, values, function (error, result, fields) {
      if (error) {
          result = false;
      }
      let columns = processFields(fields);
      callback(result, columns);
      connection.release();
    });
  });
}

// Lägger till salt och hashar lösenordet.
// https://hackernoon.com/setting-up-node-js-with-a-database-part-1-3f2461bdd77f
function saltHashPassword (password) {
  const salt = crypto.randomBytes(4).toString('hex');
  const hash = crypto
    .createHmac('sha512', salt)
    .update(password)
  return {
    salt,
    hash: hash.digest('hex')
  }
}

// Returerna kolumnnamn.
function processFields(fields) {
  let rows = [];
  if (typeof fields !== 'undefined') {
    var noRows = fields.length;
  } else {
    var noRows = 0;
  }
  for (var i = 0; i < noRows; i++) {
    rows[i] = fields[i].name;
  }
  return rows;
}
