//
//  ConnectionManager.swift
//
//  Created by Toma Nikolov on 4/10/17.
//  Copyright © 2017 Toma Nikolov. All rights reserved.
//

import Foundation
import SocketIO

public final class ConnectionManager {
    
    public private(set) var socket: SocketIOClient
    
    public init(_ url: String) {
        self.socket = SocketIOClient(socketURL: URL(string: url)!, config: [.log(true), .forcePolling(true)])
        attachEvents();
        self.socket.connect()
    }
    
    private func attachEvents() {
        self.socket.on("connect") {data, ack in
            print(type(of:ack))
            let uuid = UUID().uuidString
            self.socket.emit("handshake", uuid)
        }
        
        self.socket.on("livesync.create") {data, ack in
            print(type(of: data[0]));
            if let dataString = data[0] as? String {
                WebSocketLiveSync.syncApplication(data: dataString, ack: ack)
            }
        }
        
        self.socket.on("livesync.delete") { data, ack in
            if let filesTodelete = data[0] as? [String] {
                WebSocketLiveSync.delete(files: filesTodelete, ack: ack)
            }
        }
        
        self.socket.on("livesync.restart") { data, ack in
            WebSocketLiveSync.restart()
        }
        
        self.socket.on("livesync.rename") { data, ack in
            if let filesToRename = data[0] as? [[String:String]] {
                WebSocketLiveSync.rename(files: filesToRename, ack: ack)
            }
            
        }
    }
}
