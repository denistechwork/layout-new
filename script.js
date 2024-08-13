const apiUrl = 'https://dummyjson.com/auth/login';
const loginBtn = document.querySelector('.navbar__login-item');
const loginLink = document.querySelector('.navbar__login-link');
const defaultLogo = document.querySelector('#imglogo');
const defaultMobLogo = document.querySelector('#mobimglogo');
const mobLogin = document.querySelector(
  '.navbar__mobile-menu-item:nth-child(1)'
);

async function loginUser(e) {
  e.preventDefault();

  const userName = document.querySelector(
    '.hero__container-form-flex-input-1 input'
  ).value;

  const passWord = document.querySelector(
    '.hero__container-form-flex-input-2 input'
  ).value;

  try {
    const loginRes = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userName,
        password: passWord,
        expiresInMins: 15,
      }),
    });
    const login = await loginRes.json();

    if (loginRes.ok) {
      localStorage.setItem('userDummyJSON', JSON.stringify(login));
      localStorage.setItem('accessToken', login.token);
      localStorage.setItem('refreshToken', login.refreshToken);
      loginUI(login.firstName, login.lastName);
      loginUIimg(login.username);
    } else {
      addError();
    }
  } catch (error) {
    console.log(error);
  }
}

async function getAuthUser() {
  const resToken = await fetch('https://dummyjson.com/auth/me', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    },
  });
  const tokenAuth = await resToken.json();
  try {
    if (!resToken.ok) {
      await refreshUser();
    }
  } catch (error) {
    resetUI();
  }
}

async function refreshUser() {
  const resRefToken = await fetch('https://dummyjson.com/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refreshToken: localStorage.getItem('refreshToken'),
      expiresInMins: 15,
    }),
  });
  const refToken = await resRefToken.json();
  console.log({ resRefToken });
  localStorage.setItem('refreshToken', refToken.refreshToken);
  localStorage.setItem('accessToken', refToken.token);
}

const addError = () => {
  document.querySelector('.hero__container-form-flex h1').outerHTML =
    '<h1 style="color: red">Error (Try Again)</h1>';
  setTimeout(
    () =>
      (document.querySelector('.hero__container-form-flex h1').outerHTML =
        '<h1>Login</h1>'),
    2000
  );
  inputClr();
};

const inputClr = () => {
  document.querySelector('.hero__container-form-flex-input-1 input').value = '';
  document.querySelector('.hero__container-form-flex-input-2 input').value = '';
};

const loginUIimg = async (username) => {
  try {
    const div = document.querySelector('.navbar__logo');
    const divMob = document.querySelector('.navbar__mobile-logo');

    const resImg = await fetch(`https://dummyjson.com/icon/${username}/128`);
    const data = await resImg.blob();

    const imgDesc = document.createElement('img');
    imgDesc.src = URL.createObjectURL(data);
    imgDesc.className = 'navbar__logo';
    document.querySelector('#imglogo').remove();
    div.appendChild(imgDesc);

    const imgMob = document.createElement('img');
    imgMob.src = URL.createObjectURL(data);
    imgMob.className = 'navbar__mobile-logo';
    document.querySelector('#mobimglogo').remove();
    divMob.appendChild(imgMob);
  } catch (error) {
    console.log(error);
  }
};

const loginUI = (firstname, lastname) => {
  // Desktop
  const div = document.querySelector('.navbar__login-item');
  const logOut = document.createElement('a');
  logOut.className = 'navbar__log-out';
  logOut.innerHTML = 'Log Out';

  const loginName = document.createElement('a');
  loginName.className = 'navbar__login-name';
  loginName.innerHTML = `${firstname} ${lastname}`;

  div.appendChild(loginName);
  div.appendChild(logOut);
  inputClr();
  document.querySelector('.hero__container-form').classList.remove('active');
  document.querySelector('#login-link').remove();

  // Mobile
  const divMob = document.querySelector(
    '.navbar__mobile-menu-item:nth-child(1)'
  );
  const logOutMobLi = document.createElement('li');
  logOutMobLi.className = 'navbar__mobile-menu-item-log-out';
  const logOutMob = document.createElement('a');
  logOutMob.className = 'navbar__mobile-menu-link-log-out';
  logOutMob.innerHTML = 'Log Out';
  logOutMobLi.appendChild(logOutMob);

  divMob.replaceWith(logOutMobLi);

  const ulMenu = document.querySelector('.navbar__mobile-menu-list');
  const loginLinkMob = document.querySelector(
    '.navbar__mobile-menu-list'
  ).firstChild;

  const li = document.createElement('li');
  li.classList = 'navbar__mobile-menu-item-user';
  const link = document.createElement('a');
  link.className = 'navbar__mobile-menu-link';
  link.innerText = `${firstname} ${lastname}`;
  li.appendChild(link);

  ulMenu.insertBefore(li, loginLinkMob);
};

