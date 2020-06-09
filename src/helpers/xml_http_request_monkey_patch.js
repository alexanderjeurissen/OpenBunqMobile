// NOTE: inspired on https://github.com/ilinsky/xmlhttprequest/blob/master/XMLHttpRequest.js
export default () => {
  const originalXmlHttpRequest = window.XMLHttpRequest;

  function PatchedXMLHttpRequest() {
    this._object = new originalXmlHttpRequest();
  }

  function PatchedXMLHttpRequestConstructor() {
    return new PatchedXMLHttpRequest();
  }

  PatchedXMLHttpRequestConstructor.prototype = PatchedXMLHttpRequest.prototype;

  // Constants
  PatchedXMLHttpRequestConstructor.UNSENT = 0;
  PatchedXMLHttpRequestConstructor.OPENED = 1;
  PatchedXMLHttpRequestConstructor.HEADERS_RECEIVED = 2;
  PatchedXMLHttpRequestConstructor.LOADING = 3;

  PatchedXMLHttpRequestConstructor.prototype.open = function(method, url) {
    const patchedUrl = `https://bunq-mobile-cors-proxy.herokuapp.com/${url}`;
    this._object.open(method, patchedUrl);
    this.readyState = PatchedXMLHttpRequestConstructor.OPENED;
  };

  PatchedXMLHttpRequestConstructor.prototype.send = function(vData) {
    this._object.send(vData);
  };

  window.XMLHttpRequest = PatchedXMLHttpRequestConstructor;
};
