/* Server js */
'use strict';

const log = console.log;

log("Server Started");

// import {Icon} from "./models/user";

const express = require('express');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser'); // middleware for parsing HTTP body from client
const session = require('express-session');
const {ObjectID} = require('mongodb');
const multer = require('multer');
const fs = require('fs');

// Import our mongoose connection
const {mongoose} = require('./db/mongoose');

// Import the models
const {User} = require('./models/user');

// express
const app = express();
// body-parser middleware setup.  Will parse the JSON and convert to object
app.use(bodyParser.json());
// parse incoming parameters to req.body
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));
// app.use("/css", express.static(__dirname + '/public/login_sys'));

// session
app.use(session({
    secret: 'somesecret',
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        secure: true,
        expires: 86400000,
        httpOnly: true
    }
}));

// Add our admin account
// new User({
//     username: "admin",
//     email: "admin@mail.com",
//     password: "admin",
//     isAdmin: true,
//     marker: false
// }).save().then((result) => {
//     log(result)
// });

function registerDefaults() {
    User.findOne({username: 'admin'}).then((user) => {
        log('happened1');
        if (!user) {
            new User({
                username: "admin",
                email: "admin@mail.com",
                password: "admin",
                isAdmin: true,
                marker: false
            }).save().then((result) => {
                log(result)
            });
        }
    }).catch((err) => {
        log('err1')
    });

    User.findOne({username: 'recent'}).then((user) => {
        log('happened2');
        if (!user) {
            new User({
                username: "recent",
                email: "recent@mail.com",
                password: "recent",
                isAdmin: false,
                marker: false
            }).save().then((result) => {
                log(result)
            });
        }
    }).catch((err) => {
        log('err2')
    });

    User.findOne({username: 'recommended'}).then((user) => {
        log('happened3');
        if (!user) {
            new User({
                username: "recommended",
                email: "recommended@mail.com",
                password: "recommended",
                isAdmin: false,
                marker: false
            }).save().then((result) => {
                log(result)
            });
        }
    }).catch((err) => {
        log('err3')
    })
}

// route for root; redirect to login
app.get('/', (req, res) => {
    registerDefaults();
    res.redirect('index')
});

// route for login
app.route('/index')
    .get((req, res) => {
        res.sendFile(__dirname + '/public/index/index.html');
    });

// User login
app.post('/user/login', (req, res) => {
    // log("login_server");
    const username = req.body.username;
    const password = req.body.password;

    User.findByUsernamePassword(username, password).then((user) => {
        if (!user) {
            // No such a user or wrong password.
            res.statusMessage = "Authentication failed";
            res.status(400).send()
        } else {
            req.session.user = user._id;
            if (user.isAdmin) {
                res.statusMessage = "true";
            } else {
                res.statusMessage = "false";
            }
            res.send(user)
            // res.redirect('index')
        }
    }).catch((error) => {
        res.statusMessage = "Authentication failed";
        res.status(400).send()
        // res.status(400).redirect('login_sys/login')
    })
});

// Sign up
app.post('/user/sign_up', (req, res) => {

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const isAdmin = req.body.is_admin;

    User.findOne({username: username}).then((user) => {
        if (!user) {
            // log("creating...");
            const userSchema = new User({
                username: username,
                email: email,
                password: password,
                isAdmin: isAdmin,
                marker: false
            });
            // log("saving...");
            userSchema.save().then((result) => {
                res.send(result)
            }).catch((error) => {
                res.statusMessage = "Not a valid email";
                res.status(400).send(error)
            })
        } else {
            // Duplicate user found
            res.statusMessage = "Username already used";
            res.status(400).send()
        }
    }).catch((error) => {
        res.statusMessage = "Cannot sign up";
        res.status(500).send(error)
    })

});


// Log out
app.get('/user/logout', (req, res) => {
    req.session.user = null;
    res.send()
});


// Get user by username
app.get('/user/:username', (req, res) => {
    const username = req.params.username;

    User.findOne({username: username}).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            res.send(user)
        }
    }).catch((error) => {
        res.status(400).send(error)
    })
});

// Get all users information
// Uses for admin
app.get('/users', (req, res) => {
    User.find().then((user) => {
        // log(user);
        // res.type('application/json');
        // res.send({user})
        res.json(user)
    }, (error) => {
        res.status(400).send(error)
    })
});


