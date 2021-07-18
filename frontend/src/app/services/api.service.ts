
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

export interface Listener {
  endpoint: string;
  callback: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private socket: Socket) { }

  public get(endpoint: string, params: any): Promise<object> {
    let args = "";
    for (const key of Object.keys(params)) {
      const val: string = typeof params[key] === "string" ? params[key] : JSON.stringify(params[key]);
      args += `${encodeURIComponent(key)}=${encodeURIComponent(val)}&`;
    }
    const url = `/api/${endpoint}?${args}`;
    return this.http.get(url).toPromise();
  }

  public socketOn(endpoint: string, callback: (result: any) => void): Listener {
    this.socket.on(endpoint, callback);
    return { endpoint, callback };
  }

  public removeCallback(listener: Listener) {
    this.socket.removeListener(listener.endpoint, listener.callback);
  }

}