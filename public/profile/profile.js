/* Javascript of profile page */

const log = console.log;

// Selectors
// const editClick = document.querySelector("#editInfo");
// const birthdaySpan = document.querySelector("#birthdaySpan");
// const addNewNote = document.querySelector("#addNewNote");
const notes = document.querySelector("#notes");
// const iconBig = document.querySelector('#userPicBig');
// const icon = document.querySelector('#userPic');
const personalInfo = document.querySelector('#personalInfo');
const logOutButton = document.querySelector('#logOut');

// Event listener
// editClick.addEventListener('click', editInfo);
// addNewNote.addEventListener('click', addNote);
notes.addEventListener('click', handler);
// iconBig.addEventListener('click', changeIcon);
document.addEventListener('DOMContentLoaded', load);
logOutButton.addEventListener('click', logOut);

checkAdmin();

/*** Functions that do not edit DOM ***/

function logOut(e) {
    e.preventDefault();

    fetch('/user/logout').then((res) => {
        if (res.status === 200) {
            window.location.href = "../index/index.html"
        } else {
            console.log("Error")
        }
    }).catch((error) => {
        console.log("Error2")
    })
}

function checkAdmin() {
    fetch('/user').then((res) => {
        // console.log('321');
        if (res.status === 200) {
            return res.json()
        } else {
            alert('Oops!');
            window.location.href = '../index/index.html';
        }
    }).then(function (json) {
        // console.log(json);
        const user = json.user;
        if (user.isAdmin) {
            if (!window.location.href.includes('profile_admin.html')) {
                window.location.href = '../profile/profile_admin.html';
            }
        }
    }).catch((error) => {
        alert('Something went wrong');
        window.location.href = '../index/index.html';
    });

}

// function editInfo(e) {
//     e.preventDefault();
//
//     if (!isEditing) {
//         changeTextToInput()
//     } else {
//         changeInputToText()
//     }
//
//     isEditing = !isEditing
// }

// function addNote(e) {
//     e.preventDefault();
//     addNewNoteEntry();
// }

// Handler that handles the icon change
// function changeIcon(e) {
//     e.preventDefault();
//
//     const fileInput = document.createElement('input');
//     fileInput.type = 'file';
//     fileInput.accept = '.jpg, .jpeg, .png, .bmp, .gif';
//     // fileInput.onchange = iconHandler();
//     fileInput.click();
//
//     fileInput.addEventListener('change', iconHandler);
//
// }