app.get('/user', (req, res) => {
    const id = req.session.user;
    log(id);

    User.findById(id).then((user) => {
        res.send({user})
    }, (error) => {
        res.status(400).send(error)
    })
});


app.get('/user/:id', (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }
    User.findById(id).then((user) => {
        log(user);
        res.send(user)
    }, (error) => {
        res.status(400).send(error)
    })
});

// Delete a user, admin use only
app.delete('/user/:username', (req, res) => {
    const username = req.params.username;

    User.findOneAndDelete({username: username}).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            res.send({user})
        }
    }).catch((error) => {
        res.status(400).send(error)
    })
});

app.delete('/user/:id', (req, res) => {
    const id = req.params.id;
    User.findByIdAndDelete(id).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            res.send({user})
        }
    }).catch((error) => {
        res.status(400).send(error)
    })
});

// Change password
app.post('/user/password', (req, res) => {

    const id = req.session.user;
    const newPassword = req.body.password;

    User.findById(id).then((user) => {
        if (!user) {
            res.statusMessage = "You are not logged in";
            res.status(404).send()
        } else {
            user.password = newPassword;
            user.save().then((result) => {
                res.send(result)
            }).catch((error) => {
                res.status(400).send(error)
            })
        }
    }).catch((error) => {
        res.status(400).send(error)
    })

});


// Add new note
app.post('/user', (req, res) => {
    const id = req.session.user;

    User.findById(id).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            const notes = user.notes;
            const check = [];
            for (let i = 0; i < notes.length; i++) {
                if (notes[i].marker === true ||
                notes[i].id === req.body.id) {
                    check.push(req.body.id)
                }
            }
            if (check.length === 0) {
                notes.push({
                    title: req.body.title,
                    author: user.username,
                    date: req.body.date,
                    content: req.body.content,
                    marker: false
                });
            } else {
                const note = notes.id(check[0]);
                note.title = req.body.title;
                note.author = user.username;
                note.date = req.body.date;
                note.content = req.body.content;
                note.marker = false
            }
            res.send({user});
            user.save()
        }
        log('posted')
    }).catch((error) => {
        res.status(400).send(error)
    })
});

app.post('/user/:username', (req, res) => {
    User.findOne({username: req.params.username}).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            user.notes.push({
                title: req.body.title,
                author: user.username,
                date: req.body.date,
                content: req.body.content
            });
            res.send({user});
            user.save()
        }
        log('posted')
    }).catch((error) => {
        res.status(400).send(error)
    })
});

// Delete a note
app.delete('/user/:note_id', (req, res) => {
    const id = req.session.user;
    const nid = req.params.note_id;

    User.findById(id).then((user) => {
        // log(id);
        if (!user) {
            log("no such user");
            res.status(404).send()
        } else {
            user.notes.id(nid).remove();
            user.save();
            res.send({user})
        }
        log('deleted')
    }).catch((error) => {
        res.status(400).send(error)
    })
});

app.delete('/admin/:username', (req, res) => {
    const username = req.params.username;

    User.findOneAndDelete({username: username}).then((user) => {
        if (!user) {
            log('no');
            res.status(404).send()
        } else {
            res.send(user)
        }
    }).catch((error) => {
        log('error');
        res.status(400).send(error)
    })
});


// Delete a note from admin
app.delete('/admin/:username/:note_id', (req, res) => {
    const username = req.params.username;
    const nid = req.params.note_id;

    if (!ObjectID.isValid(nid)) {
        return res.status(404).send()
    }

    User.findOne({username: username}).then((user) => {
        const notes = [];
        for (let i = 0; i < user.notes.length; i++) {
            const note = user.notes[i];
            if (note.id !== nid) {
                notes.push(note)
            }
        }
        user.notes = notes;
        user.save().then((result) => {
            // log(restaurant);
            res.send(result)
        }, (error) => {
            res.status(400).send(error)
        })
    }).catch((error) => {
        res.status(400).send(error)
    });
});

app.delete('/user/:username/:note_id', (req, res) => {
    const username = req.params.username;
    const nid = req.params.note_id;

    if (!ObjectID.isValid(nid)) {
        return res.status(404).send()
    }

    User.findOne({username: username}).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            const notes = [];
            for (let i = 0; i < user.notes.length; i++) {
                const note = user.notes[i];
                if (note.id !== nid) {
                    notes.push(note)
                } else {
                    note.marker = true;
                    notes.push(note)
                }
            }
            user.notes = notes;
            user.save().then((result) => {
                res.send(result)
            }, (error) => {
                res.status(400).send(error)
            })
        }
    }).catch((error) => {
        res.status(400).send(error)
    });
});

