const socket = io();

const chatMessages = document.querySelector(".chat-messages");
const chatForm = document.getElementById("chat-form");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");


const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("joinRoom", { username, room });


socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Listen for new messages
socket.on("message", (message) => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});


chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.msg.value;
  socket.emit("chatMessage", message);
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});


function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
                    <p class="text">${message.text}</p>`;

  chatMessages.appendChild(div);

  // Save the message to localStorage
  saveMessageToLocalStorage(message);
}

function saveMessageToLocalStorage(message) {
 // Get existing messages from localStorage
  const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];


  messages.push({
    ...message,
    timestamp: new Date().toISOString() // Store the current timestamp
  });

  // Save the updated messages list back to localStorage
  localStorage.setItem("chatMessages", JSON.stringify(messages));
}

// Load messages from localStorage when the page loads
function loadMessages() {
  
  const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];

  // Filter out messages older than 3 days
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days in milliseconds
  const recentMessages = messages.filter(message => new Date(message.timestamp) > threeDaysAgo);

  recentMessages.forEach(message => {
    outputMessage(message);
  });
}

// Clean up old messages from localStorage
function cleanUpOldMessages() {
  
  const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];

  
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days in milliseconds
  const recentMessages = messages.filter(message => new Date(message.timestamp) > threeDaysAgo);

  localStorage.setItem("chatMessages", JSON.stringify(recentMessages));
}


document.addEventListener("DOMContentLoaded", () => {
  loadMessages();
  cleanUpOldMessages();
});


function outputRoomName(room) {
  roomName.innerText = room;
}


function outputUsers(users) {
  userList.innerHTML = `${users
    .map(user => `<li>${user.username}</li>`)
    .join("")}`;
}

