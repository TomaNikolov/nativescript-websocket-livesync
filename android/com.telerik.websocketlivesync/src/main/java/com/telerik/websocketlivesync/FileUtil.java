package com.telerik.websocketlivesync;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class FileUtil {

    public static void copyFileStream(InputStream inputStream,
                                      FileOutputStream outputStream) throws IOException {
        byte[] buffer = new byte[1024 * 10];
        int bytesRead;
        while ((bytesRead = inputStream.read(buffer)) != -1) {
            outputStream.write(buffer, 0, bytesRead);
        }
    }

    public static ByteArrayInputStream createInputStream(String base64Encoded) {
        byte[] base64Decoded = android.util.Base64.decode(base64Encoded, android.util.Base64.DEFAULT);
        return new ByteArrayInputStream(base64Decoded);
    }

    public static void extractFile(InputStream inputFileStream, boolean closeInputStream, String outputPath) throws IOException {
        FileOutputStream outputFileStream = null;
        try {
            outputFileStream = new FileOutputStream(outputPath);

            FileUtil.copyFileStream(inputFileStream, outputFileStream);
        } finally {
            try {
                if (closeInputStream && inputFileStream != null) {
                    inputFileStream.close();
                }
                if (outputFileStream != null) {
                    outputFileStream.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static void deletePath(File filePath) throws IOException {
        if (filePath.exists()) {
            filePath.setWritable(true);
            if (!filePath.delete()) {
                throw new IOException("Cannot delete path: " + filePath.getPath());
            }
        }
    }

    public static void renamePath(File srcPath, File dstPath) throws IOException {
        if (!srcPath.renameTo(dstPath)) {
            throw new IOException("Cannot rename path from: " + srcPath.getPath() + " to: " + dstPath.getPath());
        }
    }
}
