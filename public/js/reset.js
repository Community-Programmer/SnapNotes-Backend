const BACKEND_URL = 'https://snapnotes-backend.onrender.com'

const updatepassword = async () => {
    const token = document.getElementById('token').value;
    const newpassword = document.getElementById('password').value;


    const response = await fetch(`${BACKEND_URL}/user/updatepassword`, {
      method: 'PATCH',
      headers: {
  'Content-Type': 'application/json',
          },
      body: JSON.stringify({token:token,newpassword:newpassword})
    });

    const json = await response.json();
    console.log('fetch json', json);
    if(response.ok){
        console.log("okss",response.status)
        const alert=document.getElementById("success-alert");
        const reset=document.getElementById("rest-form");
        reset.style.display='none'
        alert.style.display='flex'
    }
  };


function showpass() {
    var x = document.getElementById("password");
    var y = document.getElementById("confirm-password");
    if (x.type === "password" && y.type === "password") {
      x.type = "text";
      y.type = "text";
    } else {
      x.type = "password";
      y.type = "password";
    }
  }