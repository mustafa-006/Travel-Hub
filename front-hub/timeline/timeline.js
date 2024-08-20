// jQuery for dashboard toggle
const mobileScreen = window.matchMedia("(max-width: 990px)");
$(document).ready(function () {
    $(".dashboard-nav-dropdown-toggle").click(function () {
        $(this).closest(".dashboard-nav-dropdown")
            .toggleClass("show")
            .find(".dashboard-nav-dropdown")
            .removeClass("show");
        $(this).parent()
            .siblings()
            .removeClass("show");
    });
    $(".menu-toggle").click(function () {
        if (mobileScreen.matches) {
            $(".dashboard-nav").toggleClass("mobile-show");
        } else {
            $(".dashboard").toggleClass("dashboard-compact");
        }
    });
});
// Logout function
function out() {
    Swal.fire({
        title: "You will log out",
        text: "Then you can sign in",
        icon: "info",
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = 'http://localhost:9999/loginPage';
        }
    });
}

// Create container and buttons
const container = document.querySelector('.container');

const startRecordingButton = document.createElement('button');
startRecordingButton.id = 'startRecording';
startRecordingButton.textContent = 'Start Recording';

const stopRecordingButton = document.createElement('button');
stopRecordingButton.id = 'stopRecording';
stopRecordingButton.textContent = 'Stop Recording';
stopRecordingButton.disabled = true;

const audioPlayback = document.createElement('audio');
audioPlayback.id = 'audioPlayback';
audioPlayback.controls = true;

document.addEventListener('DOMContentLoaded', function() {
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');

    const profileName = document.getElementById('profile-name');
    if (profileName) {
        profileName.textContent = `${firstName} ${lastName}`;
    }

    loadPosts(); 
});