const userInfo = (firstname, lastname, gender, eMail) => {
  const divMain = document.querySelector('.hero');
  const divSub = document.createElement('div');
  divSub.className = 'hero__container-form-flex-info';
  const div = document.createElement('div');
  div.className = 'hero__container-flex-info';
  divMain.appendChild(divSub);
  divSub.appendChild(div);

  const elements = [
    `First Name: ${firstname}`,
    `Last Name: ${lastname}`,
    `Gender: ${gender}`,
    `Email: ${eMail}`,
  ];

  const ul = document.createElement('ul');
  ul.className = 'hero__list-items';
  div.appendChild(ul);

  elements.forEach((el) => {
    const li = document.createElement('li');
    li.className = 'hero__list-item';
    li.innerHTML = el;
    ul.appendChild(li);
  });

  const button = document.createElement('button');
  button.className = 'btn-info';
  button.innerHTML = 'Close';
  div.appendChild(button);
};

const resetUI = () => {
  document.querySelector('.navbar__log-out').replaceWith(loginLink);
  document.querySelector('.navbar__login-name').remove();
  document
    .querySelector('.navbar__mobile-menu-item-log-out')
    .replaceWith(mobLogin);
  document.querySelector('.navbar__mobile-menu-item-user').remove();
  document.querySelector('.navbar__logo img').replaceWith(defaultLogo);
  document
    .querySelector('.navbar__mobile-logo img')
    .replaceWith(defaultMobLogo);
  document.querySelector('.navbar__login-link').classList.remove('active');
  if (document.querySelector('.hero__container-form-flex-info'))
    document.querySelector('.hero__container-form-flex-info').remove();
};

document
  .querySelector('.hero__container-form')
  .addEventListener('submit', loginUser);

document
  .querySelector('.navbar__mobile-menu-toggle')
  .addEventListener('click', () => {
    document
      .querySelector('.navbar__mobile-menu-items')
      .classList.toggle('active');
  });

const logoutUI = () => {
  localStorage.clear();
};

const target = document.querySelector('.navbar__container');

const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation && mutation.addedNodes) {
      mutation.addedNodes.forEach(function (el) {
        if (el && el.classList && el.classList.contains('navbar__log-out')) {
          el.addEventListener('click', () => {
            const confirmed = confirm('Вы уверены, что хотите выйти?');
            if (confirmed) {
              logoutUI();
              resetUI();
            }
          });
        }
        if (
          el &&
          el.classList &&
          el.classList.contains('navbar__mobile-menu-item-log-out')
        ) {
          el.addEventListener('click', () => {
            const confirmed = confirm('Вы уверены, что хотите выйти?');
            if (confirmed) {
              logoutUI();
              resetUI();
              document
                .querySelector('.navbar__mobile-menu-items')
                .classList.remove('active');
            }
          });
        }
        if (el && el.classList && el.classList.contains('navbar__login-name')) {
          el.addEventListener('click', () => {
            const info = document.querySelector(
              '.hero__container-form-flex-info'
            );
            if (!info) {
              const user = JSON.parse(localStorage.getItem('userDummyJSON'));
              userInfo(user.firstName, user.lastName, user.gender, user.email);
            } else {
              info.classList.remove('hidden');
            }
          });
        }
        if (
          el &&
          el.classList &&
          el.classList.contains('navbar__mobile-menu-item-user')
        ) {
          el.addEventListener('click', () => {
            const info = document.querySelector(
              '.hero__container-form-flex-info'
            );
            document
              .querySelector('.navbar__mobile-menu-items')
              .classList.remove('active');
            if (!info) {
              const user = JSON.parse(localStorage.getItem('userDummyJSON'));
              userInfo(user.firstName, user.lastName, user.gender, user.email);
            } else {
              info.classList.remove('hidden');
            }
          });
        }
      });
    }
  });
});

observer.observe(target, {
  childList: true,
  subtree: true,
});

const target2 = document.querySelector('.hero');

const observer2 = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation && mutation.addedNodes) {
      mutation.addedNodes.forEach(function (el) {
        if (el && el.classList && el.classList.contains('btn-info')) {
          el.addEventListener('click', () => {
            document
              .querySelector('.hero__container-form-flex-info')
              .classList.add('hidden');
            if (logoutUI) {
              document
                .querySelector('.hero__container-form-flex-info')
                .remove();
            }
          });
        }
      });
    }
  });
});

observer2.observe(target2, {
  childList: true,
  subtree: true,
});

document.querySelector('.navbar__login-link').addEventListener('click', () => {
  document.querySelector('.hero__container-form').classList.toggle('active');
  document.querySelector('.navbar__login-link').classList.toggle('active');
});

document.querySelector('#login-link-mobile').addEventListener('click', () => {
  document
    .querySelector('.navbar__mobile-menu-items')
    .classList.remove('active');
  document.querySelector('.hero__container-form').classList.toggle('active');
});

document.querySelector('#cancel').addEventListener('click', () => {
  document.querySelector('.hero__container-form').classList.remove('active');
  document.querySelector('.navbar__login-link').classList.remove('active');
  document.querySelector('.hero__container-form-flex-input-2 input').value = '';
});

window.addEventListener('load', () => {
  const accessToken = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('userDummyJSON'));

  if (accessToken && user) {
    loginUI(user.firstName, user.lastName);
    loginUIimg(user.username);
  }
});

getAuthUser();
