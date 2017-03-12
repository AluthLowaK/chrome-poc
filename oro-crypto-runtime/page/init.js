/**
 * Created by nayana on 3/3/17.
 */



//onLoad='set_1024f4();'
//onClick='rng_seed_time();' onKeyPress='rng_seed_time();'

var debug = true;

var debugPrint = function (str) {
    if (debug) return console.log(str);
};

var logoutHandler = function () {

};

var loginHandler = function () {

    var user = document.getElementById('registerEmail').value;
    var pass = document.getElementById('registerPass').value;
    var cid = chrome.runtime.id;
    login(cid, user, pass, function (err, result) {
        if (err !== null) {
            debugPrint(result);
            return false;
        }

        chrome.storage.sync.set({"reg": {status: 1}, result: { cid: cid, user: user }}, function () {
            if (chrome.runtime.error) {
                debugPrint(chrome.runtime.error);
                throw Exception("chrome exception");
            }
        });

        displayDashboardForm(cid, user);
    });
};

var registerHandler = function () {
    var user = document.getElementById('registerEmail').value;
    var pass = document.getElementById('registerPass').value;
    var cid = chrome.runtime.id;

    register(cid, user, pass, function (err, res) {
        if (err !== null) {
            throw new Exception("Problem creating account");
        }
        chrome.storage.sync.set({"reg" : {"status": res.status, "result": res.result}}, function () {
            if (chrome.runtime.error) {
                debugPrint(chrome.runtime.error);
                throw Exception("chrome exception");
            }

            displayLoginForm();

        });
    });
};

document.body.onload = function() {

    var regComplete = -1; var extraData = null;

    var regForm = document.getElementById("register-form");
    var loginForm = document.getElementById("login-form");

    var onLogoutEvent = document.getElementById("logout-btn").addEventListener("click", logoutHandler);
    var onLogoutEvent = document.getElementById("login-btn").addEventListener("click", loginHandler);
    var onLogoutEvent = document.getElementById("register-btn").addEventListener("click", registerHandler);


    chrome.storage.sync.get("reg", function (reg) {
        if (!chrome.runtime.error && reg.status !== undefined) {
            regComplete = reg.status;
            extraData = reg.result;
        }

        switch (regComplete) {
            case 0:
                displayLoginForm();
                break;
            case 1:
                displayDashboardForm(extraData.cid, extraData.user);
                break;
            default:
                displayRegisterForm();
                break;
        }
    });

    //register button event handler
    document.getElementById("register-btn").addEventListener("click", function() {

    });


};


var displayLoginForm = function () {
    var regForm = document.getElementById("register-form");
    regForm.style.display = "none";
    var loginForm = document.getElementById("login-form");
    loginForm.style.display = "block";
};

var displayRegisterForm = function () {
    var regForm = document.getElementById("register-form");
    regForm.style.display = "block";
    var loginForm = document.getElementById("login-form");
    loginForm.style.display = "none";
};

var displayDashboardForm = function (cid, user) {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "none";
    document.getElementById("dashboard-form").style.display = "block";

    document.getElementById("span-cid").innerText = cid;
    document.getElementById("span-user").innerText = user;
};

//takes user and pass, and post json into register function, adds chrome-runtime-id internally,
//TODO refactor move runtime id outside of the function
function register(cid, user, pass, cb) {
    var xhr = new XMLHttpRequest();
    var data = JSON.stringify({cid: cid, user: user, pass: pass});
    xhr.open("POST", "https://api.oro.world:3000/register", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            debugPrint(xhr.responseText);
            var resp = JSON.parse(xhr.responseText);
            cb(null, resp);
        }
    };
    xhr.send(data);
}

function login(cid, user, pass, cb) {
    var xhr = new XMLHttpRequest();
    var data = JSON.stringify({cid: cid, user: user, pass: pass});
    xhr.open("POST", "https://api.oro.world:3000/login", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            debugPrint(xhr.responseText);
            var resp = JSON.parse(xhr.responseText);
            return cb(null, resp);
        }
    };
    xhr.send(data);
}


function createWallet(cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.oro.world:3000/wallet", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            cb(xhr.responseText);
        }
    };
    xhr.send();
}


/*chrome.storage.sync.get("data", function(items) {
 if (!chrome.runtime.error && items.data !== undefined && items.data.session === 1) {
 document.getElementById("createWallet").style.display = "none";
 document.getElementById("waddr").innerText = items.data;

 document.getElementById("logout").addEventListener("click", function() {
 items.data.session = 0;
 chrome.storage.sync.set(items, function() {
 window.location.reload();
 });
 });

 } else {
 //document.getElementById("login-form").style.display = "block";
 //document.getElementById("newWallet").style.display = "none";
 }
 });*/

/*document.getElementById("login-btn").addEventListener("click", function() {
 document.getElementById("login-form").style.display = "none";
 document.getElementById("newWallet").style.display = "block";
 });

 document.getElementById("createWallet").addEventListener("click", function() {
 createWallet(function (d) {
 document.getElementById("waddr").innerText = d;
 var data = { raw: d, session: 1 };
 chrome.storage.sync.set({ "data" : data }, function() {
 if (chrome.runtime.error) {
 debugPrint("Runtime error.");
 }
 });
 });

 });


 */