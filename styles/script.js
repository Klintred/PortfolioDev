let menu = document.querySelector("#menu");
let menuNav = document.querySelector("#menuNav");
let closeMenuButton = document.querySelector("#closeMenu");

menu.addEventListener("click", function(e) {
    e.preventDefault();
    menuNav.style.right = "0"; 
    menu.style.display = "none"; 
});

closeMenuButton.addEventListener("click", function(e) {
    e.preventDefault();
    menuNav.style.right = "-300px"; 
    menu.style.display = "inline-block"; 
});


document.addEventListener("click", function(e) {
    if (!menuNav.contains(e.target) && e.target !== menu) {
        menuNav.style.right = "-300px"; 
        menu.style.display = "inline-block"; 
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


let currentIndex = 0;


function changeImage() {
    
    const imageElement = document.getElementById("slideshowImage");
    
   
    currentIndex = (currentIndex + 1) % imageList.length;
    
    
    imageElement.src = "images/" + imageList[currentIndex];
}


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
