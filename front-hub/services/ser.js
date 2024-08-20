
var swiper = new Swiper(".swiper", {
    effect: "cube",
    grabCursor: true,
    loop: true,
    speed: 1000,
    cubeEffect: {
      shadow: false,
      slideShadows: true,
      shadowOffset: 10,
      shadowScale: 0.94,
    },
    autoplay: {
      delay: 2600,
      pauseOnMouseEnter: true,
    },
  });
  
  tsParticles.load("tsparticles", {
    fpsLimit: 60,
    backgroundMode: {
      enable: true,
      zIndex: -1,
    },
    particles: {
      number: {
        value: 30,
        density: {
          enable: true,
          area: 800,
        },
      },
      color: {
        value: [
          "#3998D0",
          "#2EB6AF",
          "#A9BD33",
          "#FEC73B",
          "#F89930",
          "#F45623",
          "#D62E32",
        ],
      },
      destroy: {
        mode: "split",
        split: {
          count: 1,
          factor: {
            value: 5,
            random: {
              enable: true,
              minimumValue: 4,
            },
          },
          rate: {
            value: 10,
            random: {
              enable: true,
              minimumValue: 5,
            },
          },
          particles: {
            collisions: {
              enable: false,
            },
            destroy: {
              mode: "none",
            },
            life: {
              count: 1,
              duration: {
                value: 1,
              },
            },
          },
        },
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000",
        },
        polygon: {
          sides: 5,
        },
      },
      opacity: {
        value: 1,
        random: false,
        animation: {
          enable: false,
          speed: 1,
          minimumValue: 0.1,
          sync: false,
        },
      },
      size: {
        value: 8,
        random: {
          enable: true,
          minimumValue: 4,
        },
        animation: {
          enable: false,
          speed: 40,
          minimumValue: 0.1,
          sync: false,
        },
      },
      collisions: {
        enable: true,
        mode: "destroy",
      },
      move: {
        enable: true,
        speed: 7,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    detectRetina: true,
  });
  function validateForm() {
    const bookingNumber = document.getElementById('bookingNumber').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    if (bookingNumber === "" || email === "" || phone === "" || message === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Please fill out all fields!',
            text: 'Ensure that all required fields are filled.',
            confirmButtonText: 'OK'
        });
        return false;
    }

    if (!/^\d+$/.test(bookingNumber) || bookingNumber < 1 || bookingNumber > 9) {
        Swal.fire({
            icon: 'warning',
            title: 'Invalid booking number!',
            text: 'Booking number must be between 1 and 9.',
            confirmButtonText: 'OK'
        });
        return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        Swal.fire({
            icon: 'warning',
            title: 'Invalid email address!',
            text: 'Please enter a valid email address.',
            confirmButtonText: 'OK'
        });
        return false;
    }

    if (!/^\d+$/.test(phone)) {
        Swal.fire({
            icon: 'warning',
            title: 'Invalid phone number!',
            text: 'Phone number must contain only digits.',
            confirmButtonText: 'OK'
        });
        return false;
    }

    
    fetch('/book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookingNumber, email, phone, message })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: data.error,
                confirmButtonText: 'OK'
            });
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: data.message,
                confirmButtonText: 'OK'
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'An error occurred while processing your request.',
            confirmButtonText: 'OK'
        });
    });

    return false; 
}
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.querySelector(".startBtn");

 
  const tl = gsap.timeline({ paused: true, reversed: true });

  tl
      .to(".example", { duration: 0.5, scale: 0.5 }, "checkpoint1")
      .to(".contactForm", { duration: 0.15, opacity: 0 }, "checkpoint1")
      .to(".mailIcon", { duration: 1, opacity: 1 }, "checkpoint1+=0.5")
      .to(".example", { duration: 1, rotation: 360, ease: "power1.inOut" })
      .to(".example", { duration: 1, rotation: 320, scale: 0.45, ease: "power3.inOut" })
      .to(".mailIcon", { duration: 0.25, borderRadius: "50%" }, "checkpoint2")
      .to(".example", { duration: 0.25, borderRadius: "50%" }, "checkpoint2")
      .to(".example", { duration: 0.5, rotation: 720, scale: 0.15 }, "checkpoint2")
      .to(".example", { duration: 1, y: "150px", ease: "power3.out" })
      .to(".example", { duration: 0.75, y: "-100px", ease: "power3.inOut" })
      .to(".example", { duration: 1, y: "0", ease: "power3.inOut" })
      .to(".example", { duration: 0.5, rotation: 1080, scale: 0.7, borderRadius: "5px" }, "checkpoint3")
      .to(".mailIcon", { duration: 0.25, opacity: 0 }, "checkpoint3")
      .to(".postSubmitMessage", { duration: 0.5, opacity: 1 }, "checkpoint3+=0.25");

  startBtn.addEventListener("click", () => {
      tl.reversed() ? tl.play() : tl.reverse();
  });
});
function totimeline() {
  window.location.href = "../timeline/timeline.html";
}
function topayment() {
  window.location.href = "/payment";
}
