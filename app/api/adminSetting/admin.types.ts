export interface Smtp {
  host: string;
  userName: string;
  encryption: string;
  port: string;
  password: string;
  address: string;
  service: string;
}
export interface KeyData {
  hostKey: string;
  portKey: string;
  pushNotificationKey: string;
}
