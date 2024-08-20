const userId = 'uniqueUserId'; 

// Function to convert image file to Base64
function fileToBase64(file, callback) {
    const reader = new FileReader();
    reader.onloadend = function() {
        callback(reader.result);
    };
    reader.readAsDataURL(file);
}

document.getElementById('profile-image-input').addEventListener('change', function(event) {
    const profileImage = document.getElementById('profile-image-display');
    const imageFile = event.target.files[0];
    
    fileToBase64(imageFile, function(base64Image) {
        localStorage.setItem('profileImage', base64Image);
        profileImage.src = base64Image;
    });
});

document.getElementById('cover-photo-input').addEventListener('change', function(event) {
    const coverImage = document.getElementById('cover-image-display');
    const imageFile = event.target.files[0];
    
    fileToBase64(imageFile, function(base64Image) {
        localStorage.setItem('coverImage', base64Image);
        coverImage.src = base64Image;
    });
});

document.getElementById('profile-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Collect form data
    const newProfileAddress = document.getElementById('address-input').value;
    const newProfileUniversity = document.getElementById('university-input').value;
    const newProfileCV = document.getElementById('cv-input').value;

    // Save data in localStorage
    localStorage.setItem('profileAddress', newProfileAddress);
    localStorage.setItem('profileUniversity', newProfileUniversity);
    localStorage.setItem('profileCV', newProfileCV);

    document.getElementById('profile-address').textContent = newProfileAddress;
    document.getElementById('profile-university').textContent = newProfileUniversity;
    document.getElementById('profile-cv').textContent = newProfileCV;
});

document.addEventListener('DOMContentLoaded', function() {
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const profileAddress = localStorage.getItem('profileAddress');
    const profileUniversity = localStorage.getItem('profileUniversity');
    const profileCV = localStorage.getItem('profileCV');
    const profileImage = localStorage.getItem('profileImage');
    const coverImage = localStorage.getItem('coverImage');

    const profileName = document.getElementById('profile-name');
    if (profileName) {
        profileName.textContent = `${firstName} ${lastName}`;
    }

    if (profileAddress) {
        document.getElementById('profile-address').textContent = profileAddress;
    }

    if (profileUniversity) {
        document.getElementById('profile-university').textContent = profileUniversity;
    }

    if (profileCV) {
        document.getElementById('profile-cv').textContent = profileCV;
    }

    if (profileImage) {
        document.getElementById('profile-image-display').src = profileImage;
    }

    if (coverImage) {
        document.getElementById('cover-image-display').src = coverImage;
    }
});

function totimeline() {
    window.location.href = "../timeline/timeline.html";
}


