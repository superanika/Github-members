const ENDPOINT = 'https://api.github.com/orgs/adalab/members?per_page=100';
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
  const optionText = document.createTextNode(array[i].name || array[i].login);
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
  user.classList.add('user');
  const userText = document.createTextNode('@'+ array[i].login);
  user.appendChild(userText);
  memberInfo.appendChild(user);
  const name = document.createElement('p');
  name.classList.add('name');
  const nameText = document.createTextNode(array[i].name || array[i].login);
  name.appendChild(nameText);
  memberInfo.appendChild(name);
  const locationIcon = document.createElement('i');
  locationIcon.classList.add('fas', 'fa-map-marker-alt', 'location_icon');
  const location = document.createElement('p');
  location.classList.add('location');
  const locationText = document.createTextNode(array[i].location || 'Del mundo');
  location.appendChild(locationIcon);
  location.appendChild(locationText);
  memberInfo.appendChild(location);
  
  const repoWrapper = document.createElement('div');
  repoWrapper.classList.add('info_wrapper');
  const repo = document.createElement('p');
  repo.classList.add('text');
  const repoText = document.createTextNode('repos');
  const repoNumWrapper = document.createElement('p');
  const repoNum = document.createTextNode(array[i].public_repos);
  repoNumWrapper.classList.add('big_num');
  repo.appendChild(repoText);
  repoNumWrapper.appendChild(repoNum);
  repoWrapper.appendChild(repoNumWrapper);
  repoWrapper.appendChild(repo);
  repoInfo.appendChild(repoWrapper);
 
  const followersWrapper = document.createElement('div');
  followersWrapper.classList.add('info_wrapper');
  const followers = document.createElement('p');
  followers.classList.add('text');
  const followersText = document.createTextNode('followers');
  const followersNumWrapper = document.createElement('p');
  const followersNum = document.createTextNode(array[i].followers);
  followersNumWrapper.classList.add('big_num');
  followers.appendChild(followersText);
  followersNumWrapper.appendChild(followersNum);
  followersWrapper.appendChild(followersNumWrapper);
  followersWrapper.appendChild(followers);
  repoInfo.appendChild(followersWrapper);
  
  const followingWrapper = document.createElement('div');
  followingWrapper.classList.add('info_wrapper');
  const following = document.createElement('p');
  following.classList.add('text');
  const followingText = document.createTextNode('following');
  const followingNumWrapper = document.createElement('p');
  const followingNum = document.createTextNode(array[i].following);
  followingNumWrapper.classList.add('big_num');
  following.appendChild(followingText);
  followingNumWrapper.appendChild(followingNum);
  followingWrapper.appendChild(followingNumWrapper);
  followingWrapper.appendChild(following);
  repoInfo.appendChild(followingWrapper);
}

function signInDate(array, i) {
  const signIn = new Date(array[i].created_at);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - signIn.getTime());
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 *30)); 
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
    select.value = 'selecciona';
    card.classList.remove('show');
    since.innerHTML= '';
  }
}

select.addEventListener('change', handleSelect);
