/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule XMLHttpRequest
 * @flow
 */
'use strict';

var FormData = require('FormData');
var RCTNetworking = require('RCTNetworking');
var XMLHttpRequestBase = require('XMLHttpRequestBase');
var base64 = require('base64-js');

type Header = [string, string];

function convertHeadersMapToArray(headers: Object): Array<Header> {
  var headerArray = [];
  for (var name in headers) {
    headerArray.push([name, headers[name]]);
  }
  return headerArray;
}

class XMLHttpRequest extends XMLHttpRequestBase {
  sendImpl(method: ?string, url: ?string, headers: Object, data: any, timeout: number): void {
    var body;
    if (typeof data === 'string') {
      body = {string: data};
    } else if (data instanceof FormData) {
      body = {
        formData: data.getParts().map((part) => {
          part.headers = convertHeadersMapToArray(part.headers);
          return part;
        }),
      };
    } else if (data instanceof ArrayBuffer) {
      body = {arraybuffer: base64.fromByteArray(new Uint8Array(data));}
    } else {
      body = data;
    }
    headers['response-type'] = responseType;
    var useIncrementalUpdates = this.onreadystatechange ? true : false;
    var requestId = RCTNetworking.sendRequest(
      method,
      url,
      convertHeadersMapToArray(headers),
      body,
      useIncrementalUpdates,
      timeout
    );
    this.didCreateRequest(requestId);
  }
}

module.exports = XMLHttpRequest;