// Get a note by note_id
app.get('/user/:id/:note_id', (req, res) => {
    const id = req.params.id;
    const nid = req.params.note_id;

    if (!ObjectID.isValid(id) || !ObjectID.isValid(nid)) {
        return res.status(404).send()
    }

    User.findById(id).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            const note = user.notes.id(nid);
            res.send({note})
        }
    }).catch((error) => {
        res.status(400).send(error)
    })
});

app.get('/user/:username/:note_id', (req, res) => {
    const username = req.params.username;
    const nid = req.params.note_id;

    User.findOne({username: username}).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            const note = user.notes.id(nid);
            res.send({note})
        }
    }).catch((error) => {
        res.status(400).send(error)
    })
});

app.post('/recent', (req, res) => {
    User.findOne({username: 'recent'}).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            const notes = user.notes;

            notes.push({
                title: req.body.title,
                author: req.body.author,
                date: req.body.date,
                content: req.body.content,
                marker: false
            });
            res.send({user});
            user.save()
        }
        log('posted')
    }).catch((error) => {
        res.status(400).send(error)
    })
});

app.get('/recent', (req, res) => {
    User.findOne({username: 'recent'}).then((user) => {
        res.send({user})
    }, (error) => {
        res.status(400).send(error)
    })
});

app.get('/marker', (req, res) => {
    const id = req.session.user;
    User.findById(id).then((user) => {
        for (let i = 0; i < user.notes.length; i++) {
            const note = user.notes[i];
            if (note.marker === true) {
                note.marker = false;
            }
        }
        user.save();
        res.send()
    }).catch((error) => {
        res.status(400).send(error)
    })
});

app.delete('/recent/:note_id', (req, res) => {
    const nid = req.params.note_id;

    if (!ObjectID.isValid(nid)) {
        return res.status(404).send()
    }

    User.findOne({username: 'recent'}).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            const notes = [];
            for (let i = 0; i < user.notes.length; i++) {
                const note = user.notes[i];
                if (note.id !== nid) {
                    notes.push(note)
                } else {
                    note.marker = true;
                    notes.push(note)
                }
            }
            user.notes = notes;
            user.save().then((result) => {
                res.send(result)
            }, (error) => {
                res.status(400).send(error)
            })
        }
    }).catch((error) => {
        res.status(400).send(error)
    });
});

app.delete('/recent/:title/:author/:date', (req, res) => {
    User.findOne({username: 'recent'}).then((user) => {
        const notes = [];
        for (let i = 0; i < user.notes.length; i++) {
            const note = user.notes[i];
            if (note.title !== req.params.title ||
                note.author !== req.params.author ||
                note.date !== req.params.date) {
                notes.push(note)
            }
        }
        user.notes = notes;
        user.save().then((result) => {
            // log(restaurant);
            res.send(result)
        }, (error) => {
            res.status(400).send(error)
        })
    }).catch((error) => {
        res.status(400).send(error)
    });
});

app.delete('/recent/:title/:author', (req, res) => {
    User.findOne({username: 'recent'}).then((user) => {
        const notes = [];
        for (let i = 0; i < user.notes.length; i++) {
            const note = user.notes[i];
            if (note.title !== req.params.title ||
                note.author !== req.params.author) {
                notes.push(note)
            }
        }
        user.notes = notes;
        user.save().then((result) => {
            // log(restaurant);
            res.send(result)
        }, (error) => {
            res.status(400).send(error)
        })
    }).catch((error) => {
        res.status(400).send(error)
    });
});

app.get('/marker/recent', (req, res) => {
    User.findOne({username: 'recent'}).then((user) => {
        for (let i = 0; i < user.notes.length; i++) {
            const note = user.notes[i];
            if (note.marker === true) {
                note.marker = false;
            }
        }
        user.save();
        res.send()
    }).catch((error) => {
        res.status(400).send(error)
    })
});

// Change user's icon
// app.post('/user/:username/icon', (req, res) => {
//     const username = req.params.username;
//     const icon = new Icon();
//     icon.img.data = req.files.data;
//     icon.img.contentType = 'image/png';
//
//     User.findOne({username: username}).then((user) => {
//         if (!user) {
//             res.status(400).send();
//         } else {
//             user.icon = icon;
//             user.save().then((result) => {
//                 res.send(result);
//             }).catch((error) => {
//                 res.status(400).send(error)
//             })
//         }
//     }).catch((error) => {
//         res.status(400).send(error)
//     })
// });

