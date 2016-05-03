---
layout: page
title: Download
permalink: tapi/v2/download
---

## Signiant.Mst.Download
This class extends Signiant.Mst.Transfer. 

This object allows the programmer to perform an accelerated download using the Transfer API. The Signiant.Mst.Download object exposes functions to accomplish things such as picking the destination folder for downloaded files/folders, setting the authentication credentials for the destination server, etc. 

One Signiant.Mst.Download object must be created per download.

```javascript
transferObject = new Signiant.Mst.Download();
```

# Methods

## clearFiles 
This will clear the files/folders specified in the filesArray parameter, from the list of files to be uploaded. The files/folders must be specified using their full paths in the filesArray parameter. An exception is thrown if the filesArray parameter is undefined or datatype of filesArray is not an Array.

```javascript
clearFiles(filesArray)
```

## clearAllFiles
Clears all the files from the list of files to be uploaded.

```javascript
clearAllFiles 
```

## getFilesCollisionHandlingMode
Returns the value of the configuration property that determines how file-name collisions are handled for downloaded content. The following values can be returned: version and overwrite.

## getFilePathHandlingMode
Returns the value of the configuration property that determines the folder-structure that is recreated for downloaded content. The following values can be returned: FLAT, PATH and FULL.

## setDownloadFolder
Sets the value of the configuration property that determines where the downloaded content will go.

```javascript
transferObject.setDownloadFolder("/home/user")
```

## setFileCollisionHandlingMode
Sets the value of the configuration property that determines how file-name collisions are handled for downloaded content. Valid values for mode are: version and overwrite. 

The mode value behavior is:
* version: If the name of a file/folder being downloaded collides with a file/folder that already exists in the destination directory, then a version suffix is appended to the name of the file/folder being downloaded. 
* overwrite: If the name of a file/folder being downloaded collides with a file/folder that already exists in the destination directory, then the pre-existing file/folder is overwritten with the file/folder being downloaded.
An exception is thrown if mode is undefined, empty or invalid.

```javascript
transferObject.setFileCollisionHandlingMode('version')
```

## setFilePathHandlingMode
Sets the value of the configuration property that determines the folder-structure that is recreated for downloaded content. Valid values for mode are: FLAT, PATH and FULL. An exception is thrown if mode is undefined, empty or invalid.

The mode value behavior is:
* FLAT: All downloaded content goes directly into the directory specified in the invocation of the setDownloadFolder method. See setFileCollisionHandlingMode for more information on using file-name collision handling with FLAT file-path handling mode.
* PATH: All downloaded content goes into the directory specified in the invocation of the setDownloadFolder method, but the relative path of the content is duplicated, as it exists in the content repository on the source server.
* FULL: All downloaded content goes into the directory specified in the invocation of the setDownloadFolder method, but the full path of the content is duplicated, as it exists in the content repository on the source server.

```javascript
transferObject.setFilePathHandlingMode('FLAT')
```

## setFilesToDownload
This function allows you to specify the files/folders to be downloaded. The files/folders must be specified using the full path in the filePathArray parameter, and must exist on the source server from where they are being downloaded.

```javascript
transferObject.setFilesToDownload(ArrayOfFiles)
```

## startDownload
Starts the download of the specified files/folders from the source server to the user's destination directory. If the specified API key is not valid, or if the Signiant App is not installed, an exception is thrown. This function simply notifies the Media Shuttle Transfer Plug-in to begin the transfer, and then returns. Further notifications related to the state/progress of the transfer can be retrieved by registering event listeners with the subscribeForBasicEvents and subscribeForTransferProgress functions.