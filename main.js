const ENDPOINT = 'https://api.github.com/orgs/adalab/members?per_page=5';
let myArray = []
let myPromises = [];

const select = document.querySelector('.select');
const card = document.querySelector('.card');
const photo = document.querySelector('.photo');
const memberInfo = document.querySelector('.member_info');
const repoInfo = document.querySelector('.repo_info'); 
const since = document.querySelector('.since');


fetch(ENDPOINT).then(response => response.json()).then(data=> {
  const url = 'https://api.github.com/users/';
    for(let user of data) {
      let promise = fetch(url+user.login).then(response =>response.json()).then(data => {
          myArray.push(data)
      });
      myPromises.push(promise);
  }
  Promise.all(myPromises).then(values => { 
      console.log(myArray);
      for(let i=0; i<myArray.length; i++) {
        createOptions(myArray, i);
      }

  });
});

function createOptions(array, i) {
  const option = document.createElement('option');
  const optionText = document.createTextNode(array[i].name);
  option.value = i;
  option.appendChild(optionText);
  select.appendChild(option);
}

function createCard(array, i) {
  card.classList.add('show');
  memberInfo.innerHTML = '';
  repoInfo.innerHTML = '';
  photo.style.backgroundImage= `url(${array[i].avatar_url})`;
  const user = document.createElement('p');
  const userText = document.createTextNode('@'+ array[i].login);
  user.appendChild(userText);
  memberInfo.appendChild(user);
  const name = document.createElement('p');
  const nameText = document.createTextNode(array[i].name);
  name.appendChild(nameText);
  memberInfo.appendChild(name);
  const locationIcon = document.createElement('i');
  locationIcon.classList.add('fas', 'fa-map-marker-alt', 'location_icon');
  const location = document.createElement('p');
  const locationText = document.createTextNode(array[i].location);
  memberInfo.appendChild(locationIcon);
  locationIcon.appendChild(locationText);
  memberInfo.appendChild(location);
  const repo = document.createElement('p');
  const repoNum = document.createTextNode(array[i].public_repos + ' repos');
  repo.appendChild(repoNum);
  repoInfo.appendChild(repo);
  const followers = document.createElement('p');
  const followersNum = document.createTextNode(array[i].followers + ' followers');
  followers.appendChild(followersNum);
  repoInfo.appendChild(followers);
  const following = document.createElement('p');
  const followingNum = document.createTextNode(array[i].following + ' following');
  following.appendChild(followingNum);
  repoInfo.appendChild(following);
}

function signInDate(array, i) {
    
    const signIn = new Date(array[i].created_at);
    const today = new Date();
    console.log(signIn+ '  //  ' + today);
    const diffTime = Math.abs(today.getTime() - signIn.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 *30)); 
    console.log(diffMonths);
    if(diffMonths < 12) {
        since.innerHTML = `Miembro desde hace ${diffMonths} meses`;
    }else {
      const diffYears = Math.round(diffMonths / 12);
      diffYears > 1 ? 
      since.innerHTML = `Miembro desde hace ${diffYears} años`
      :
      since.innerHTML = `Miembro desde hace ${diffYears} año`
    }
}


function handleSelect(event) {
  const target = parseInt(event.currentTarget.value);
  select.value = target;
  if(!isNaN(target)) {
    createCard(myArray, target);
    signInDate(myArray, target);
  }else {
    card.classList.remove('show');
    since.innerHTML= '';
  }
}

select.addEventListener('change', handleSelect);
