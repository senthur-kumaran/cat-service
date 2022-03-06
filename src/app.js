const { join } = require('path');
const argv = require('minimist')(process.argv.slice(2));
const {
  requestParams,
  bufferFrom,
  getRequestPromise,
  blendPromise,
  writeStreamToFile,
} = require('./utils/helpers');

const app = async () => {
  const {
    greeting = 'Hello',
    who = 'You',
    width = 400,
    height = 500,
    color = 'Pink',
    size = 100,
  } = argv;

  try {
    const [firstResponse, secondResponse] = await Promise.all([
      getRequestPromise(requestParams(greeting, width, height, color, size)),
      getRequestPromise(requestParams(who, width, height, color, size)),
    ]);

    console.log(`Received first response with status: ${firstResponse.statusCode}`);
    console.log(`Received second response with status: ${secondResponse.statusCode}`);

    const data = await blendPromise([
      {
        buffer: bufferFrom(firstResponse.body),
        x: 0,
        y: 0,
      }, {
        buffer: bufferFrom(secondResponse.body),
        x: width,
        y: 0,
      },
    ], {
      width: width * 2,
      height,
      format: 'jpeg',
    });

    const fileOut = join(process.cwd(), '/cat-card.jpg');

    await writeStreamToFile(fileOut, data);

    console.log('The file was saved!');
  } catch (error) {
    console.log(error);
  }
};

app();
