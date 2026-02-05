import type { RpcProcedures, RpcMessages } from "@smithers/shared";

type RpcRequestMap = RpcProcedures;
export type RpcMessageMap = RpcMessages;

export type RpcHandlers = {
  requests: {};
  messages: { [K in keyof RpcMessageMap]?: (payload: RpcMessageMap[K]) => void };
};

export type RpcRequestFns = {
  [K in keyof RpcRequestMap]: (params: RpcRequestMap[K]["params"]) => Promise<RpcRequestMap[K]["response"]>;
};

export type RpcClient = {
  request: RpcRequestFns;
};

export type RpcFactory = (handlers: RpcHandlers) => RpcClient;
