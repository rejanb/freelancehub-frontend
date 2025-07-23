export class ApiConst {
  public static readonly API_URL = 'http://localhost:8000/api/';
  public static readonly WS_URL = 'ws://localhost:8000/ws/';

  static userKey: string = 'user';
  static tokenKey: string = 'auth';
  static access: string = 'access';
  static refresh: string = 'refresh';
}

export class RoleConst {
  public static readonly CLIENT = 'client';
  public static readonly FREELANCER = 'freelancer';
}

export class RouteConst {
  static LOGIN: string = '/login';
  static DASHBOARD: string = '/dashboard';
  static HOME: string = '/home';
  static UNAUTHORIZED: string = '/unauth';
}
