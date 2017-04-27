//the global transfer object that is used for uploading
var transferObject = null;

/**
 * Callback for failure call of Signiant.Mst.initialize()
 * 
 * @return null
*/
var failureCallback = function () {
    /* Launch the Signiant installer widget into the 'mainContent' div. */
    var installWidget = new Signiant.Mst.SigAppInstallWidget('mainContent', {
        dismissInstallAppCallback: checkForSigniant.bind(self, 'false'), //called when the user clicks "I have the app" in the install widget
        installAppCompleteCallback: initializeUploadObject //called when the app install is verified
    });
    installWidget.showInstallerWindow();
}

/**
* Check for the plugin. This is the first method to be called on document load (see last function below).
* On success, call initializeUploadObject. If the plugin doesn't load, call pluginNotLoaded
* 
* @return null
*/
function checkForSigniant(failQuick) {
    console.log("Check for Signiant App");
    Signiant.Mst.configure({
        networkConnectivityErrorCallback: networkConnectivityErrorCallback,
        appCommunicationErrorCallback: appCommunicationErrorCallback,
        networkConnectivityRestoredCallback: networkConnectivityRestoredCallback
    });

    /* 
    You can call detectPlugin or the Signiant.Mst.initialize method below.
    detectPlugin provides default functionality that is easier to implement.
    Signiant.Mst.initialize allows you to override what happens if the app is not loaded (failureCallback)
    */
    detectPlugin({ success: initializeUploadObject, error: appNotLoaded });

    /*
    Signiant.Mst.initialize(initializeUploadObject, failureCallback, {
      timeout: 10000, // how long initialize will take to timeout, default: 1 second
      withAppTimeout: 20000, // how long initialize will take to timeout if we have detected cookie that signals the app is intalled, default: 5 seconds
      failPreemptivelyIfAppNotInstalled: failQuick // call error right away if cookie not present, default: true
    });
    */
}

/**
 * The Signiant App couldn't be loaded - display an error message
 *
 * @return null
*/
function appNotLoaded() {
    alert("Signiant App Failed to load. This demo will not work.");
}

/**
 * Setup the upload object - the global var transferObject
 *
 * @return null
*/
function initializeUploadObject() {
    //create a new upload Object
    transferObject = new Signiant.Mst.Upload();
    //set the default server
    transferObject.setServer(defaultServer);
    transferObject.setTrustedCA(trustCertificate);
    transferObject.setCredentials(userName, password);

    //the following methods are self explanatory
    transferObject.subscribeForTransferErrors(transferErrors);
    transferObject.subscribeForBasicEvents(transferEvents);
    transferObject.subscribeForTransferProgress(transferProgressCallback);
    //setup the storage config options to upload to the right S3 bucket
    //send the server the API key
    transferObject.setApiKey(apikey); //required
}

// This will be called when the Transfer API detects network loss (will not throw if only changing networks)
// The Signiant App should recover and continue transfer if network timeout is < 1 minute
function networkConnectivityErrorCallback() {
    console.log("Network Connectivity Loss Detected");
    alert("Network Loss Detected, Waiting for Network To Return");
}

// This will be called when the Transfer API detects network connectivity is restored
// The Signiant App should recover and continue transfer
function networkConnectivityRestoredCallback() {
    console.log("Network Connectivity Restored");
    alert("Network Connectivity Restored");
    if (transferObject === 'undefined') {
        alert("transfer object undefined")
    } else {
        if (transferObject.currentTransferState == Signiant.Mst.transferState.TRANSFERRING) {
            alert("state == TRANSFERRING")
        } else {
            alert("state != TRANSFERRING")
        }
    }
}

// The Signiant App would have cancelled any running transfers if this callback is fired
function appCommunicationErrorCallback() {
    console.log("Connection to Signiant App Lost");
    alert("Your connection has been lost. Press launch application on the next dialog.")
    reInitializeApp();
}

/* Called in response to success initialize on Signiant.mst.initialize */
function reIntializeSuccess() {
    console.log("Connection to Signiant App Re-established");
    alert("Connection to Signiant App Re-established");
    if (transferObject !== 'undefined') {
        console.log("Checking to restart transfer");
        // check and see if transfer was running, if so restart transfer
        // we could send a cancel as well at this point to ensure the previous transfer was cancelled
        // but Signiant App will cancel transfers when communication with Browser lost for significant period of time
        if (transferObject.currentTransferState == Signiant.Mst.transferState.TRANSFERRING) {
            console.log("Restarting Transfer");
            alert("Restarting Transfer in Progress");
            // Set back to IDLE, pending this being tracked in Transfer API
            transferObject.currentTransferState = Signiant.Mst.transferState.IDLE;
            transferObject.startUpload();
        }
    }
}

/* Called in response to failure to initialize on Signiant.mst.initialize */
function reInitializeFailure() {
    console.log("Re-Initialize Signiant App Failed, retrying");
    alert("Signiant App Connection Lost, Retrying...");
    reInitializeApp();
}

