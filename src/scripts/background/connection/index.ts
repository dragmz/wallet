import ContentScriptConnection from "@models/Connection/ContentScriptConnection";

import callbacks from "@background/connection/callbacks";
import ConnectionTypes from "@models/Connection/types";

import { ERROR_CONTENT_SCRIPT_CONNECTION_NOT_INITIALIZED } from "@background/Errors";

import { IConnectionPorts, IPort } from "@pluginTypes/index";

import WindowsService from "@services/WindowsService";
import environment from "@environment/index";

class Connection {
  private static instance?: Connection;
  private connection?: ContentScriptConnection;

  public static getInstance(): Connection {
    if (!Connection.instance) {
      Connection.instance = new Connection();
    }

    return Connection.instance;
  }

  public init(): ContentScriptConnection {
    this.connection = new ContentScriptConnection();

    // register callbacks
    for (let index = 0; index < Object.keys(callbacks).length; index++) {
      const connectionType = Object.keys(callbacks)[index];
      const { callback, middlewares } = callbacks[connectionType];

      this.connection.on(connectionType, callback, middlewares);
    }

    return this.connection;
  }

  public getConnection(): ContentScriptConnection {
    this.ensureConnectionIsInitialized();

    return this.connection!;
  }

  public getConnectionPorts(): IConnectionPorts {
    return this.connection!.ports;
  }

  public getConnectedPort(): Promise<IPort | undefined> {
    this.ensureConnectionIsInitialized();

    if (environment.IS_DEV) {
      return this.getActiveConnectionPort();
    }

    return this.getFractalConnectionPort();
  }

  public async getFractalConnectionPort(): Promise<IPort | undefined> {
    this.ensureConnectionIsInitialized();

    // get current active tab
    const fractalTabs = await WindowsService.getFractalTabs();

    if (fractalTabs.length === 0) return;

    // get connection ports
    const connectionPorts = this.getConnectionPorts();

    // query ports to get the active one
    for (const portId in connectionPorts) {
      const connectedPort = connectionPorts[portId];

      for (const fractalTab of fractalTabs) {
        if (connectedPort.port?.sender?.tab?.id === fractalTab.id)
          return connectedPort;
      }
    }
  }

  public async getActiveConnectionPort(): Promise<IPort | undefined> {
    this.ensureConnectionIsInitialized();

    // get current active tab
    const activeTabs = await WindowsService.getActiveTabs();

    if (activeTabs.length === 0) return;

    // get connection ports
    const connectionPorts = this.getConnectionPorts();

    // query ports to get the active one
    for (const portId in connectionPorts) {
      const connectedPort = connectionPorts[portId];

      for (const activeTab of activeTabs) {
        if (connectedPort.port?.sender?.tab?.id === activeTab.id)
          return connectedPort;
      }
    }
  }

  public invoke(
    method: ConnectionTypes,
    args: any[] = [],
    portId: string,
  ): Promise<any> {
    return this.getConnection().invoke(method, args, portId);
  }

  private ensureConnectionIsInitialized() {
    if (this.connection === undefined) {
      throw ERROR_CONTENT_SCRIPT_CONNECTION_NOT_INITIALIZED();
    }
  }
}

const connection: Connection = Connection.getInstance();

export default connection;
