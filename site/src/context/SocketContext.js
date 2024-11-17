import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://26.177.53.250/socket.io/',{
      transports: ['websocket'],
    }
    );

    socketRef.current.on('connect', () => {
      console.log('Успешно подключено к серверу');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Соединение с сервером потеряно');
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};