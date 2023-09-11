const form = document.querySelector(".login form"),
continueBtn = form.querySelector(".button input"),
errorText = form.querySelector(".error-text");

form.onsubmit = (e)=>{
    e.preventDefault();
}

// take username & password & redirect to users.html if everything works well else show error message

continueBtn.onclick = ()=>{
    let xhr = new XMLHttpRequest();
    xhr.open("POST", backendURL+"/login", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = ()=>{
      if(xhr.readyState === XMLHttpRequest.DONE) {
          if(xhr.status === 200){
              let data = xhr.response;
              data = JSON.parse(data);
              if(data != null) {
                // sessionId & userId are required in headers for any further requests...
                console.log(data)
                localStorage.setItem('jwtToken', data["jwtToken"]);
                localStorage.setItem('clientSecret', data["clientName"]);
                location.href = "hourly.html";
              } else {
                errorText.style.display = "block";
                errorText.textContent = data;
              }
          }
      }
    }
    const username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    const requestBody = {
        clientName: username,
        clientSecret: password
    };
    xhr.send(JSON.stringify(requestBody));
}