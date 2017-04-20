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
        return  new ByteArrayInputStream(base64Decoded);
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

    public File createProjectFile(String path, File projectDir) throws Exception {
        File newFile = new File(projectDir, path);
        if (!newFile.getAbsolutePath().startsWith(projectDir.getAbsolutePath())) {
            throw new Exception("Security error - path: " + path + " points outside project directory");
        }

        return newFile;
    }
}
