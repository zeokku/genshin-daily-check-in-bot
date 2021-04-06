# Genshin Impact Daily Check-in Bot

**This bot is made only for educational purposes! Only you are responsible for any potential damage done to your account!**

The bot is made to automate daily check-in webevent:

https://webstatic-sea.mihoyo.com/ys/event/signin-sea/index.html?act_id=e202102251931481

## Setting up

- `git clone https://github.com/zeokku/genshin-daily-check-in-bot.git`
- `cd` into the folder
- `npm i` or `yarn`
- Open web event in a browser
- Obtain _login_ticket_ cookie:

  - Open browser console and paste this code:

  ```javascript
  cookies = Object.fromEntries(
    document.cookie.split(/;\s*/).map((c) => c.split("="))
  );

  cookies["login_ticket"];
  ```

  - Copy the returned string into _loginTicket.js_ file in place of a string

- Run `node ./`
- Create a shortcut and place it to autorun, so the program will run each time you run the machine
