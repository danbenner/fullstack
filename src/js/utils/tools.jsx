// CheckHostname ... This removes an environment variable
export function CheckHostname(hostname) {
  if (hostname === '127.0.0.1' || hostname === 'localhost') {
    return 'http://127.0.0.1:8081/';
  } if (hostname === 'fullstack.com') {
    return 'https://fullstack.com/';
  } if (hostname === 'fullstack.test.com') {
    return 'https://fullstack.test.com/';
  } if (hostname === 'fullstack.com') {
    return 'https://fullstack.com/';
  } if (hostname === 'fullstack.dev.com') {
    return 'https://fullstack.dev.com/';
  } if (hostname === 'fullstack.test.com') {
    return 'https://fullstack.test.com/';
  } if (hostname === 'fullstack.com') {
    return 'https://fullstack.com/';
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
