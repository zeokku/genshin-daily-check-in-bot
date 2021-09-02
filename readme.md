# Genshin Impact Daily Check-in Bot

**This bot is made only for educational purposes! Only you are responsible for any potential damage done to your account!**

The bot is made to automate daily check-in webevent:

https://webstatic-sea.mihoyo.com/ys/event/signin-sea/index.html?act_id=e202102251931481

## Setting up

- `git clone https://github.com/zeokku/genshin-daily-check-in-bot.git`
- `cd genshin-daily-check-in-bot`
- `npm i` or `yarn`
- Open [web event](https://webstatic-sea.mihoyo.com/ys/event/signin-sea/index.html?act_id=e202102251931481) in a browser
- Obtain required cookies:

  - Open browser console and execute this code:

  ```javascript
  cookies = Object.fromEntries(
    document.cookie.split(/;\s*/).map((c) => c.split("="))
  );
  
  if(cookies['account_id'])
  {
    copy(JSON.stringify(cookies, ['account_id', 'cookie_token']))
    console.log('Copied into clipboard! Now paste it into cookies.json')    
  }
  else
  {
    console.error("You are not logged in!");
  }
  ```

  - Copy the string into _cookies.json_ file next to the _index.js_

- Run `node ./` or `./run`
- Create a shortcut for `run.bat` and place it to autorun (Win+R -> shell:startup), so the program will run each time you run the machine