// Change user's icon
app.post('/user/:username/icon_file', (req, res) => {
    const username = req.params.username;
    const icon_file = req.body.icon_file;

    User.findOne({username: username}).then((user) => {
        if (!user) {
            res.status(400).send();
        } else {
            user.icon_file = icon_file;
            user.save().then((result) => {
                res.send(result);
            }).catch((error) => {
                res.status(400).send(error)
            })
        }
    }).catch((error) => {
        res.status(400).send(error)
    })
});

// Routes for recommended list
app.post('/recommended', (req, res) => {
    User.findOne({username: 'recommended'}).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            let check = 0;
            const notes = user.notes;
            for (let i=0; i<notes.length; i++) {
                if (notes[i].title === req.body.title) {
                    check++
                }
            }
            if (check === 0) {
                notes.push({
                    title: req.body.title,
                    author: req.body.author,
                    date: req.body.date,
                    content: req.body.content,
                    marker: false
                });
            }
            res.send({user});
            user.save()
        }
        log('posted')
    }).catch((error) => {
        res.status(400).send(error)
    })
});

app.get('/recommended', (req, res) => {
    User.findOne({username: 'recommended'}).then((user) => {
        res.send({user})
    }, (error) => {
        res.status(400).send(error)
    })
});

app.delete('/recommended/:note_id', (req, res) => {
    const nid = req.params.note_id;

    if (!ObjectID.isValid(nid)) {
        return res.status(404).send()
    }

    User.findOne({username: 'recommended'}).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            const notes = [];
            for (let i = 0; i < user.notes.length; i++) {
                const note = user.notes[i];
                if (note.id !== nid) {
                    notes.push(note)
                } else {
                    note.marker = true;
                    notes.push(note)
                }
            }
            user.notes = notes;
            user.save().then((result) => {
                res.send(result)
            }, (error) => {
                res.status(400).send(error)
            })
        }
    }).catch((error) => {
        res.status(400).send(error)
    });
});

app.delete('/recommended/:title/:author/:date', (req, res) => {
    User.findOne({username: 'recommended'}).then((user) => {
        const notes = [];
        for (let i = 0; i < user.notes.length; i++) {
            const note = user.notes[i];
            if (note.title !== req.params.title ||
                note.author !== req.params.author ||
                note.date !== req.params.date) {
                notes.push(note)
            }
        }
        user.notes = notes;
        user.save().then((result) => {
            // log(restaurant);
            res.send(result)
        }, (error) => {
            res.status(400).send(error)
        })
    }).catch((error) => {
        res.status(400).send(error)
    });
});

app.delete('/recommended/:title/:author', (req, res) => {
    User.findOne({username: 'recommended'}).then((user) => {
        const notes = [];
        for (let i = 0; i < user.notes.length; i++) {
            const note = user.notes[i];
            if (note.title !== req.params.title ||
                note.author !== req.params.author) {
                notes.push(note)
            }
        }
        user.notes = notes;
        user.save().then((result) => {
            // log(restaurant);
            res.send(result)
        }, (error) => {
            res.status(400).send(error)
        })
    }).catch((error) => {
        res.status(400).send(error)
    });
});

app.get('/marker/recommended', (req, res) => {
    User.findOne({username: 'recommended'}).then((user) => {
        for (let i = 0; i < user.notes.length; i++) {
            const note = user.notes[i];
            if (note.marker === true) {
                note.marker = false;
            }
        }
        user.save();
        res.send()
    }).catch((error) => {
        res.status(400).send(error)
    })
});


app.post('/recommend/:username/:nid', (req, res) => {
    const username = req.params.username;
    const nid = req.params.nid;

    const user = User.findOne({username: username});

    User.findOne({username: 'recommended'}).then((ru) => {
        log('start');
        for (let i = 0; i < user.notes.length; i++) {
            const note = user.notes[i];
            log('loop');
            if (note.id === nid) {
                log('found!');
                ru.notes.push(note);
                ru.save().then((result) => {
                    res.send(result)
                }).catch((error) => {
                    res.status(401).send(error)
                })
                // User.findOne({username:"recommended"}).then((ru) => {
                //     ru.notes.push(note);
                //     ru.save().then((result) => {
                //         res.send(result)
                //     }).catch((error) => {
                //         res.status(401).send(error)
                //     })
                // }).catch((error) => {
                //     res.status(402).send(error)
                // })
            }
        }
        res.status(405).send()
    }).catch((error) => {
        res.status(403).send(error)
    })
});

