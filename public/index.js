window.addEventListener("pageshow", function (event) {
    let historyTraversal = event.persisted || (typeof window.performance != "undefined" && window.performance.navigation.type === 2);
    if (historyTraversal) {
        window.location.reload();
    }
});

document.getElementById("username").addEventListener("focusin", () => {
    if (!document.getElementById("username").value)
        document.getElementById("usernameLabel").classList.toggle("active");
});

document.getElementById("username").addEventListener("focusout", () => {
    if (!document.getElementById("username").value)
        document.getElementById("usernameLabel").classList.toggle("active");
});

document.getElementById("password").addEventListener("focusin", () => {
    if (!document.getElementById("password").value)
        document.getElementById("passwordLabel").classList.toggle("active");
});

document.getElementById("password").addEventListener("focusout", () => {
    if (!document.getElementById("password").value)
        document.getElementById("passwordLabel").classList.toggle("active");
});
