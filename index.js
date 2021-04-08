import axios from "axios";
import { stringify as objToQuery, parse as queryToObj } from "querystring";
import { log, err, warn, ok, accent } from "./log.js";
import fs from "fs";

log("Launching...");

//-------------------

main();

async function main() {
  let cookieContainer = null;

  if (fs.existsSync("./cookies.json")) {
    cookieContainer = JSON.parse(fs.readFileSync("./cookies.json").toString());
  }

  if (!cookieContainer.cookie_token || !cookieContainer.account_id) {
    //get cookie_token and account_id
    //apparently this request has a time limit until you can obtain account cookies after log in
    //meaning after some time it will not return the needed cookies so you need to store them
    //or login again
    try {
      let { headers, data } = await axios.get(
        "https://webapi-os.account.mihoyo.com/Api/cookie_accountinfo_by_loginticket",
        {
          params: {
            t: Date.now(),
            login_ticket: cookieContainer.login_ticket,
          },
          // proxy: {
          //   host: "localhost",
          //   port: 8888,
          // },
        }
      );
    } catch (e) {
      err(e);
      return;
    }

    // let cookieArray = headers["set-cookie"];
    // cookieArray.forEach((cookieStr) => {
    //   let cookie = queryToObj(cookieStr, "; ");
    // });

    if (data.code === 200) {
      ok("Account info cookies obtained!");

      let cookieInfo = data.data.cookie_info;

      if (cookieInfo === null) {
        err(data);
        return;
      } else {
        cookieContainer.cookie_token = cookieInfo.cookie_token;
        cookieContainer.account_id = cookieInfo.account_id;

        fs.promises.writeFile(
          "./cookies.json",
          JSON.stringify(cookieContainer, null, 4)
        );
      }
    } else {
      err(data);
      return;
    }
  }
  //r------------

  const api = axios.create({
    baseURL: "https://hk4e-api-os.mihoyo.com",
    responseType: "json",

    headers: {
      post: {
        "Content-Type": "application/json",
      },
      Cookie: objToQuery(cookieContainer, "; ", "="),
    },

    //fiddler proxy
    // proxy: {
    //   host: "localhost",
    //   port: 8888,
    // },
  });

  //only ltoken & ltuid are needed
  //or alternatively login_ticket, account_id & cookie_ticket

  //({ headers, data } = await api.get("/event/sol/info", {
  let { headers, data } = await api.get("/event/sol/info", {
    params: {
      lang: "en-us",
      act_id: "e202102251931481",
    },
  });

  if (data.retcode === 0) {
    ({ data } = data);

    if (data.is_sign) {
      warn("The reward for today has already been claimed");
      waitForTheNext();
    } else {
      signDay();
    }
  } else {
    err(data);
  }

  function waitForTheNext() {
    let nextTry = new Date();

    //get UTC+8 date/time
    nextTry.setMinutes(
      nextTry.getMinutes() + nextTry.getTimezoneOffset() + 8 * 60
    );

    //next day
    nextTry.setDate(nextTry.getDate() + 1);

    //now convert UTC+8 of the next day at 00:00 to local time
    nextTry.setHours(0, -nextTry.getTimezoneOffset() - 8 * 60, 0, 0);

    //add some margin of 5 minutes
    nextTry.setMinutes(nextTry.getMinutes() + 5);

    accent(`Next try in ${nextTry}`);
    setTimeout(signDay, nextTry.getTime() - Date.now());
  }

  async function signDay() {
    try {
      let { data } = await api.post(
        "/event/sol/sign",
        {
          act_id: "e202102251931481", //event id
        },
        {
          params: {
            lang: "en-us",
          },
        }
      );

      if (data.retcode === 0) {
        data = data.data;

        if (data.code === "ok") {
          ok("Successfully claimed the reward for today");

          waitForTheNext();
        } else {
          err(data);
        }
      } else {
        err(data);
      }
    } catch (e) {
      err(e);
    }
  }
}
