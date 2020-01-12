const { sync } = require("command-exists");
const { execSync } = require("child_process");
const axios = require("axios");
const validUrl = require("valid-url");

const isDockerActived = () =>
  new Promise((resolve, reject) => {
    try {
      const isActived = String(execSync(`systemctl is-active docker`)).trim();
      isActived.toLowerCase() === "active" ? resolve(true) : resolve(false);
    } catch (err) {
      reject(String(err));
    }
  });

const isDockerCliInstalled = () =>
  new Promise((resolve, reject) => {
    try {
      const isExited = sync("docker");
      resolve(isExited);
    } catch (err) {
      reject(String(err));
    }
  });

const isValidedUrl = url =>
  new Promise((resolve, reject) => {
    try {
      resolve(validUrl.isHttpUri(url) || validUrl.isHttpsUri(url));
    } catch (err) {
      reject(`Error: `, String(err));
    }
  });

const isAlivedUrl = url => {
  return axios
    .get(url, { timeout: 10000 })
    .then(response =>
      response.status === 200 ? Promise.resolve(true) : Promise.resolve(false)
    );
};

const validateSystem = () => {
  return isDockerCliInstalled()
    .then(isInstalled =>
      isInstalled
        ? Promise.resolve("Available")
        : Promise.reject(`Docker CLI is not installed`)
    )
    .then(() => isDockerActived())
    .then(isActived =>
      isActived
        ? Promise.resolve("Available")
        : Promise.reject(`Docker does not running`)
    )
    .catch(err => Promise.reject(`Error: `, String(err)));
};

const validateRegistry = url => {
  return isValidedUrl(url)
    .then(isValided =>
      isValided
        ? Promise.resolve("Available")
        : Promise.reject(`Invalided URL Registry`)
    )
    .then(() => isAlivedUrl(url))
    .then(isAlived =>
      isAlived
        ? Promise.resolve("Available")
        : Promise.reject(`URL Registry Non-Active`)
    );
};

module.exports = {
  isDockerActived,
  isDockerCliInstalled,
  isAlivedUrl,
  isValidedUrl,
  validateSystem,
  validateRegistry
};
