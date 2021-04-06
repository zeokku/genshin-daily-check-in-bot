import axios from "axios";
import { stringify as objToQuery, parse as queryToObj } from "querystring";
import { log, err, warn, ok, accent } from "./log.js";
import login_ticket from "./loginTicket.js";

log("Launching...");

//-------------------

main();

async function main() {
  let cookieContainer = { login_ticket };

  //get cookie_token and account_id
  var { headers, data } = await axios.get(
    "https://webapi-os.account.mihoyo.com/Api/cookie_accountinfo_by_loginticket",
    {
      params: {
        t: Date.now(),
        login_ticket,
      },
      // proxy: {
      //   host: "localhost",
      //   port: 8888,
      // },
    }
  );

  // let cookieArray = headers["set-cookie"];
  // cookieArray.forEach((cookieStr) => {
  //   let cookie = queryToObj(cookieStr, "; ");
  // });

  if (data.code === 200) {
    ok("Account info cookies obtained!");

    let cookieInfo = data.data.cookie_info;
    cookieContainer["cookie_token"] = cookieInfo.cookie_token;
    cookieContainer["account_id"] = cookieInfo.account_id;
  } else {
    err(data);
    return;
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

  let nextTry = null;

  //only ltoken & ltuid are needed
  //or alternatively login_ticket, account_id & cookie_ticket

  var { headers, data } = await api.get("/event/sol/info", {
    params: {
      lang: "en-us",
      act_id: "e202102251931481",
    },
  });

  if (data.retcode === 0) {
    data = data.data;

    nextTry = new Date(data.today);
    nextTry.setDate(nextTry.getDate() + 1); //next day
    nextTry.setHours(nextTry.getHours() - 8, 5); //UTC+8 and 5 minutes just to be sure it's updated

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
