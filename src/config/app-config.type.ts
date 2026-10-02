export type AppConfig = {
  nodeEnv: string;
  name: string;
  workingDirectory: string;
  adminDomain?: string;
  frontendDomain?: string;
  backendDomain: string;
  uploadsDirectory: string;
  trustProxyHops: number;
  port: number;
  apiPrefix: string;
  fallbackLanguage: string;
  headerLanguage: string;
};
