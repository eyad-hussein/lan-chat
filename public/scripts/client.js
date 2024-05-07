const socket = io();

const messages = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input");
const ul = document.querySelector("ul");
const ip = window.location.hostname;
const nickname = prompt("What is your nickname?") || ip;
socket.emit("nickname", nickname);

input.focus();

form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (input.value) {
        const message_to_send = { 'msg': input.value }
        socket.emit("chat message", message_to_send);
        input.value = "";
    }
});

socket.on("chat message", function (received_message) {
    appendMessage(received_message);
    ul.scrollTop = ul.scrollHeight;
    window.scrollTo(0, document.body.scrollHeight);

});

socket.on("chat history", function (history) {
    history.forEach(function (received_message) {
        received_message = received_message[0]; // so weird
        appendMessage(received_message);
        ul.scrollTop = ul.scrollHeight;
        window.scrollTo(0, document.body.scrollHeight);
    });
});

// define a function that takes as input the received_message and appends the li to messages
function appendMessage(received_message) {
    const item = document.createElement("li");
    item.innerHTML = `
    <div class='nickname'>${received_message['nickname']}</div>
    <p>${received_message['msg']}</p>
    <div class='time_stamp'>${received_message['time_stamp']}</div>
    `;
    if (received_message['nickname'] === nickname) {
        item.setAttribute("class", "me");
    } else {
        item.setAttribute("class", "others");
    }
    messages.appendChild(item);
}