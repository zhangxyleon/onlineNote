const recentNotes = document.querySelector('#recentNotes');
const recommendedNotes = document.querySelector('#recommendedNotes');
const logOutButton = document.querySelector('#logOut');
const adminButton = document.querySelector('#admin_button');

document.addEventListener('DOMContentLoaded', load);
recentNotes.addEventListener('click', viewRecent);
recommendedNotes.addEventListener('click', viewRecommended);
logOutButton.addEventListener('click', logOut);

checkAdmin();

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

// Function to check if the current user is an admin
function checkAdmin() {
    fetch('/user').then((res) => {
        // console.log('321');
        if (res.status === 200) {
            return res.json()
        }
    }).then(function (json) {
        // console.log(json);
        const user = json.user;
        if (user) {
            if (user.isAdmin) {
                console.log('admin is here');
                adminButton.style.visibility = 'visible';
            }
        } else {
            window.location.href = "../index/index.html"
        }
    })
}

function load(e) {
    e.preventDefault();

    // load recent list
    const url = '/recent';

    fetch(url).then((res) => {
        if (res.status === 200) {
            return res.json()
        } else {
            alert('Could not get recent')
        }
    }).then(function (json) {
        // console.log(json);
        // if (json.user) {
        const notes = json.user.notes;
        // console.log(json.user.notes);
        let i = 0;
        if (notes.length > 10) {
            i = notes.length - 10
        }
        for (i; i < notes.length; i++) {
            loadRecentList(notes[i]._id, notes[i].title, notes[i].content)
        }
        // }
        // console.log('success');
    }).catch((error) => {
        console.log(error)
    });

    //load recommended list
    const url_ = '/recommended';

    fetch(url_).then((res) => {
        if (res.status === 200) {
            return res.json()
        } else {
            alert('Could not get recent')
        }
    }).then(function (json) {
        // console.log(json);
        // if (json.user) {
        const notes = json.user.notes;
        // console.log(json.user.notes);
        let i = 0;
        if (notes.length > 10) {
            i = notes.length - 10
        }
        for (i; i < notes.length; i++) {
            loadRecommendedList(notes[i]._id, notes[i].title, notes[i].content)
        }
        // console.log('success');
        // }
    }).catch((error) => {
        console.log(error)
    })
}

// Click listener for items in "Recent Block"
function viewRecent(e) {
    // if (e.target.parentElement.parentElement.parentElement.classList.contains('recentBlock')) {
    if (e.target.classList.contains('entry')) {
        const note = e.target.parentElement;
        console.log(note);

        const url = '/recent/' + note.id;
        console.log(url);
        const request = new Request(url, {
            method: 'delete',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request).then(function (res) {
            if (res.status === 200) {
                // log('Magic')
            } else {
                // console.log(res);
                alert('Could not load note')
            }
        }).catch((error) => {
            console.log(error)
        });
    }
}

function viewRecommended(e) {
    // if (e.target.parentElement.parentElement.parentElement.classList.contains('recommendedBlock')) {
    if (e.target.classList.contains('entry')) {
        const note = e.target.parentElement;
        console.log(note);

        const url = '/recommended/' + note.id;
        console.log(url);
        const request = new Request(url, {
            method: 'delete',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request).then(function (res) {
            if (res.status === 200) {
                // log('Magic')
            } else {
                // console.log(res);
                alert('Could not load note')
            }
        }).catch((error) => {
            console.log(error)
        });
    }
}

function loadRecentList(id, title, text) {
    const note = document.createElement('li');
    note.id = id;
    const noteContent = document.createElement('a');
    noteContent.setAttribute('href', '../note_pages/note_viewer_recent.html');
    const content = document.createTextNode(title);
    noteContent.append(content);
    noteContent.className = 'entry';

    const preview = document.createElement('p');
    preview.innerHTML = text;
    preview.className = 'content';
    const dot = document.createElement('p');
    dot.appendChild(document.createTextNode('......'));
    dot.className = 'dot';
    note.append(noteContent, preview);
    if (text.length > 0) {
        note.appendChild(dot)
    }

    if (recentNotes.childNodes.length === 0) {
        recentNotes.appendChild(note);
    } else if (recentNotes.childNodes.length < 10) {
        recentNotes.insertBefore(note, recentNotes.childNodes[0])
    } else {
        recentNotes.removeChild(recentNotes.childNodes[9]);
        recentNotes.insertBefore(note, recentNotes.childNodes[0])
    }
}

function loadRecommendedList(id, title, text) {
    const note = document.createElement('li');
    note.id = id;
    const noteContent = document.createElement('a');
    noteContent.setAttribute('href', '../note_pages/note_viewer_recommended.html');
    const content = document.createTextNode(title);
    noteContent.append(content);
    noteContent.className = 'entry';

    const preview = document.createElement('p');
    preview.innerHTML = text;
    preview.className = 'content';
    const dot = document.createElement('p');
    dot.appendChild(document.createTextNode('......'));
    dot.className = 'dot';
    note.append(noteContent, preview);
    if (text.length > 0) {
        note.appendChild(dot)
    }

    if (recommendedNotes.childNodes.length === 0) {
        recommendedNotes.appendChild(note);
    } else if (recommendedNotes.childNodes.length < 10) {
        recommendedNotes.insertBefore(note, recommendedNotes.childNodes[0])
    } else {
        recommendedNotes.removeChild(recommendedNotes.childNodes[9]);
        recommendedNotes.insertBefore(note, recommendedNotes.childNodes[0])
    }
}