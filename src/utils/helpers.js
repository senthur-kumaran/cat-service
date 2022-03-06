const util = require('util');
const request = require('request');
const blend = require('@mapbox/blend');
const { createWriteStream } = require('fs');

const requestParams = (message, width, height, color, size) => {
  const params = {};

  params.url = `https://cataas.com/cat/says/${message}?width=${width}&height=${height}&color${color}&s=${size}`;
  params.encoding = 'binary';

  return params;
};

const bufferFrom = (body) => Buffer.from(body, 'binary');

const writeStreamToFile = (filePath, data, encoding = 'binary') => new Promise((resolve, reject) => {
  const writeStream = createWriteStream(filePath);

  writeStream.write(data, encoding);
  writeStream.on('finish', resolve);
  writeStream.on('error', reject);
  writeStream.end();
});

const getRequestPromise = util.promisify(request.get);
const blendPromise = util.promisify(blend);

module.exports = {
  requestParams,
  bufferFrom,
  getRequestPromise,
  blendPromise,
  writeStreamToFile,
};