function createPost(postText, postImage) {
    const postElement = document.createElement('div');
    postElement.className = 'post';

    const textElement = document.createElement('p');
    textElement.textContent = postText;
    postElement.appendChild(textElement);

    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');

    const nameElement = document.createElement('p');
    nameElement.textContent = `${firstName} ${lastName}`;
    postElement.appendChild(nameElement);
    nameElement.style.position = "absolute";
    nameElement.style.top = 0;
    nameElement.style.left = 0;

    const postTimestamp = document.createElement('span');
    postTimestamp.textContent = new Date().toLocaleString();
    postTimestamp.className = 'post-timestamp';
    postElement.appendChild(postTimestamp);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.style.position = 'absolute';
    deleteButton.style.top = '10px';
    deleteButton.style.left = '10px';

    deleteButton.onclick = function() {
        Swal.fire({
            title: 'Are you sure?',
            text: "Are you sure you want to delete this post?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                postElement.remove();
                savePosts();
                Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
            }
        });
    };
    postElement.appendChild(deleteButton);

    if (postImage) {
        const imgElement = document.createElement('img');
        imgElement.src = postImage;
        imgElement.style.width = '250px';
        imgElement.style.height = '250px';
        postElement.appendChild(imgElement);
    }

    // Like & Dislike buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'post-buttons';

    let likeCount = parseInt(localStorage.getItem(`${postText}-likes`)) || 0;
    let dislikeCount = parseInt(localStorage.getItem(`${postText}-dislikes`)) || 0;

    const updateButton = (button, count, iconName, iconNameActive, storageKey) => {
        button.innerHTML = `<ion-icon name="${iconName}"></ion-icon> <span>${count}</span>`;
        button.addEventListener('click', function () {
            count += 1;
            this.innerHTML = `<ion-icon name="${iconNameActive}"></ion-icon> <span>${count}</span>`;
            localStorage.setItem(storageKey, count);
            savePosts();
        });
    };

    // Create Like button
    const like = document.createElement('button');
    like.className = "like";
    updateButton(like, likeCount, "heart-outline", "heart", `${postText}-likes`);
    buttonsContainer.appendChild(like);

    // Create Dislike button
    const dislike = document.createElement('button');
    dislike.className = "dislike";
    updateButton(dislike, dislikeCount, "heart-dislike-outline", "heart-dislike", `${postText}-dislikes`);
    buttonsContainer.appendChild(dislike);

    postElement.appendChild(buttonsContainer);

    // Comment Section
    const commentSection = document.createElement('div');
    commentSection.className = 'comment-section';

    const commentTextArea = document.createElement('textarea');
    commentTextArea.className = 'post-textarea';
    commentTextArea.placeholder = 'Write your comment...';
    commentSection.appendChild(commentTextArea);

    const startRecording = startRecordingButton.cloneNode(true);
    const stopRecording = stopRecordingButton.cloneNode(true);
    const audioPlay = document.createElement('audio');
    audioPlay.id = 'audioPlayback';
    audioPlay.controls = true;
    commentSection.appendChild(startRecording);
    commentSection.appendChild(stopRecording);
    commentSection.appendChild(audioPlay);

    const submitCommentButton = document.createElement('button');
    submitCommentButton.textContent = 'Submit Comment';
    submitCommentButton.style.backgroundColor = "#007bff";
    submitCommentButton.style.borderRadius = "14px";
    submitCommentButton.style.color = "#ddd";
    submitCommentButton.style.position = "absolute";
    submitCommentButton.style.width = "120px";
    submitCommentButton.style.height = "30px";
    submitCommentButton.style.fontSize = "13px";
    submitCommentButton.style.top = "109.8px";
    submitCommentButton.style.right = "0";
    commentSection.appendChild(submitCommentButton);

    const commentsList = document.createElement('div');
    commentsList.className = 'comments-list';
    postElement.appendChild(commentSection);
    postElement.appendChild(commentsList);

    submitCommentButton.onclick = function () {
        const commentText = commentTextArea.value.trim();
        const audioPlaybackUrl = audioPlay.src;

        if (commentText !== "" || audioPlaybackUrl) {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';

            // Add the user's name to the comment
            const nameElement = document.createElement('p');
            nameElement.textContent = `${firstName} ${lastName}`;
            nameElement.className = 'comment-name';
            commentElement.appendChild(nameElement);

            if (commentText !== "") {
                const commentContent = document.createElement('p');
                commentContent.textContent = commentText;
                commentElement.appendChild(commentContent);
            }

            if (audioPlaybackUrl) {
                const audioElement = document.createElement('audio');
                audioElement.src = audioPlaybackUrl;
                audioElement.controls = true;
                commentElement.appendChild(audioElement);
            }

            const timestamp = document.createElement('span');
            timestamp.textContent = new Date().toLocaleString();
            timestamp.className = 'comment-timestamp';
            commentElement.appendChild(timestamp);

            const deleteCommentButton = document.createElement('button');
            deleteCommentButton.textContent = 'Delete Comment';
            deleteCommentButton.className = 'delete-comment-button';
            deleteCommentButton.style.marginLeft = '10px';

            deleteCommentButton.onclick = function () {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "Do you really want to delete this comment?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'No, keep it'
                }).then((result) => {
                    if (result.isConfirmed) {
                        commentElement.remove();
                        savePosts();
                        Swal.fire('Deleted!', 'Your comment has been deleted.', 'success');
                    }
                });
            };

            commentElement.appendChild(deleteCommentButton);
            commentsList.prepend(commentElement);

            commentTextArea.value = '';
            audioPlay.src = '';
            savePosts();
        }
    };

    // Audio Recording
    let mediaRecorder;
    let audioChunks = [];

    startRecording.addEventListener('click', () => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            audioChunks = [];
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            mediaRecorder.addEventListener('dataavailable', event => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener('stop', () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                audioPlay.src = audioUrl;
                audioChunks = [];
            });

            stopRecording.disabled = false;
            startRecording.disabled = true;
        });
    });

    stopRecording.addEventListener('click', () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            stopRecording.disabled = true;
            startRecording.disabled = false;
        }
    });

    return postElement;
}


