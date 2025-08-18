import React, { createContext, useContext } from 'react';
import { Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
}

const defaultSocketContext: SocketContextType = { socket: null };

const SocketContext = createContext<SocketContextType>(defaultSocketContext);

export const useSocket = () => {
  const context = useContext(SocketContext);
  return context;
};

export { SocketContext };
