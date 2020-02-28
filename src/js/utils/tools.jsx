// CheckHostname ... This removes an environment variable
export function CheckHostname(hostname) {
  if (hostname === '127.0.0.1' || hostname === 'localhost') {
    return 'http://127.0.0.1:8081/'; // root url to loyalty-rewards-api (local instance)
  } if (hostname === 'fullstack.dev-rancher.centene.com') {
    return 'https://fullstack.dev-rancher.centene.com/'; // (CAPI - dev instance)
  } if (hostname === 'fullstack.test-rancher.centene.com') {
    return 'https://fullstack.test-rancher.centene.com/'; // (CAPI - test instance)
  } if (hostname === 'fullstack.rancher.centene.com') {
    return 'https://fullstack.rancher.centene.com/'; // (CAPI - prod instance)
  } if (hostname === 'fullstack.ckp-dev.centene.com') {
    return 'https://fullstack.ckp-dev.centene.com/'; // (POTS - dev instance)
  } if (hostname === 'fullstack.ckp-test.centene.com') {
    return 'https://fullstack.ckp-test.centene.com/'; // (POTS - test instance)
  } if (hostname === 'fullstack.ckp.centene.com') {
    return 'https://fullstack.ckp.centene.com/'; // (POTS - prod instance)
  }
  // DEFAULT
  return 'http://127.0.0.1:8081/';
}

export function HandleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export function Notify(str) {
  // eslint-disable-next-line no-alert
  alert(str);
}

export function GetKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

export async function CustomFetch(endpoint) {
  const BASEURL = CheckHostname(window.location.hostname);
  const url = BASEURL.concat(endpoint);
  console.log('url: ', url);
  try {
    const response = await fetch(url);
    const json = await response.json();
    console.log('json: ', json);
    return json;
  } catch (error) {
    let str = error.toString();
    if (error.toString() === 'TypeError: Failed to fetch') {
      str = 'Failed to fetch Plans: Connection Unavailable';
    } else if (error.toString() === 'TypeError: Failed to execute \'fetch\' on \'Window\'') {
      str = 'Fetch failed!';
    }
    console.log('Other Error: ', str);
  }
}