function savePosts() {
    const posts = [];
    document.querySelectorAll('.post').forEach(postElement => {
        const post = {
            text: postElement.querySelector('p').textContent,
            imageSrc: postElement.querySelector('img') ? postElement.querySelector('img').src : null,
            timestamp: postElement.querySelector('.post-timestamp').textContent,
            likes: postElement.querySelector('.like').textContent.trim(),
            dislikes: postElement.querySelector('.dislike').textContent.trim(),
            comments: []
        };

        postElement.querySelectorAll('.comment').forEach(commentElement => {
            const comment = {
                text: commentElement.querySelector('p') ? commentElement.querySelector('p').textContent : '',
                audioSrc: commentElement.querySelector('audio') ? commentElement.querySelector('audio').src : null,
                timestamp: commentElement.querySelector('.comment-timestamp').textContent
            };
            post.comments.push(comment);
        });

        posts.push(post);
    });
    localStorage.setItem('posts', JSON.stringify(posts));
}


function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.forEach(post => {
        const postElement = createPost(post.text, post.imageSrc ? post.imageSrc : null);
        
        const likeButton = postElement.querySelector('.like');
        const likeCount = parseInt(localStorage.getItem(`${post.text}-likes`)) || 0;
        likeButton.innerHTML = `<ion-icon name="heart-outline"></ion-icon> <span>${likeCount}</span>`;
        
        const dislikeButton = postElement.querySelector('.dislike');
        const dislikeCount = parseInt(localStorage.getItem(`${post.text}-dislikes`)) || 0;
        dislikeButton.innerHTML = `<ion-icon name="heart-dislike-outline"></ion-icon> <span>${dislikeCount}</span>`;
        
        post.comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';

            if (comment.text) {
                const commentContent = document.createElement('p');
                commentContent.textContent = comment.text;
                commentElement.appendChild(commentContent);
            }

            if (comment.audioSrc) {
                const audioElement = document.createElement('audio');
                audioElement.src = comment.audioSrc;
                audioElement.controls = true;
                commentElement.appendChild(audioElement);
            }

            const timestamp = document.createElement('span');
            timestamp.textContent = comment.timestamp;
            timestamp.className = 'comment-timestamp';
            commentElement.appendChild(timestamp);

            const deleteCommentButton = document.createElement('button');
            deleteCommentButton.textContent = 'Delete Comment';
            deleteCommentButton.className = 'delete-comment-button';
            deleteCommentButton.style.marginLeft = '10px';

            deleteCommentButton.onclick = function () {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "Do you really want to delete this comment?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'No, keep it'
                }).then((result) => {
                    if (result.isConfirmed) {
                        commentElement.remove();
                        savePosts();
                        Swal.fire('Deleted!', 'Your comment has been deleted.', 'success');
                    }
                });
            };

            commentElement.appendChild(deleteCommentButton);
            postElement.appendChild(commentElement);
        });

        document.body.appendChild(postElement); 
    });
}

        
document.getElementById('postButton').addEventListener('click', function() {
    const postText = document.getElementById('postText').value.trim();
    const postImage = document.getElementById('postImage').files[0];

    if (postText || postImage) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const postElement = createPost(postText, event.target.result);
            container.prepend(postElement);
            document.getElementById('postText').value = '';
            document.getElementById('postImage').value = '';
            savePosts(); 
        };

        if (postImage) {
            reader.readAsDataURL(postImage);
        } else {
            const postElement = createPost(postText, null);
            container.prepend(postElement);
            document.getElementById('postText').value = '';
            savePosts();
        }
    }
});

        loadPosts(); 

 // the routes
function toAboutUs(){
window.location.href = "../about/aboutus.html"
}
function toAboutMe(){
window.location.href = "../about/about-me/about-me.html"
}
function home(){
window.location.href = "./timeline.html"
}
function toProfile(){
    window.location.href = "../profile/profile.html"
}
function toGroubChat(){
    window.location.href = "http://localhost:5000/index"
}
function toStories(){
    window.location.href = "../stories/story.html"
}
function toServices(){
    window.location.href = "http://localhost:3000/bookingPage"
}
