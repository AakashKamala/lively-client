// import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";

// interface customSocket extends Socket{
//     user?: {
//         username: string;
//         _id: string;
//     }
// }

// interface ISocketContext {
//     socket: customSocket | null;
//     isConnected: boolean;
// }

// const SocketContext = createContext<ISocketContext | undefined>(undefined);

// const SocketProvider = ({ children }: { children: ReactNode }) => {
//     const [socket, setSocket] = useState<Socket | null>(null);
//     const [isConnected, setIsConnected] = useState(false);

//     useEffect(() => {
//         const token = localStorage.getItem("token");
        
//         if (!token) {
//             console.error("No token found");
//             return;
//         }

//         const socketInstance = io("http://localhost:8009", {
//             auth: { token },
//             reconnection: true,
//             reconnectionDelay: 1000,
//             reconnectionAttempts: 5
//         });

//         const onConnect = () => {
//             console.log("Socket connected!", socketInstance.id);
//             setIsConnected(true);
//         };

//         const onDisconnect = (reason: string) => {
//             console.log("Socket disconnected:", reason);
//             setIsConnected(false);
//         };

//         const onError = (error: Error) => {
//             console.error("Socket error:", error);
//             setIsConnected(false);
//         };

//         const onConnectError = (error: Error) => {
//             console.error("Connection error:", error);
//             setIsConnected(false);
//         };

//         socketInstance.on("connect", onConnect);
//         socketInstance.on("disconnect", onDisconnect);
//         socketInstance.on("error", onError);
//         socketInstance.on("connect_error", onConnectError);

//         setSocket(socketInstance);

//         return () => {
//             console.log("Cleaning up socket connection");
//             if (socketInstance) {
//                 socketInstance.off("connect", onConnect);
//                 socketInstance.off("disconnect", onDisconnect);
//                 socketInstance.off("error", onError);
//                 socketInstance.off("connect_error", onConnectError);
//                 socketInstance.disconnect();
//             }
//         };
//     }, []);

//     const value = {
//         socket,
//         isConnected
//     };

//     return (
//         <SocketContext.Provider value={value}>
//             {children}
//         </SocketContext.Provider>
//     );
// };

// export const useSocket = () => {
//     const context = useContext(SocketContext);
//     if (!context) {
//         throw new Error("useSocket must be used within a SocketProvider");
//     }
//     return context;
// };

// export default SocketProvider;



// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { io, Socket } from 'socket.io-client';
// import { jwtDecode, JwtPayload } from 'jwt-decode';

// interface SocketContextType {
//     socket: Socket | null;
//     isConnected: boolean;
// }

// const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

// export const useSocket = () => useContext(SocketContext);

// interface SocketProviderProps {
//     children: React.ReactNode;
// }

// export interface UserPayload extends JwtPayload {
//     _id: string;
//     username: string;
//     email: string;
// }

// export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
//     const [socket, setSocket] = useState<Socket | null>(null);
//     const [isConnected, setIsConnected] = useState(false);

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             console.log('No token found, cannot connect socket');
//             return;
//         }

//         try {
//             const userData = jwtDecode<UserPayload>(token);
//             console.log('Connecting socket with user data:', userData);

//             const newSocket = io('http://localhost:8009', {
//                 auth: { token },
//                 withCredentials: true,
//             });

//             newSocket.on('connect', () => {
//                 console.log('Socket connected successfully');
//                 setIsConnected(true);
//             });

//             newSocket.on('disconnect', () => {
//                 console.log('Socket disconnected');
//                 setIsConnected(false);
//             });

//             newSocket.on('connect_error', (error) => {
//                 console.error('Socket connection error:', error);
//                 setIsConnected(false);
//             });

//             setSocket(newSocket);

//             return () => {
//                 newSocket.close();
//             };
//         } catch (error) {
//             console.error('Token decode error:', error);
//         }
//     }, []);

//     return (
//         <SocketContext.Provider value={{ socket, isConnected }}>
//             {children}
//         </SocketContext.Provider>
//     );
// };




import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface customSocket extends Socket{
    user?: {
        username: string;
        _id: string;
    }
}

interface SocketContextType {
    socket: customSocket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
    children: React.ReactNode;
}

export interface UserPayload extends JwtPayload {
    _id: string;
    username: string;
    email: string;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found, cannot connect socket');
            return;
        }

        try {
            const userData = jwtDecode<UserPayload>(token);
            console.log('Connecting socket with user data:', userData);

            const newSocket = io('http://localhost:8009', {
                auth: { token },
                withCredentials: true,
            });

            newSocket.on('connect', () => {
                console.log('Socket connected successfully');
                setIsConnected(true);
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
                setIsConnected(false);
            });

            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                setIsConnected(false);
            });

            setSocket(newSocket);

            return () => {
                newSocket.close();
            };
        } catch (error) {
            console.error('Token decode error:', error);
        }
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};