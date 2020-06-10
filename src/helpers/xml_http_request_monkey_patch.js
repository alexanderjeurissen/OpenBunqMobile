import { HTTP } from "@ionic-native/http";

// NOTE: inspired by https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js
export default () => {
  XMLHttpRequest.prototype.originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    const patchedUrl = `https://bunq-mobile-cors-proxy.herokuapp.com/${url}`;
    this._requestUrl = patchedUrl;
    this._requestMethod = method;

    this.originalOpen(method, patchedUrl);
  };

  // XMLHttpRequest.prototype.originalGetAllResponseHeaders =
  //   XMLHttpRequest.prototype.getAllResponseHeaders;

  // XMLHttpRequest.prototype.getAllResponseHeaders = function(requestData) {
  //   if (!this._responseHeaders) return "";

  //   // NOTE: HTTP returns a header object, convert it to a raw
  //   // header string as that is the expected return value from XMLHttpRequest
  //   return Object.entries(this._responseHeaders).reduce(
  //     (rawHeaders, [key, value]) => `${rawHeaders}\n ${key}: ${value}`,
  //     ""
  //   );
  // };

  // XMLHttpRequest.prototype.originalSend = XMLHttpRequest.prototype.send;

  // XMLHttpRequest.prototype.send = function(requestData) {
  // const options = {
  //   method: this._requestMethod,
  //   headers: this._requestHeaders,
  //   data: requestData,
  //   timeout: this.timeout
  // };
  // debugger;
  // HTTP.sendRequest(
  //   this._requestUrl,
  //   options,
  //   ({ status, data, url, headers }) => {
  //     debugger;
  //     this.response = data;
  //     this.status = status;
  //     this.statusText = "OK";
  //     this._responseHeaders = headers;
  //     this.readyState = XMLHttpRequest.DONE;
  //     console.log("wow we are here");
  //     console.log("status:", status);
  //     console.log("data:", data);

  //     this.onreadystatechange();
  //   },
  //   ({ status, error, url, headers }) => {
  //     debugger;
  //     this.status = status;
  //     this.statusText = ""; // TODO: confirm status text should be empty
  //     this._responseHeaders = headers;
  //     this.readyState = XMLHttpRequest.DONE;

  //     console.error("status:", status);
  //     console.error("error:", error);
  //     this.onError();
  //   }
  // );

  // this.originalSend(requestData);
  // };

  XMLHttpRequest.prototype.originalSetRequestHeader =
    XMLHttpRequest.prototype.setRequestHeader;

  XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
    // NOTE: create headers object if it does not exist
    if (!this._requestHeaders) this._requestHeaders = {};

    this._requestHeaders[header] = value;

    this.originalSetRequestHeader(header, value);
  };

  window.XMLHttpRequest = XMLHttpRequest;
};
