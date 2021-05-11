## Authentication
Plio Analytics uses Auth0 authentication to manage access tokens and valid API requests from the client app, which in Plio's ecosystem is the frontend app.

Plio Analytics relies on client credentials API which is suitable for machine-to-machine data exchange without any user consent. This generates access token for the client app instead of per-user access token.

### Configurating Auth0
1. Sign up or log into your Auth0 account.
2. From the left navigation, go to APIs and create a new API.
   1. Name your API.
   2. Set the identifier to your app url. Like `https://myapp.com/`. This must be a unique identifier and not to be reused in other APIs.
   3. Signing Algorithm should be `RS256`.
3. From the left navigation, go to Applications.
   1. You will see an application was created automatically with your api name and `(Test application)`.
   2. Select this app and go to settings tab. Rename by removing the (Test Application) part and save.
4. Go to Quick Start tab and copy the example code for "Getting an access token for your API". Run the command in your shell. It should return a valid response with access token, expiry time and token type.


### Configuring CUBE_JS environment variables
Add the following environment variables for this CubeJS project after replacing the `<>` parts with your configs.
```sh
CUBEJS_JWK_URL=https://<AUTH0-SUBDOMAIN>.auth0.com/.well-known/jwks.json
CUBEJS_JWT_AUDIENCE=<APPLICATION_URL>
CUBEJS_JWT_ISSUER=https://<AUTH0-SUBDOMAIN>.auth0.com/
CUBEJS_JWT_ALGS=RS256
CUBEJS_JWT_CLAIMS_NAMESPACE=<CLAIMS_NAMESPACE>
```

#### CUBEJS_JWK_URL
This is the url to fetch the JSON wek keys details. Replace the `<AUTH0-SUBDOMAIN>` by the domain name for your account. The domain can be determined from `Your app > Settings > Domain`.

#### CUBEJS_JWT_AUDIENCE
This is the unique identifier that was set when configuring the API in Auth0. Should be the url for your app.

#### CUBEJS_JWT_ISSUER
JWT issuer should be the domain for your Auth0 app. Replace the `<AUTH0-SUBDOMAIN>` by the domain name for your account. The domain can be determined from `Your app > Settings > Domain`.

#### CUBEJS_JWT_ALGS
This is to remain RS256 to decode the access token generated by same algorithm.

#### CUBEJS_JWT_CLAIMS_NAMESPACE
The claim namespace should be your app url. In this case, it would be same as the `CUBEJS_JWT_AUDIENCE` variable.