"use strict";

const note = document.querySelector('#note');
const logOutButton = document.querySelector('#logOut');

document.addEventListener('DOMContentLoaded', load);
document.addEventListener('click', back);
logOutButton.addEventListener('click', logOut);

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

function back(e) {
    if (e.target.classList.contains('back')) {
        history.back(-1)
    }
}

function load(e) {
    e.preventDefault();
    const url = '/recommended';

    fetch(url).then((res) => {
        if (res.status === 200) {
            return res.json()
        } else {
            alert('Could not get user')
        }
    }).then(function(json) {
        console.log(json);
        const notes = json.user.notes;
        console.log(json.user.notes);
        for (let i=0; i<notes.length; i++) {
            if (notes[i].marker === true) {
                fill(notes[i].title, notes[i].author, notes[i].date, notes[i].content);
            }
        }

        console.log('success');
    }).catch((error) => {
        console.log(error)
    });
    const url_ = '/marker/recommended';

    fetch(url_).catch((error) => {
        console.log(error)
    })
}

function fill(ntitle, nauthor, ndate, ncontent) {
    const date = document.createElement('p');
    date.className = 'date';
    date.appendChild(document.createTextNode(ndate));

    const title = document.createElement('h1');
    title.className = 'title';
    title.appendChild(document.createTextNode(ntitle));

    const author = document.createElement('h4');
    author.className = 'author';
    author.appendChild(document.createTextNode(nauthor))

    const content = document.createElement('p');
    content.className = 'content';
    content.innerHTML = ncontent;

    note.append(date);
    note.append(title);
    note.append(author);
    note.append(content)
}
