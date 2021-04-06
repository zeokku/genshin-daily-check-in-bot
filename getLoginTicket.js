cookies = Object.fromEntries(
  document.cookie.split(/;\s*/).map((c) => c.split("="))
);

cookies["login_ticket"];
