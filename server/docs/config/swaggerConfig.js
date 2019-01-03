import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();
const { API_URL } = process.env;
const swaggerDefinition = {
  info: {
    title: 'Authors Haven',
    version: '1.0.0',
    description: 'Authors Haven Creates a community of like-minded '
    + 'authors to foster inspiration and innovation by leveraging '
    + 'the modern web. It allows sharing information that would make '
    + 'the world a better place. It allows sharing information that '
    + 'would make the world a better place.',
     contact: {
       name: 'Team Selene-ah',
       url: 'https://github.com/andela/selene-ah-backend'
       }
  },
  host: API_URL,
  basePath: '/api/v1',
  consumes: 'application/json',
  produces: 'application/json',
  schemes: { HTTP:'HTTP', HTTPS:'HTTPS' },
  securityDefinitions:
    {Bearer:
      {type: 'apiKey',  name: 'Authorization', in: 'header'}
    },
  security: { Bearer: [] }
};


const options = { swaggerDefinition, apis: ['./server/docs/**/*.yaml']};
const swaggerConfig = swaggerJSDoc(options);

export default swaggerConfig;
