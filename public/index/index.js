const recentNotes = document.querySelector('#recentNotes');
const recommendedNotes = document.querySelector('#recommendedNotes');

document.addEventListener('DOMContentLoaded', load);

checkLoginStatus();


function checkLoginStatus() {
    fetch('/user').then((res) => {
        // console.log('321');
        if (res.status === 200) {
            return res.json()
        }
    }).then(function (json) {
        // console.log(json);
        const user = json.user;
        if (user) {
            window.location.href = '../index/index_logged_in.html';
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
        // console.log('success');
        // }
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


function loadRecentList(id, title, text) {
    const note = document.createElement('li');
    note.id = id;
    const noteContent = document.createElement('a');
    noteContent.setAttribute('href', '../login_sys/login.html');
    const content = document.createTextNode(title);
    noteContent.append(content);

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
    noteContent.setAttribute('href', '../login_sys/login.html');
    const content = document.createTextNode(title);
    noteContent.append(content);

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