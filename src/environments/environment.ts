// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { EnvironmentConfiguration } from '../app/models/environment-configuration';

const serverUrl = 'https://uatbe.softwaves.co';

// The list of file replacements can be found in `angular.json`.
export const environment: EnvironmentConfiguration = {
  env_name: 'dev',
  production: true,
  apiUrl: serverUrl,
  apiEndpoints: {
    userProfile: 'user-profiles',
  },
  adConfig: {
    clientId: 'eca20e31-3c33-4253-88f5-f49666b7956f',
    readScopeUrl: 'api://23c6fe4b-74b4-4022-a501-46b232a466c8/Read',
    writeScopeUrl: 'api://23c6fe4b-74b4-4022-a501-46b232a466c8/Write',
    scopeUrls: [
      'api://23c6fe4b-74b4-4022-a501-46b232a466c8/Read',
      'api://23c6fe4b-74b4-4022-a501-46b232a466c8/Write',
    ],
    apiEndpointUrl: 'https://uatbe.softwaves.co',
    tenantId: '97c70d5a-2f83-4e2d-9db0-7fe7a46c2898',
  },
  cacheTimeInMinutes: 15,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

// run this app in 4200 port

/*
azure ad user credentials, it will not work after 15 days of I created, comment in channel to send you new one

karthik@learnsmartcodinggmail.onmicrosoft.com or kannan@learnsmartcodinggmail.onmicrosoft.com
LSCamu745406
*/
