const userEntries = document.querySelector('#users');
const logOutButton = document.querySelector('#logOut');
const recommendedEntries = document.querySelector('#recommended');
//console.log(userEntries)
userEntries.addEventListener('click', handler);
logOutButton.addEventListener('click', logOut);
recommendedEntries.addEventListener('click', handler2);

let currentId;

listRecommended();
listAllUsers();

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

function handler(e) {
    if (e.target.classList.contains('delete_user')) {
        const userToDelete = e.target.parentElement.parentElement.childNodes[0].childNodes[1].textContent;
        // console.log(userToDelete);
        const url = '/admin/' + userToDelete;
        const request = new Request(url, {
            method: 'delete',
            // body: JSON.stringify({"username": username, "password": password}),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request).then(function (res) {
            if (res.status === 200) {
                listAllUsers()
            } else {
                // console.log(res);
                alert('Could not delete user')
            }
        }).catch((error) => {
            console.log(error)
        });

        const url_ = '/recent/delete';
        console.log(url_);
        const request_ = new Request(url_, {
            method: 'post',
            body: JSON.stringify({username: userToDelete}),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request_).catch((error) => {
            console.log(error)
        });

        const url__ = '/recommended/delete';
        console.log(url__);
        const request__ = new Request(url__, {
            method: 'post',
            body: JSON.stringify({username: userToDelete}),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request__).then(function (res) {
            if (res.status === 200) {
                listRecommended()
            } else {
                // console.log(res);
                alert('Could not delete user')
            }
        }).catch((error) => {
            console.log(error)
        });
    }
    if (e.target.classList.contains('delete_note')) {
        const noteToDelete = e.target.parentElement.parentElement;
        const userOfNote = noteToDelete.parentElement.parentElement.childNodes[0].childNodes[1].textContent;
        console.log(userOfNote);
        const noteId = noteToDelete.childNodes[0].textContent;
        console.log(noteId);
        // noteToDelete.parentNode.removeChild(noteToDelete)

        const url = '/admin/' + userOfNote + "/" + noteId;
        const request = new Request(url, {
            method: 'delete',
            // body: JSON.stringify({"username": username, "password": password}),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request).then(function (res) {
            if (res.status === 200) {
                listAllUsers()
            } else {
                // console.log(res);
                alert('Could not delete note')
            }
        }).catch((error) => {
            console.log(error)
        });


        const url_ = '/recent/' + noteToDelete.childNodes[1].textContent + '/' + userOfNote;
        console.log(url_);
        const request_ = new Request(url_, {
            method: 'delete',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request_).then(function (res) {
            if (res.status === 200) {
                listRecommended();
                console.log('Deleted note')
            } else {
                // console.log(res);
                alert('Could not delete note')
            }
        }).catch((error) => {
            console.log(error)
        });


        const url__ = '/recommended/' + noteToDelete.childNodes[1].textContent + '/' + userOfNote;
        console.log(url__);
        const request__ = new Request(url__, {
            method: 'delete',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request__).then(function (res) {
            if (res.status === 200) {
                listRecommended();
                console.log('Deleted note')
            } else {
                // console.log(res);
                alert('Could not delete note')
            }
        }).catch((error) => {
            console.log(error)
        });
    }
    if (e.target.classList.contains('recommend')) {
        const noteToDelete = e.target.parentElement.parentElement;
        const userOfNote = noteToDelete.parentElement.parentElement.childNodes[0].childNodes[1].textContent;
        console.log(userOfNote);
        const noteId = noteToDelete.childNodes[0].textContent;
        console.log(noteId);
        const url = '/user/' + userOfNote;

        fetch(url).then((res) => {
            if (res.status === 200) {
                return res.json()
            } else {
                alert('Could not get user')
            }
        }).then(function (json) {
            console.log(json);
            const notes = json.notes;
            console.log(json.notes);
            for (let i = 0; i < notes.length; i++) {
                if (notes[i]._id === noteId) {
                    const note = notes[i];
                    addRecommended(note.title, note.author, note.date, note.content);
                    console.log('success');
                    listAllUsers();
                    listRecommended()
                }
            }
        }).catch((error) => {
            console.log(error)
        });
    }
    if (e.target.classList.contains('title')) {
        const noteToDelete = e.target.parentElement.parentElement.parentElement;
        const userOfNote = noteToDelete.parentElement.parentElement.childNodes[0].childNodes[1].textContent;
        console.log(userOfNote);
        const noteId = noteToDelete.childNodes[0].textContent;
        console.log(noteId);
        const url = '/admin/' + userOfNote + '/' + noteId;

        fetch(url).catch((error) => {
            console.log(error)
        });
    }
    if (e.target.classList.contains('permission')) {
        const userToSet = e.target.parentElement.parentElement.childNodes[0].childNodes[1].textContent;
        // console.log(userToDelete);
        const url = '/admin/set/' + userToSet;
        const request = new Request(url, {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request).then(function (res) {
            if (res.status === 200) {
                listAllUsers()
            } else {
                // console.log(res);
                alert('Could not set user as admin')
            }
        }).catch((error) => {
            console.log(error)
        });
    }
}

function checkAccess() {
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
        currentId = user._id;
        if (!user.isAdmin) {
            alert('You have no access to this page!');
            window.location.href = '../index/index.html';
        }
    }).catch((error) => {
        alert('You have no access to this page!');
        window.location.href = '../index/index.html';
    });
}

function handler2(e) {
    if (e.target.classList.contains('remove')) {
        const noteToDelete = e.target.parentElement.parentElement;
        // const userOfNote = noteToDelete.parentElement.parentElement.childNodes[0].childNodes[1].textContent;
        // console.log(userOfNote);
        const noteId = noteToDelete.childNodes[0].textContent;
        console.log(noteId);
        // noteToDelete.parentNode.removeChild(noteToDelete)

        const url = '/admin/recommended/' + noteId;
        const request = new Request(url, {
            method: 'delete',
            // body: JSON.stringify({"username": username, "password": password}),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request).then(function (res) {
            if (res.status === 200) {
                // listAllUsers();
                listRecommended();
            } else {
                // console.log(res);
                alert('Could not delete note')
            }
        }).catch((error) => {
            console.log(error)
        });
    }
    if (e.target.classList.contains('title')) {
        const noteToDelete = e.target.parentElement.parentElement.parentElement;
        const noteId = noteToDelete.childNodes[0].textContent;
        console.log(noteId);
        const url = '/admin/recommended/' + noteId;

        fetch(url).catch((error) => {
            console.log(error)
        });
    }
}

function listAllUsers() {
    // console.log('123');

    checkAccess();


    fetch('/users')
        .then((res) => {
            if (res.status === 200) {
                return res.json()
            } else {
                alert('Could not get users')
            }
        })
        .then((json) => {
            // console.log(json);
            userEntries.innerHTML = "";
            for (let i = 0; i < json.length; i++) {
                const userData = json[i];
                if (userData.username === 'recent' || userData.username === 'recommended') {
                    continue
                }
                const userNameText = document.createTextNode('Username: ');
                const userName = document.createTextNode(userData.username);
                const nameSpan = document.createElement('span');
                nameSpan.appendChild(userName);
                const p1 = document.createElement('p');
                p1.append(userNameText, nameSpan);

                const button = document.createElement('button');
                button.appendChild(document.createTextNode('Delete'));
                button.className = "delete_user";

                const groupText = document.createTextNode('Group: ');
                let group;
                let permissionBtnText;
                if (userData.isAdmin) {
                    group = 'admin';
                    permissionBtnText = 'Set as user'
                } else {
                    group = 'user';
                    permissionBtnText = 'Set as admin'
                }
                const groupNode = document.createTextNode(group);
                const p2 = document.createElement('p');
                p2.append(groupText, groupNode);

                const permissionButton = document.createElement('button');
                permissionButton.appendChild(document.createTextNode(permissionBtnText));
                permissionButton.className = 'permission';

                if (userData._id === currentId) {
                    button.disabled = true;
                    permissionButton.disabled = true;
                }

                const buttonLine = document.createElement('div');
                buttonLine.append(button, permissionButton);

                const h4 = document.createElement('h4');
                h4.appendChild(document.createTextNode('Notes:'));

                const th1 = document.createElement('th');
                th1.appendChild(document.createTextNode('noteID'));
                const th2 = document.createElement('th');
                const title = document.createTextNode('Title');
                th2.appendChild(title);
                const th3 = document.createElement('th');
                th3.appendChild(document.createTextNode('Add To Recommended'));
                const th4 = document.createElement('th');
                th4.appendChild(document.createTextNode('Delete'));

                const tr = document.createElement('tr');
                tr.appendChild(th1);
                tr.appendChild(th2);
                tr.appendChild(th3);
                tr.appendChild(th4);

                const table = document.createElement('table');
                table.appendChild(tr);

                for (let j = 0; j < userData.notes.length; j++) {
                    const note = userData.notes[j];

                    const noteId = document.createTextNode(note._id);
                    const title = document.createTextNode(note.title);
                    const titleStrong = document.createElement('strong');
                    const a = document.createElement('a');
                    a.className = 'title';
                    a.appendChild(title);
                    a.href = '../note_pages/note_viewer_admin.html';
                    titleStrong.appendChild(a);

                    const recommendButton = document.createElement('button');
                    recommendButton.appendChild(document.createTextNode('recommend'));
                    recommendButton.className = 'recommend';

                    const deleteButton = document.createElement('button');
                    deleteButton.appendChild(document.createTextNode('delete'));
                    deleteButton.className = 'delete_note';

                    const row = document.createElement('tr');
                    const td1 = document.createElement('td');
                    const td2 = document.createElement('td');
                    const td3 = document.createElement('td');
                    const td4 = document.createElement('td');
                    td1.appendChild(noteId);
                    td2.appendChild(titleStrong);
                    td3.appendChild(recommendButton);
                    td4.appendChild(deleteButton);
                    row.append(td1, td2, td3, td4);

                    table.appendChild(row);
                }

                const div = document.createElement('div');
                div.className = 'user';
                // div.appendChild(p1);
                // div.appendChild(button);
                // div.appendChild(h4);
                // div.appendChild(table);
                div.append(p1, p2, buttonLine, h4, table);

                userEntries.appendChild(div);
            }
        }).catch((error) => {
        console.log(error)
    })
}

function listRecommended() {
    checkAccess();

    const url = '/user/recommended';

    fetch(url)
        .then((res) => {
        if (res.status === 200) {
            return res.json()
        } else {
            alert('Could not get users')
        }
    }).then((json) => {
        recommendedEntries.innerHTML = "";

        const h1 = document.createElement('h4');
        h1.appendChild(document.createTextNode('Recommended'));

        const table = document.createElement('table');
        const th1 = document.createElement('th');
        th1.appendChild(document.createTextNode('noteID'));
        const th2 = document.createElement('th');
        th2.appendChild(document.createTextNode('Title'));
        const th3 = document.createElement('th');
        th3.appendChild(document.createTextNode('Remove From Recommended'));

        const tr = document.createElement('tr');
        tr.appendChild(th1);
        tr.appendChild(th2);
        tr.appendChild(th3);
        table.appendChild(tr);

        for (let i = 0; i < json.notes.length; i++) {
            const note = json.notes[i];

            const noteId = document.createTextNode(note._id);
            const title = document.createTextNode(note.title);
            const titleStrong = document.createElement('strong');
            const a = document.createElement('a');
            a.className = 'title';
            a.appendChild(title);
            a.href = '../note_pages/note_viewer_admin.html';
            titleStrong.appendChild(a);

            const recommendButton = document.createElement('button');
            recommendButton.appendChild(document.createTextNode('remove'));
            recommendButton.className = 'remove';

            const row = document.createElement('tr');
            const td1 = document.createElement('td');
            const td2 = document.createElement('td');
            const td3 = document.createElement('td');
            td1.appendChild(noteId);
            td2.appendChild(titleStrong);
            td3.appendChild(recommendButton);
            row.append(td1, td2, td3);

            table.appendChild(row);
        }

        const div = document.createElement('div');
        div.className = 'user';
        div.append(h1, table);

        recommendedEntries.append(div);
        });
}

function addRecommended(ntitle, nauthor, ndate, ncontent) {
    const url = '/recommended';

    const request = new Request(url, {
        method: 'post',
        body: JSON.stringify({
            title: ntitle,
            author: nauthor,
            date: ndate,
            content: ncontent
        }),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request).then(function (res) {
        if (res.status === 200) {
            console.log('Added note')
        } else {
            console.log('error')
        }
        console.log(res)
    }).catch((error) => {
        console.log(error)

    });
}
