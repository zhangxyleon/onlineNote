/* Javascript of sign up page */

/* Selectors */
const buttonForm = document.querySelector('#buttonForm');
// const usernameBox = document.querySelector('#usernameInput');
const passwordBox = document.querySelector('#passwordInput');
const passwordConfirmBox = document.querySelector('#passwordInputConfirm');

const messageLabel = document.querySelector('#messageLabel');
const logOutButton = document.querySelector('#logOut');

logOutButton.addEventListener('click', logOut);

buttonForm.addEventListener('submit', changeAction);

/*** Functions that don't edit DOM.
 ***/

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

// Event that happens when sign up button be clicked
function changeAction(e) {
    e.preventDefault();

    const password = passwordBox.value;
    const passwordConfirm = passwordConfirmBox.value;

    // console.log("sign up");

    if (!checkValidPassword(password, passwordConfirm)) {
        showMessage("Passwords do not match");
    } else if (password.length < 6) {
        showMessage("Password too short")
    } else {
        const url = '/user/password';
        const request = new Request(url, {
            method: 'post',
            body: JSON.stringify({
                "password": password,
            }),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request).then(function (res) {
            if (res.status === 200) {
                // console.log(res.body);
                // document.cookie = "username="
                // loginSucceed()
                changeSucceed()
                // signUpSucceed(username, password)
            } else {
                // console.log(res.status);
                showMessage(res.statusText)
            }
        }).catch((error) => {
            console.log(error)
        });
    }

}

// Return true iff the password is valid.
function checkValidPassword(password1, password2) {
    return password1 === password2;
}

// Function to be executed after successfully signed up
function changeSucceed() {
    // const url = '/user/login';
    // const request = new Request(url, {
    //     method: 'post',
    //     body: JSON.stringify({"username": username, "password": password}),
    //     headers: {
    //         'Accept': 'application/json, text/plain, */*',
    //         'Content-Type': 'application/json'
    //     },
    // });
    // fetch(request).then(function(res) {
    //     if (res.status === 200) {
            window.location.href = "../index/index_logged_in.html"
    //     } else {
    //         console.log(res);
    //     }
    // }).catch((error) => {
    //     console.log(error)
    // });
}

/*** DOM functions ***/

// Show message to the page
function showMessage(text) {
    messageLabel.innerHTML = "";
    const textNode = document.createTextNode(text);
    messageLabel.appendChild(textNode);
}