/* Timeout is time to wait for app to respond to new session request. We suggest 20 seconds, but you may want to lower this. If the timer completes and no message is received, reInitializeFailure will fire  */
function reInitializeApp() {
    console.log("Attempt Re Initialize Connection to Signiant");
    var options = { "timeout": 20000 };
    Signiant.Mst.initialize(reIntializeSuccess, reInitializeFailure, options);
}

function appErrorFailure() {
    alert("Signiant App Failed to load. Transfer Services will not be available.");
}

/**
 * Open the file selection dialog, and call callbackUpload when it closes.
 *
 * @return null
*/
function chooseFiles() {
    transferObject.chooseUploadFiles(callbackUpload);
}

/**
* Callback when the file picker is closed. 
*
* @return null
*/
var callbackUpload = function (event, selectedFiles) {
    var filesArray = new Array();
    for (var i = 0; i < selectedFiles.length; i++) {
        filesArray.push(selectedFiles[i].path);
    }
    //set the files to upload on the transfer object
    transferObject.setFilesToUpload(filesArray);
    //optionally set the subfolder for the files to go into (eg. "/folder1/folder2/folder3")
    //transferObject.setSubFolder(destinationFolderPath);

    //start the upload
    transferObject.startUpload();
    //modify the UI
    $("#contentUploadText").html("Starting upload...");
    $("#contentListing").fadeTo(1000, 0.3);
    $("#contentUpload").on('click', cancelUpload);
}

/**
 * Display progress of upload (doesn't work on download at the moment.)
 *
 * @return null
*/
function transferProgressCallback(transferObject, numBytesSent, numBytesTotal, estimatedTimeRemaining) {
    var percent = Math.round((numBytesSent / numBytesTotal) * 100);
    $("#contentUploadText").html(percent + "% completed.<p>Completes in about " + moment.duration(estimatedTimeRemaining * 1000).humanize() + "</p>");
}

/**
 * Log errors to the JavaScript console.
 *
 * @return null
*/
function transferErrors(transferObject, eventCode, eventMsg, propertyName) {
    //alert("Sample Upload Transfer Error " + eventCode + ", " + eventMsg);
}

/**
* Display feedback to the user depending on what events are returned
*
* @return null
*/
function transferEvents(transferObject, eventCode, eventMsg, eventData) {
    //alert("Sample Upload Transfer Event " + eventCode + ", " + eventMsg);
    var message = eventMsg;
    switch (eventCode) {
        case "TRANSFER_STARTED":
            $("#uploadFileChooser").attr("class", "icon-completed");
            break;

        case "TRANSFER_CANCEL_EVENT":
        case "TRANSFER_COMPLETED":
            transferObject.clearAllFiles();
            setTimeout(function () { resetUpload() }, 900);
            break;

        case "TRANSFER_ERROR_EVENT":
            transferObject.clearAllFiles();
            $("#contentUploadText").html("Upload something...");
            $("#uploadFileChooser").attr("class", "icon-add");
            $("#contentListing").fadeTo(1000, 1);
            $("#contentUpload").unbind('click');
            $("#contentUpload").click(chooseFiles);
            break;

        default:
            return
    }
}

/**
* Gracefully cancel the upload
*
* @return null
*/
function cancelUpload() {
    $("#contentUploadText").html("Cancelling upload<p>This will take a few seconds.");
    console.log("Cancel Upload files");
    try {
        transferObject.cancel();
    } catch (exception) {
        alert("Exception in Cancel Upload Files" + exception);
    }
}

/**
 * Download a file from the cloud.
 *
 * @param {String} fileName The complete name of the file to download from S3 (can also be a "directory")
 * Note that this method is not called in this example. It is shown here for completeness.
 * @return null
*/
function downloadFile(fileName) {
    //create a new download Object
    var download = new Signiant.Mst.Download();
    //set the download server
    download.setServer(defaultServer);
    //set the storage configuration
    download.setTrustedCA(trustCertificate);
    download.setCredentials(userName, password);
    //set the probeLB (probe load balancer) to true (always true for Flight).
    download.setProbeLB(true);
    //set the files to download to the file that is passed
    download.setFilesToDownload(new Array(fileName));
    //open the file picker so the user selects where to save the file.
    download.chooseDownloadFolder(function (message, folder) {
        //set the download folder to what they set
        download.setDownloadFolder(folder);
        //double check that we actually set the files by calling getFiles on the download object instead of using the fileName that as passed
        selectedFiles = download.getFiles();
        if (selectedFiles.length == 0)
            alert("No files Selected for Download");
        else {
            //do the download
            download.startDownload();
        }
    });
}

/**
 * Reset the ability to upload files.
 *
 * @return null
*/
function resetUpload() {
    $("#contentUpload").unbind('click');
    $("#contentUpload").click(chooseFiles);
    $("#contentUploadText").html("Upload something...");
    $("#uploadFileChooser").attr("class", "icon-add");
}

/**
 * Runs when the document is fully loaded.
 * 
 * @return null
*/

$(document).ready(function () {
    //does the Signiant app exist?
    checkForSigniant(true);
    //update the container display to show the items currently in the bucket.  
    resetUpload();
});