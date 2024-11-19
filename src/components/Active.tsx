import React, { useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketProvider";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface Person {
    username: string;
    _id: string;
}

interface UserPayload extends JwtPayload {
    _id: string;
    username: string;
    email: string;
}

interface Invite {
    from: Person;
    to: Person;
    timestamp: number;
    roomId?: string;
}

const Active = () => {
    const { socket, isConnected } = useSocket();
    const [people, setPeople] = useState<Person[]>([]);
    const [error, setError] = useState<string>("");
    const [search, setSearch] = useState("");
    const [pendingInvites, setPendingInvites] = useState<Map<string, Invite>>(new Map());
    const [sentInvite, setSentInvite] = useState<string | null>(null);
    const [currentRoom, setCurrentRoom] = useState<string | null>(null);
    const [messages, setMessages] = useState<Array<{ sender: string, text: string }>>([]);
    const [messageInput, setMessageInput] = useState("");
    const [userData, setUserData] = useState<UserPayload | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode<UserPayload>(token);
                setUserData(decoded);
                console.log("Current user data:", decoded);
            } catch (error) {
                console.error("Token decode error:", error);
                setError("Authentication error");
            }
        }
    }, []);

    const filteredPeople = people.filter(person => 
        person._id !== userData?._id && 
        person.username.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        if (!socket) {
            console.log("No socket connection available");
            return;
        }

        // Log socket state for debugging
        console.log('Socket state:', {
            connected: socket.connected,
            id: socket.id,
            auth: socket.auth
        });

        const handleActive = (activePeople: Person[]) => {
            console.log("Active users updated:", activePeople);
            setPeople(activePeople);
        };

        const handleChatInvite = (invite: Invite) => {
            console.log("Received chat invite:", invite);
            setPendingInvites(prev => {
                const next = new Map(prev);
                next.set(invite.from._id, invite);
                return next;
            });

            // setTimeout(() => {
            //     setPendingInvites(prev => {
            //         const next = new Map(prev);
            //         next.delete(invite.from._id);
            //         return next;
            //     });
            //     socket.emit("inviteExpired", invite);
            // }, 20000);
        };

        const handleInviteAccepted = ({ roomId, from }: { roomId: string, from: Person }) => {
            console.log("Invite accepted:", { roomId, from });
            setSentInvite(null);
            setCurrentRoom(roomId);
            setMessages([]);
        };

        const handleInviteDeclined = ({ from }: { from: Person }) => {
            console.log("Invite declined by:", from);
            setSentInvite(null);
            setError(`${from.username} declined your invitation`);
            setTimeout(() => setError(""), 3000);
        };

        // const handleInviteExpired = ({ from }: { from: Person }) => {
        //     console.log("Invite expired:", from);
        //     if (sentInvite === from._id) {
        //         setSentInvite(null);
        //         setError("Invite expired");
        //         setTimeout(() => setError(""), 3000);
        //     }
        // };

        // const handleInviteError = ({ error }: { error: string }) => {
        //     console.error("Invite error:", error);
        //     setError(error);
        //     setSentInvite(null);
        //     setTimeout(() => setError(""), 3000);
        // };

        const handleMessage = ({ sender, text }: { sender: string, text: string }) => {
            setMessages(prev => [...prev, { sender, text }]);
        };

        const handlemsg=({roomId, from, text}:{roomId: any, from: any, text: any})=>{
            console.log(text)
        }

        socket.on("msg", handlemsg);

        socket.on("active", handleActive);
        socket.on("chatInvite", handleChatInvite);
        socket.on("inviteAccepted", handleInviteAccepted);
        socket.on("inviteDeclined", handleInviteDeclined);
        // socket.on("inviteExpired", handleInviteExpired);
        socket.on("message", handleMessage);

        socket.emit("getActive");

        return () => {

            socket.off("msg", handlemsg);

            socket.off("active", handleActive);
            socket.off("chatInvite", handleChatInvite);
            socket.off("inviteAccepted", handleInviteAccepted);
            socket.off("inviteDeclined", handleInviteDeclined);
            // socket.off("inviteExpired", handleInviteExpired);
            socket.off("message", handleMessage);
        };
    }, [socket]);

    const sendInvite = (to: Person) => {
        if (!socket) {
            console.error("No socket connection");
            setError("Connection error. Please try again.");
            return;
        }

        if (!userData) {
            console.error("No user data available");
            setError("Authentication error. Please try again.");
            return;
        }

        console.log("Sending invite to:", to);
        console.log("Current user data:", userData);

        const from: Person = {
            _id: userData._id,
            username: userData.username
        };

        socket.emit("sendInvite", { from, to });
        setSentInvite(to._id);

        // setTimeout(() => {
        //     setSentInvite(prev => prev === to._id ? null : prev);
        // }, 20000);
    };

    const handleInviteResponse = (invite: Invite, accept: boolean) => {
        console.log(`${accept ? 'Accepting' : 'Declining'} invite:`, invite);
        setPendingInvites(prev => {
            const next = new Map(prev);
            next.delete(invite.from._id);
            return next;
        });

        if (accept) {
            socket?.emit("acceptInvite", invite);
        } else {
            socket?.emit("declineInvite", invite);
        }
    };

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        // if (!messageInput.trim() || !currentRoom || !socket?.user) return;

        console.log(messageInput)

        socket?.emit("message", {
            roomId: currentRoom,
            text: messageInput,
            sender: socket?.user?.username
        });
        setMessageInput("");
    };

    if (currentRoom) {
        return (
            <div>
                <button onClick={() => setCurrentRoom(null)}>
                    ← Back to Users
                </button>



                <h1>WebRTC Video Chat</h1>
            <video id="localVideo" autoPlay playsInline></video>
            <video id="remoteVideo" autoPlay playsInline></video>

            <div>
                <button id="createOfferBtn">Create Offer</button>
                <button id="answerBtn">Answer</button>
                <button id="disconnectBtn">Disconnect</button>
            </div>

    
            <script src="webrtc.js"></script>



            

                <div>
                    <div>
                        {messages.map((msg, idx) => (
                            <div key={idx}>
                                <strong>{msg.sender}: </strong>{msg.text}
                            </div>
                        ))}
                    </div>

                    <form onSubmit={sendMessage}>
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Type a message..."
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1>
                Online Users
                <span>●</span>
            </h1>

            <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {error && (
                <div>
                    <p>Error</p>
                    <p>{error}</p>
                </div>
            )}

            {Array.from(pendingInvites.values()).map((invite) => (
                <div key={invite.from._id}>
                    <span>{invite.from.username} wants to chat</span>
                    <div>
                        <button onClick={() => handleInviteResponse(invite, true)}>
                            Accept
                        </button>
                        <button onClick={() => handleInviteResponse(invite, false)}>
                            Decline
                        </button>
                    </div>
                </div>
            ))}

            <div>
                {filteredPeople.map((person) => (
                    <div key={person._id}>
                        <div>
                            <span />
                            <p>{person.username}</p>
                        </div>
                        <button
                            onClick={() => sendInvite(person)}
                            disabled={sentInvite === person._id}
                        >
                            {sentInvite === person._id ? 'Sending Invite...' : 'Invite'}
                        </button>
                    </div>
                ))}
            </div>

            {filteredPeople.length === 0 && !error && (
                <p>
                    {isConnected ? 'No other users online' : 'Connecting...'}
                </p>
            )}
        </div>
    );
};

export default Active;