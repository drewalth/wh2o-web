# wh2o-web

The code that runs the [wh2o.io](https://wh2o.io/) browser client.

---

## Development

If you would like to contribute to the project, follow the steps below to get set up locally on your machine.

#### System

- [Nodejs](https://nodejs.org/en/)

#### Accounts

- [Google Recaptcha](https://www.google.com/recaptcha/about/). Either create your own account and use that key for
  the `.env` file or ask @drewalth for one.
- [Mapbox](https://www.mapbox.com/). If you would like to work on the maps, create an account with Mapbox and use your
  own API token.

### Getting Started

Once you have the API(s) running locally (see [setup instructions](https://github.com/drewalth/wh2o-api/blob/main/README.md)) on your machine, run the following:

```shell
cp .env.example .env

# install dependencies
npm ci

# start the development server
npm start
```
