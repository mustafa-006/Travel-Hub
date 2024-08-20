/* register.js*/
document.getElementById("regestire").addEventListener("submit", function(e) {
  e.preventDefault();

  const firstName = document.getElementById("floating_first_name").value;
  const lastName = document.getElementById("floating_last_name").value;
  const email = document.getElementById("floating_email").value;
  const password = document.getElementById("floating_password").value;
  const confirmPassword = document.getElementById("floating_repeat_password").value;
  const phone = document.getElementById("floating_phone").value;
  const country = document.querySelector("input[name='country']").value;

  const regex = /^[A-Za-z]+$/;

  if (!regex.test(firstName) || !regex.test(lastName)) {
      Swal.fire({
          icon: "error",
          title: "Oooh no!",
          text: "You must enter your name with the Latin alphabet"
      });
      return;
  }

  if (password.length < 8) {
      Swal.fire({
          icon: "error",
          title: "Oooh no!",
          text: "You must enter a password greater than 8 characters"
      });
      return;
  }

  if (password !== confirmPassword) {
      Swal.fire({
          icon: "error",
          title: "Oooh no!",
          text: "Check the password that you entered in the confirmation field"
      });
      return;
  }

  // Send data to the server
  fetch('http://localhost:9999/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
          email,
          password,
          firstName,
          lastName,
          phone,
          country
      })
  })
  .then(response => {
      if (response.ok) {
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
          window.location.href = '../profile/profile.html';
      } else {
          return response.text().then(text => Swal.fire({
              icon: "error",
              title: "Registration failed",
              text: text
          }));
      }
  })
  .catch(error => Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong!"
  }));
});


/* template */

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