app.get('/admin/:username/:note_id', (req, res) => {
    const username = req.params.username;
    const nid = req.params.note_id;
    User.findOne({username: username}).then((user) => {
        user.marker = true;
        const notes = user.notes;
        for (let i=0; i<notes.length; i++) {
            const note = notes[i];
            if (note.id === nid) {
                note.marker = true
            }
        }
        user.save();
        res.send()
    }).catch((error) => {
        res.status(403).send(error)
    })
});

app.get('/admin/view', (req, res) => {
    User.findOne({marker: true}).then((user) => {
        res.send({ user });
        user.save()
    }).catch((error) => {
        res.status(403).send(error)
    })
});

app.get('/marker/note', (req, res) => {
    User.findOne({marker: true}).then((user) => {
        for (let i = 0; i < user.notes.length; i++) {
            const note = user.notes[i];
            if (note.marker === true) {
                note.marker = false;
            }
        }
        user.save();
        res.send()
    }).catch((error) => {
        res.status(400).send(error)
    })
});

app.get('/marker/user', (req, res) => {
    User.findOne({marker: true}).then((user) => {
        user.marker = false;
        user.save();
        res.send()
    }).catch((error) => {
        res.status(400).send(error)
    })
});

// Change a user's permission
app.post('/admin/set/:username', (req, res) => {
    const username = req.params.username;

    User.findOne({username: username}).then((user) => {
        if (user) {
            user.isAdmin = !user.isAdmin;
            user.save().then((result) => {
                res.send(result)
            }).catch((error) => {
                res.status(400).send()
            })
        } else {
            res.status(404).send()
        }
    }).catch((error) => {
        res.status(400).send(error)
    })
});

app.post('/recent/update', (req, res) => {
    User.findOne({username: 'recent'}).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            const notes = user.notes;
            for (let i=0; i<notes.length; i++) {
                const note = notes[i];
                if (note.title === req.body.title &&
                    note.author === req.body.author) {
                    notes.splice(i, 1);
                    i--
                }
            }
            notes.push({
                title: req.body.title,
                author: req.body.author,
                date: req.body.date,
                content: req.body.content,
                marker: false
            });
            user.save();
            res.send({ user })
        }
    }).catch((error) => {
        res.status(400).send(error)
    })
});

app.post('/recommended/update', (req, res) => {
    User.findOne({username: 'recommended'}).then((user) => {
        if (!user) {
            res.status(404).send()
        } else {
            const notes = user.notes;
            const check = notes.length;
            for (let i=0; i<notes.length; i++) {
                const note = notes[i];
                if (note.title === req.body.title &&
                    note.author === req.body.author) {
                    notes.splice(i, 1);
                    i--
                }
            }
            if (notes.length < check) {
                notes.push({
                    title: req.body.title,
                    author: req.body.author,
                    date: req.body.date,
                    content: req.body.content,
                    marker: false
                });
            }
            user.save();
            res.send({ user })
        }
    }).catch((error) => {
        res.status(400).send(error)
    })
});

app.post('/recent/delete', (req, res) => {
    const username = req.body.username;
    console.log(username);
    console.log('RUN');
    User.findOne({username: 'recent'}).then((user) => {
        const notes = user.notes;
        console.log(notes);
        for (let i=0; i<notes.length; i++) {
            const note = notes[i];
            if (note.author === username) {
                notes.splice(i, 1);
                i--;
                console.log('yyy')
            }
        }
        user.save();
        res.send({ user })
    }).catch((error) => {
        res.status(400).send(error)
    })
});

app.post('/recommended/delete', (req, res) => {
    const username = req.body.username;
    User.findOne({username: 'recommended'}).then((user) => {
        const notes = user.notes;
        for (let i=0; i<notes.length; i++) {
            const note = notes[i];
            if (note.author === username) {
                notes.splice(i, 1);
                i--
            }
        }
        user.save();
        res.send({ user })
    }).catch((error) => {
        res.status(400).send(error)
    })
});


// log(port);
app.listen(port, () => {
    log(`Listening on port ${port}...`)
});
