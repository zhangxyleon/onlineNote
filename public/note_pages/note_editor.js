"use strict";

tinymce.init({
    selector: 'textarea',
    height: 500,
    menubar: false,
    plugins: [
        'advlist autolink lists link image charmap print preview anchor textcolor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table contextmenu paste code help wordcount'
    ],
    toolbar: 'undo redo |  formatselect | bold italic backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',

});

let noteId = null;
// let numberofnotes = 0;
// class note
const note = function(title,content) {
    // this.username=username;
    this.id = noteId;
    this.title = title;
    this.author = null;
    this.date = null;
    this.content = content;
    // this.ID=username+numberofnotes;
    // numberofnotes++;
};

const author = [];
let firstEdit = true;

/* if we open a already exist note , we should insert its content and title to
    text_editor from. Since this needs server call to get user's saved note, we
    assume user writes a new note in this page in phase 1.
*/
//server call here
//get note of this user from server
//save text
const saveButton = document.querySelector('#save');
saveButton.addEventListener('click', saveFile);

const logOutButton = document.querySelector('#logOut');

document.addEventListener('DOMContentLoaded', load);
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

function load(e) {
    e.preventDefault();
    const url = '/user';

    fetch(url).then((res) => {
        if (res.status === 200) {
            return res.json()
        } else {
            alert('Could not get user')
        }
    }).then(function(json) {
        console.log(json);
        const notes = json.user.notes;
        author.push(json.user.username);
        console.log(json.user.notes);
        for (let i=0; i<notes.length; i++) {
            if (notes[i].marker === true) {
                firstEdit = false;
                noteId = notes[i]._id;
                console.log(noteId);
                fill(notes[i].title, notes[i].content);
            }
        }

        console.log('success');
    }).catch((error) => {
        console.log(error)
    });

    const url_ = '/marker';

    fetch(url_).catch((error) => {
        console.log(error)
    })
}



function saveFile() {
    //get title
    const title = document.querySelector('#title').value;
    //get text
    const content = tinyMCE.get('content').getContent();
    console.log(title);
    console.log(content);
    /*if this note already  exists , modify it
     since we don't make server call , we only handle new note
    */
    //Since usser needs to login to open this page, it needs servercall to get username from server
    //hardcode user name
    let newNote = new note(title, content);
    // then save note in server


    const date = new Date();
    let nowMonth = date.getMonth() + 1;
    let strDate = date.getDate();
    const separator = "-";
    if (nowMonth >= 1 && nowMonth <= 9) {
        nowMonth = "0" + nowMonth;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    newNote.date = date.getFullYear() + separator + nowMonth + separator + strDate;
    newNote.author = author[0];

    const url = '/user';

    console.log(newNote);
    console.log('save successfully');

    const request = new Request(url, {
        method: 'post',
        body: JSON.stringify(newNote),
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

    if (firstEdit) {
        const url_ = '/recent';

        const request_ = new Request(url_, {
            method: 'post',
            body: JSON.stringify(newNote),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request_).then(function (res) {
            if (res.status === 200) {
                console.log('Added note')
            } else {
                console.log('error')
            }
            console.log(res)
        }).catch((error) => {
            console.log(error)

        });
    } else {
        const url = '/recent/update';

        const request = new Request(url, {
            method: 'post',
            body: JSON.stringify(newNote),
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

        const url_ = '/recommended/update';

        const request_ = new Request(url_, {
            method: 'post',
            body: JSON.stringify(newNote),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request_).then(function (res) {
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

}

function fill(title, content) {
    document.querySelector('#title').value = title;
    console.log(content);
    setTimeout(function () {
        tinymce.activeEditor.setContent(content);
    }, 100);

}
