let menu = document.querySelector("#menu");
let menuNav = document.querySelector("#menuNav");
let closeMenuButton = document.querySelector("#closeMenu");

menu.addEventListener("click", function(e) {
    e.preventDefault();
    menuNav.style.right = "0"; // Slide the menu in from the right
    menu.style.display = "none"; // Hide the menu button
});

closeMenuButton.addEventListener("click", function(e) {
    e.preventDefault();
    menuNav.style.right = "-300px"; // Slide the menu out to the right
    menu.style.display = "inline-block"; // Show the menu button
});

// Close the menu when clicking outside of it
document.addEventListener("click", function(e) {
    if (!menuNav.contains(e.target) && e.target !== menu) {
        menuNav.style.right = "-300px"; // Slide the menu out to the right
        menu.style.display = "inline-block"; // Show the menu button
    }
});

window.onload = function() {
    adjustImageSize();
    window.addEventListener('resize', adjustImageSize);
};

function adjustImageSize() {
    var container = document.querySelector('.container');
    var image = document.querySelector('#image');

    var containerWidth = container.offsetWidth;
    var containerHeight = container.offsetHeight;
    var imageAspectRatio = image.naturalWidth / image.naturalHeight;

    if (containerWidth / containerHeight > imageAspectRatio) {
        image.style.width = '100%';
        image.style.height = 'auto';
    } else {
        image.style.height = '100%';
        image.style.width = 'auto';
    }
}

const imageList = [
"work1.jpg",
"work2.jpg",
"work3.jpg",
"work4.jpg"

];

// Index to keep track of the current image
let currentIndex = 0;

// Function to change the image
function changeImage() {
    // Get the image element
    const imageElement = document.getElementById("slideshowImage");
    
    // Increment the index or reset if reached the end of the image list
    currentIndex = (currentIndex + 1) % imageList.length;
    
    // Set the new image source
    imageElement.src = "images/" + imageList[currentIndex];
}

// Call the changeImage function every 0.5 seconds
setInterval(changeImage, 500);

const projects = document.querySelector('.projects');
const projectWidth = document.querySelector('.project').offsetWidth;

function nextProject() {
  if (currentIndex < projects.children.length - 1) {
    currentIndex++;
    moveProjects();
  }
}

function prevProject() {
  if (currentIndex > 0) {
    currentIndex--;
    moveProjects();
  }
}

function moveProjects() {
  projects.style.transform = `translateX(-${currentIndex * projectWidth}px)`;
}
