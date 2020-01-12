const { validateSystem, validateRegistry } = require("./validation");

validateSystem()
  .then(rs => console.log(`Docker status: `, rs))
  // .then(() => validateRegistry("http://172.26.162.52:5000"))
  .then(() => validateRegistry("http://google.com"))
  .then(rs => console.log(`Registry status: `, rs))
  .catch(err => console.log(String(err)));
