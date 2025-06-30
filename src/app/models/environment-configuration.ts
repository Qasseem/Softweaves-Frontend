export interface EnvironmentConfiguration {
  env_name: string;
  production: boolean;
  apiUrl: string;
  apiEndpoints: {
    userProfile: string;
  };
  adConfig: ConfigData;
  LocalConfig?: ConfigData;
  UAEConfig?: ConfigData;
  EGConfig?: ConfigData;
  TestConfig?: ConfigData;
  cacheTimeInMinutes: number;
}

export interface ConfigData {
  clientId: string;
  tenantId: string;
  readScopeUrl: string;
  scopeUrls: string[];
  writeScopeUrl: string;
  apiEndpointUrl: string;
  redirectUri?: string;
  country?: string;
}
