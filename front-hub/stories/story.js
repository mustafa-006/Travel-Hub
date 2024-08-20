function getCurrentUserId() {
    return localStorage.getItem('currentUserId');
}

function convertImageToBase64(imageFile, callback) {
    const reader = new FileReader();
    reader.onloadend = function () {
        callback(reader.result);
    };
    reader.readAsDataURL(imageFile);
}

function createStory(storyTxt, storyImgBase64, timestamp, userId) {
    const storyElement = document.createElement("div");
    storyElement.className = "story";
    
    // Get user details from localStorage
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    
    // Create a container for user info
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';
    userInfo.textContent = `${firstName} ${lastName}`;
    storyElement.appendChild(userInfo);
    
    if (storyTxt) {
        const textElement = document.createElement('h5');
        textElement.textContent = storyTxt;
        storyElement.appendChild(textElement);
    }

    if (storyImgBase64) {
        const imgElement = document.createElement("img");
        imgElement.src = storyImgBase64;
        imgElement.style.width = '100%';
        imgElement.style.height = '200px';
        imgElement.style.objectFit = 'cover';
        storyElement.appendChild(imgElement);
    }

    const postTimestamp = document.createElement('span');
    postTimestamp.textContent = timestamp;
    postTimestamp.className = 'post-timestamp';
    storyElement.appendChild(postTimestamp);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Story';
    deleteButton.className = 'delete-story-button';
    deleteButton.style.marginTop = '10px';
    deleteButton.style.padding = '5px 10px';
    deleteButton.style.border = 'none';
    deleteButton.style.borderRadius = '5px';
    deleteButton.style.backgroundColor = '#e74c3c';
    deleteButton.style.color = 'white';
    deleteButton.style.cursor = 'pointer';
    
    deleteButton.onclick = function () {
        if (getCurrentUserId() !== userId) {
            Swal.fire({
                icon: 'error',
                title: 'Unauthorized',
                text: 'You do not have permission to delete this story.'
            });
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete this story?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                storyElement.remove();
                removeStoryFromLocalStorage(timestamp);
                Swal.fire(
                    'Deleted!',
                    'Your story has been deleted.',
                    'success'
                );
            }
        });
    };

    storyElement.appendChild(deleteButton);
    return storyElement;
}

function saveStoryToLocalStorage(text, imageFile, userId) {
    let stories = JSON.parse(localStorage.getItem('stories')) || [];
    const timestamp = new Date().toLocaleString();
    const expirationTime = new Date().getTime() + 86400 * 1000; // 24 hours

    if (imageFile) {
        convertImageToBase64(imageFile, (base64) => {
            stories.push({ text, image: base64, timestamp, userId, expirationTime });
            localStorage.setItem('stories', JSON.stringify(stories));
        });
    } else {
        stories.push({ text, image: null, timestamp, userId, expirationTime });
        localStorage.setItem('stories', JSON.stringify(stories));
    }
}

function removeExpiredStories() {
    let stories = JSON.parse(localStorage.getItem('stories')) || [];
    const currentTime = new Date().getTime();

    stories = stories.filter(story => story.expirationTime > currentTime);
    localStorage.setItem('stories', JSON.stringify(stories));

    loadStoriesFromLocalStorage();
}

function removeStoryFromLocalStorage(timestamp) {
    let stories = JSON.parse(localStorage.getItem('stories')) || [];
    stories = stories.filter(story => story.timestamp !== timestamp);
    localStorage.setItem('stories', JSON.stringify(stories));
}

function loadStoriesFromLocalStorage() {
    const storiesContainer = document.getElementById('storiesContainer');
    let stories = JSON.parse(localStorage.getItem('stories')) || [];
    const currentTime = new Date().getTime();

    storiesContainer.innerHTML = '';

    stories.forEach(story => {
        if (story.expirationTime > currentTime) {
            const storyElement = createStory(story.text, story.image, story.timestamp, story.userId);
            storiesContainer.appendChild(storyElement);
            const timeRemaining = story.expirationTime - currentTime;
            setTimeout(() => {
                storyElement.remove();
                removeStoryFromLocalStorage(story.timestamp);
            }, timeRemaining);
        }
    });
}

document.getElementById("post").addEventListener("click", function() {
    const postText = document.getElementById('storyText').value.trim();
    const postImage = document.getElementById('storyImage').files[0];
    const userId = getCurrentUserId();

    if (!postText && !postImage) {
        Swal.fire({
            icon: 'error',
            title: 'Check the story',
            text: 'You must add either text or an image to the story.'
        });
        return;
    }

    saveStoryToLocalStorage(postText, postImage, userId);

    const timestamp = new Date().toLocaleString();
    const storyElement = createStory(postText, postImage ? URL.createObjectURL(postImage) : null, timestamp, userId);
    document.getElementById('storiesContainer').appendChild(storyElement);

    document.getElementById('storyText').value = '';
    document.getElementById('storyImage').value = '';
});

document.getElementById('createStoryBtn').addEventListener('click', function() {
    const postContainer = document.getElementById('postContainer');
    postContainer.style.display = postContainer.style.display === 'none' || postContainer.style.display === '' ? 'block' : 'none';
});

function totimeline() {
    window.location.href = "../timeline/timeline.html";
}

window.addEventListener('DOMContentLoaded', loadStoriesFromLocalStorage);
setInterval(removeExpiredStories, 60000);