function handler(e) {

    // e.preventDefault();
    if (e.target.classList.contains('delete')) {
        const userToDelete = e.target.parentElement;
        //console.log(userToDelete)
        //need server call to delete user from data
        const username = personalInfo.getElementsByTagName('p')[0].getElementsByTagName('span')[0].innerText;
        log(username);

        const url = '/admin/' + username + '/' + userToDelete.id;
        log(url);
        const request = new Request(url, {
            method: 'delete',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request).then(function (res) {
            if (res.status === 200) {
                userToDelete.parentNode.removeChild(userToDelete);
                log('Deleted note')
            } else {
                // console.log(res);
                alert('Could not delete note')
            }
        }).catch((error) => {
            console.log(error)
        });

        const url_ = '/recent/' + userToDelete.getElementsByTagName('a')[0].getElementsByTagName('h2')[0].innerText + '/' + username + '/'
            + userToDelete.getElementsByTagName('p')[0].innerText;
        log(url_);
        const request_ = new Request(url_, {
            method: 'delete',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request_).then(function (res) {
            if (res.status === 200) {
                log('Deleted note')
            } else {
                // console.log(res);
                alert('Could not delete note')
            }
        }).catch((error) => {
            console.log(error)
        });

        const url__ = '/recommended/' + userToDelete.getElementsByTagName('a')[0].getElementsByTagName('h2')[0].innerText + '/' + username + '/'
            + userToDelete.getElementsByTagName('p')[0].innerText;
        log(url__);
        const request__ = new Request(url__, {
            method: 'delete',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request__).then(function (res) {
            if (res.status === 200) {
                log('Deleted note')
            } else {
                // console.log(res);
                alert('Could not delete note')
            }
        }).catch((error) => {
            console.log(error)
        });

    } else if (e.target.classList.contains('edit')) {
        const userToDelete = e.target.parentElement.parentElement;
        // log(userToDelete);
        const username = personalInfo.getElementsByTagName('p')[0].getElementsByTagName('span')[0].innerText;
        // log(username);

        const url = '/user/' + username + '/' + userToDelete.id;
        // log(url);
        const request = new Request(url, {
            method: 'delete',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request).then(function (res) {
            if (res.status === 200) {
                log('Magic')
            } else {
                // console.log(res);
                alert('Could not delete note')
            }
        }).catch((error) => {
            console.log(error)
        });
    } else if (e.target.classList.contains('entry')) {
        const userToDelete = e.target.parentElement.parentElement;
        // log(userToDelete);
        const username = personalInfo.getElementsByTagName('p')[0].getElementsByTagName('span')[0].innerText;
        // log(username);

        const url = '/user/' + username + '/' + userToDelete.id;
        // log(url);
        const request = new Request(url, {
            method: 'delete',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request).then(function (res) {
            if (res.status === 200) {
                log('Magic')
            } else {
                // console.log(res);
                alert('Could not delete note')
            }
        }).catch((error) => {
            console.log(error)
        });
    }
}

function load(e) {
    // log('success');
    e.preventDefault();

    // Login status checker
    fetch('/user').then((res) => {
        if (res.status === 200) {
            return res.json()
        } else {
            alert('Oops!');
            window.location.href = '../index/index.html';
        }
    }).then(function (json) {
        const user = json.user;
        if (!user) {
            alert('Login time out!');
            window.location.href = '../index/index.html';
        }
    }).catch((error) => {
        // alert('Login time out 2!');
        // window.location.href = '../index/index.html';
    });

    const url = '/user';

    fetch(url).then((res) => {
        if (res.status === 200) {
            return res.json()
        } else {
            alert('Could not get user')
        }
    }).then(function (json) {
        log(json);
        const user = json.user;
        const notes = json.user.notes;
        log(json.user.notes);
        loadInfo(user.username, user.email);
        for (let i = 0; i < notes.length; i++) {
            addNewNoteEntry(notes[i]._id, notes[i].title, notes[i].author, notes[i].date, notes[i].content)
        }
    }).catch((error) => {
        console.log(error)
    })
}


/*** DOM functions ***/

// // Changes the birthday text to a input box
// function changeTextToInput() {
//     birthdaySpan.innerHTML = '';
//     inputBox = document.createElement('input');
//     inputBox.placeholder = "yyyy-mm-dd";
//     birthdaySpan.appendChild(inputBox);
//
//     editClick.textContent = "Save";
// }
//
// // Changes and save the newly input birthday
// function changeInputToText() {
//     birthdayText = inputBox.value;
//     inputBox = null;
//     const textNode = document.createTextNode(birthdayText);
//     birthdaySpan.innerHTML = '';
//     birthdaySpan.appendChild(textNode);
//
//     editClick.textContent = "Edit";
//     saveBirthday(birthdayText);
// }

// // Change the icon of user
// function iconHandler(e) {
//     // iconBig.setAttribute('src', e.target.files[0].name);
//     // icon.setAttribute('src', e.target.files[0].name);
//     log("123");
//     const fileName = e.target.files[0].name;
//
//     log(fileName);
//     const username = personalInfo.getElementsByTagName('p')[0].getElementsByTagName('span')[0].innerText;
//
//     const url = '/user/' + username + "/icon_file";
//     log(url);
//     const request = new Request(url, {
//         method: 'post',
//         body: JSON.stringify({"icon_file": fileName}),
//         headers: {
//             'Accept': 'application/json, text/plain, */*',
//             'Content-Type': 'application/json'
//         },
//     });
//     fetch(request).then(function (res) {
//         console.log(res);
//         refreshImage()
//     }).catch((error) => {
//         console.log(error)
//     });
// }
//
// function refreshImage() {
//     const username = personalInfo.getElementsByTagName('p')[0].getElementsByTagName('span')[0].innerText;
//
//     fetch('/user/' + username).then((user) =>{
//         if (!user) {
//             log("error");
//         } else {
//             const iconFileName = user.iconFile;
//             iconBig.setAttribute('src', iconFileName);
//         }
//     }).catch((error) => {
//         log(error)
//     });
// }

// Adds a new note to the list of notes
// This is only for the test button.
// The real function needs the response of the "save" button in note_editor.
function addNewNoteEntry(nid, ntitle, nauthor, ndate, ncontent) {
    const noteList = notes.getElementsByTagName('div');

    const newNote = document.createElement('div');
    newNote.className = 'note';
    newNote.id = nid;

    const title = document.createElement('a');
    title.setAttribute('href', '../note_pages/note_viewer.html');
    const titleText = document.createElement('h2');
    titleText.className = 'entry';
    const titleText_ = document.createTextNode(ntitle);
    // titleText_ will be the tile record from the note_editor.
    titleText.append(titleText_);
    title.append(titleText);

    const dateStr = document.createElement('p');
    dateStr.className = 'date';

    const dateStr_ = document.createTextNode(ndate);
    dateStr.append(dateStr_);

    const content = document.createElement('p');
    content.className = 'noteTexts';
    content.innerHTML = ncontent;

    const edit = document.createElement('a');
    edit.setAttribute('href', '../note_pages/note_editor.html');
    const editButton = document.createElement('button');
    editButton.className = 'edit';
    const editButton_ = document.createTextNode('Edit');
    editButton.append(editButton_);
    edit.append(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete';
    const deleteButton_ = document.createTextNode('Delete');
    deleteButton.append(deleteButton_);

    newNote.append(title);
    newNote.append(dateStr);
    newNote.append(content);
    newNote.append(edit);
    newNote.append(deleteButton);
    notes.insertBefore(newNote, noteList[1]);
}

function loadInfo(newUsername, newEmail) {
    const username = personalInfo.getElementsByTagName('p')[0];
    const email = personalInfo.getElementsByTagName('p')[1];
    username.getElementsByTagName('span')[0].append(document.createTextNode(newUsername));
    email.getElementsByTagName('span')[0].append(document.createTextNode(newEmail))
}


// // Saves the birthday to user info
// function saveBirthday(birthday) {
//
// }
