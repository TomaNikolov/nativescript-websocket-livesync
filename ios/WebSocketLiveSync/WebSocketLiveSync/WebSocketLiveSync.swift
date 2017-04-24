//
//  WebSocketLiveSync.swift
//
//  Created by Toma Nikolov on 4/10/17.
//  Copyright © 2017 Toma Nikolov. All rights reserved.
//

import Foundation
import Zip
import SocketIO

public class WebSocketLiveSync {
    public static func syncApplication(data: String, ack: SocketAckEmitter) {
        let base64Encoded  = Data(base64Encoded: data)!;
        let writePath = NSTemporaryDirectory().appending("/package.zip")
        let urlPath = URL(fileURLWithPath: writePath)
        do {
            try base64Encoded.write(to: urlPath)
            let destinationPath = self.getLiveSyncDir();
            self.extractArchiveAtPath(archivePath: writePath, destinationPath: destinationPath,  progressHandler: nil, completionHandler: {(error:Error?) in
                var errors = String();
                if error != nil {
                    errors += self.formatError(error: error!)
                    print(error!)
                }
                
                self.ackWith(ack: ack, error: errors)
            })
        } catch {
            ack.with(self.formatError(error: error))
            print(error)
        }
    }
    
    public static func delete(files:[String], ack: SocketAckEmitter) {
        let fileManager = FileManager.default
        var errors = String();
        for file in files {
            let filePathUrl = URL(fileURLWithPath: self.getLiveSyncDir()).appendingPathComponent(file)
            do {
                try fileManager.removeItem(at:filePathUrl)
            } catch {
                errors += self.formatError(error: error)
                print(error)
            }
        }
        
        self.ackWith(ack: ack, error: errors)
    }
    
    public static func rename(files:[[String:String]], ack: SocketAckEmitter) {
        var errors = String();
        for file in files {
            do{
                let srcFile = URL(fileURLWithPath: self.getLiveSyncDir()).appendingPathComponent(file["source"]!)
                let dstFile = URL(fileURLWithPath:self.getLiveSyncDir()).appendingPathComponent(file["destination"]!)
                try FileManager.default.moveItem(at: srcFile, to: dstFile)
            } catch {
                errors += self.formatError(error: error)
                print(error)
            }
        }
        
       self.ackWith(ack: ack, error: errors)
    }
    
    public static func restart() {
        //TODO: We will call the real restart method, which will be implemented in ios-runtime.
        exit(0)
    }
    
    private static func getLiveSyncDir() -> String {
        //TODO: append livesync dir
        let path = NSSearchPathForDirectoriesInDomains(.libraryDirectory, .userDomainMask, true).first
        return path!;
    }
    
    private static func formatError(error: Error) -> String{
        return String(format: "error: %@\n", error.localizedDescription)
    }
    
    private static func ackWith(ack: SocketAckEmitter, error: String) {
       !error.isEmpty ? ack.with(error) : ack.with()
    }
    
    private static func extractArchiveAtPath(archivePath: String, destinationPath: String, progressHandler: ((Double) -> Void)?, completionHandler: ((Error?) -> Void)?) {
        DispatchQueue.global().async {
            let fileManager = FileManager.default
            if !fileManager.fileExists(atPath: destinationPath) {
                do {
                    try FileManager.default.createDirectory(atPath: destinationPath,
                                                            withIntermediateDirectories:true,
                                                            attributes:nil)
                } catch {
                    if completionHandler != nil {
                        completionHandler!(error);
                    }
                    
                }
            }
            
            TLKZipArchive.unzipFile(atPath: archivePath, toDestination: destinationPath, overwrite: true, password: nil, progressHandler: { (entry:String?, zipInfo:unz_file_info, entryNumber:Int, total:Int) in
                let progress = (Double)(entryNumber + 1) / ((Double)(total)  * 1.0)
                if progressHandler != nil {
                    progressHandler!(progress);
                }
            }, completionHandler: { (path:String?, succeeded:Bool, error:Error?) in
                do {
                    try fileManager.removeItem(atPath:archivePath);
                } catch {
                    if completionHandler != nil {
                        completionHandler!(error);
                    }
                }
                
                if completionHandler != nil {
                    completionHandler!(error);
                }
            })
        }
    }
}
