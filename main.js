window.onload = function() {
  main();
}

function main() {
  const themeBtn = document.querySelector('.themeToggoler');
  const body = document.querySelector('body');

  function themeToggle() {
    themeBtn.addEventListener('click', () => {
      if (body.classList.toggle('dark')) {
        themeBtn.style.backgroundImage = "url(sun-fill.svg)";
        localStorage.setItem('theme', 'dark')
      } else {
        themeBtn.style.backgroundImage = "url(moon-fill.svg)";
        localStorage.setItem('theme', 'light');
      };
    });
  };

  function loadTheme() {

    if (localStorage.getItem('theme') === 'dark') {
      themeBtn.style.backgroundImage = "url(sun-fill.svg)";
      body.classList.toggle('dark');
    } else {
      themeBtn.style.backgroundImage = "url(moon-fill.svg)";
      body.classList.remove('dark');
    };
  };

  loadTheme();
  themeToggle();

  window.addEventListener('DOMContrntLoaded', loadTheme);

  //theme toggler end




  //main function for chat bot 


  const sendBtn = document.querySelector('.send');
  const deleteBtn = document.querySelector('.delete-button');
  const input = document.querySelector('.input');
  let userInput = null;
  let chatContainer = document.querySelector('.chat-container');
  const api_key = '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';
  const skeletonDiv = document.querySelector('.skeletonDiv');

  // codes for all functions

  const getItemFromLocalStorage = () => {

    let savedData = localStorage.getItem('saved-chats');
    chatContainer.scrollTo(0, chatContainer.scrollHeight);

    let skeletonDiv = `   <div class="skeletonDiv">
          <img src="robo.png" id="skeletonImage">
          <h1 class="skullHeading">Welcome to Chatty-Charm!</h1>
          <p class='skullP'> Let's start chatting... </p>
        </div>
    `

    chatContainer.innerHTML = savedData || skeletonDiv;
  };

  //getting response from api url

  const getResponse = async (incomingChat) => {
    const api_url = "https://api.openai.com/v1/completions";
    const description = document.createElement("p");
    description.classList.add('robot-chat')

    const copyBtn = document.createElement('button');
    copyBtn.classList.add('copy');
    copyBtn.innerHTML = `<img src="copy-svgrepo-com.svg" class="copy-image">`


    // Define the properties and data for the API request
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${api_key}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-instruct",
        prompt: userInput,
        max_tokens: 2048,
        temperature: 0.2,
        n: 1,
        stop: null,
      }),
    };

    // Send POST request to API, get response and set the reponse as paragraph element text
    try {
      const response = await (await fetch(api_url, requestOptions)).json();
      description.textContent = response.choices[0].text.trim();
      console.log(response)
      console.log(userInput)
    } catch (error) { // Add error class to the paragraph element and set error text
      description.classList.add("error");
      description.textContent = "Oops! Something went wrong while retrieving the response. Please try again.";
    }

    // Remove the typing animation, append the paragraph element and save the chats to local storage
    incomingChat.querySelector('.loading').remove();
    incomingChat.querySelector('.incoming-chat-details').appendChild(description);
    incomingChat.querySelector('.incoming-chat-content').appendChild(copyBtn);

    copyBtn.addEventListener('click', () => {
      const respondedText = description;
      navigator.clipboard.writeText(respondedText.textContent);
    });

    //saving data to localStorage 
    localStorage.setItem("saved-chats", chatContainer.innerHTML);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
  };

  let newChatDiv = (htmlDiv, className) => {

    let chatDiv = document.createElement('div');
    chatDiv.classList.add('chat', className);
    chatDiv.innerHTML = htmlDiv;
    return chatDiv;
  };



  let incomingDiv = (htmlDiv, className) => {
    let newChatDiv = document.createElement('div');
    newChatDiv.innerHTML = htmlDiv;
    newChatDiv.classList.add('chat', className);
    return newChatDiv;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
  };


  //function for robot-animation and reply

  let robotReplyAnimation = () => {

    let htmlDiv = ` <div class="incoming-chat-content">
                <div class="incoming-chat-details">
                  <img src="robot-profile.png" class="robot-image">
                  <img src="fade-stagger-circles.svg" class="loading">
                </div>
              </div> `

    const incomingChat = newChatDiv(htmlDiv, '-incoming');

    chatContainer.appendChild(incomingChat);
    input.value = ''; // clearing the input value

    getResponse(incomingChat);

  };


  const handleInputFunction = () => {
    userInput = input.value.trim();
    console.log(userInput);

    if (!userInput) return;

    let htmlDiv = `  <div class="outgoing-chat-content">
            <div class="chat-details">
              <img src="user.svg" alt="" class="user-image">
              <p class="user-chat"> </p>
            </div>
          </div>`

    const outgoingDiv = newChatDiv(htmlDiv, '-outgoing');
    outgoingDiv.querySelector('p').textContent = userInput;
    chatContainer.appendChild(outgoingDiv);
    input.value = ''; // clearing the input value
    chatContainer.querySelector('.skeletonDiv')?.remove();
    setTimeout(robotReplyAnimation, 500);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
  };

  //buttons clicking events
  sendBtn.addEventListener('click', handleInputFunction);

  deleteBtn.addEventListener('click', () => {

    if (confirm('Do you want to delete all the chats permanently?')) {
      localStorage.removeItem('saved-chats');
    };
    getItemFromLocalStorage();
  });
  getItemFromLocalStorage();

  const initialInputHeight = input.scrollHeight;

  input.addEventListener("input", () => {
    // Set the height to auto temporarily to get the scrollHeight
    input.style.height = 'auto';
    // Set the input height to either the scrollHeight or the initial height, whichever is greater
    const newHeight = Math.max(initialInputHeight, input.scrollHeight);
    input.style.height = `${newHeight}px`;

    // If the text is cleared, reset the input height to the initial height
    if (input.value === '') {
      input.style.height = `${initialInputHeight}px`;
    }
  });
};