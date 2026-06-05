/**
 * fetchModel - Fetch a model from the web server using GET.
 *
 * @param {string} url      The URL to issue the GET request.
 * @returns {Promise}       A Promise that resolves with the response data.
 */
const backendBaseUrl = "http://localhost:8081";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }
  return headers;
}

function handleUnauthorized(response) {
  if (response.status === 401) {
    // Token expired or invalid - clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.hash = "#/login";
    throw new Error("Unauthorized - please login again");
  }
}

function fetchModel(url) {
  const fullUrl = url.startsWith("/") ? backendBaseUrl + url : url;

  return new Promise(function (resolve, reject) {
    fetch(fullUrl, {
      headers: getAuthHeaders(),
    })
      .then(function (response) {
        handleUnauthorized(response);
        if (!response.ok) {
          throw new Error(
            "Lỗi HTTP: " + response.status + " " + response.statusText
          );
        }
        return response.json();
      })
      .then(function (data) {
        resolve({ data: data });
      })
      .catch(function (error) {
        console.error("Lỗi khi fetch data từ URL:", fullUrl, error);
        reject(error);
      });
  });
}

/**
 * fetchModelPost - Send a POST request with JSON body.
 *
 * @param {string} url      The URL to issue the POST request.
 * @param {object} body     The JSON body to send.
 * @returns {Promise}       A Promise that resolves with the response data.
 */
function fetchModelPost(url, body) {
  const fullUrl = url.startsWith("/") ? backendBaseUrl + url : url;

  return new Promise(function (resolve, reject) {
    fetch(fullUrl, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    })
      .then(function (response) {
        handleUnauthorized(response);
        if (!response.ok) {
          return response.text().then(function (text) {
            throw new Error(text || "Lỗi HTTP: " + response.status);
          });
        }
        return response.json();
      })
      .then(function (data) {
        resolve({ data: data });
      })
      .catch(function (error) {
        console.error("Lỗi khi POST data tới URL:", fullUrl, error);
        reject(error);
      });
  });
}

export default fetchModel;
export { fetchModelPost, backendBaseUrl };

