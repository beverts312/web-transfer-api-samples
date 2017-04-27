var apikey = ""; //See above on how to get an API key.
var defaultServer = 'api-transfers.developer.mediashuttle.com';
var userName = 'transferapi';
var password = 'transferapi';
var trustCertificate = "-----BEGIN CERTIFICATE-----\nMIIE6zCCA9OgAwIBAgIBADANBgkqhkiG9w0BAQUFADCBkjELMAkGA1UEBhMCQ0Ex\nEDAOBgNVBAgTB09udGFyaW8xDzANBgNVBAcTBk90dGF3YTEhMB8GA1UEChMYU2ln\nbmlhbnQgTVMgVHJhbnNmZXIgQVBJMQ8wDQYDVQQLEwZEZXZPcHMxLDAqBgNVBAMT\nI1NpZ25pYW50IE1TIFRyYW5zZmVyIEFQSSBUcnVzdGVkIENBMB4XDTEzMDYxMjA0\nMDAwMVoXDTMzMDYxMjA0MDAwMVowgZIxCzAJBgNVBAYTAkNBMRAwDgYDVQQIEwdP\nbnRhcmlvMQ8wDQYDVQQHEwZPdHRhd2ExITAfBgNVBAoTGFNpZ25pYW50IE1TIFRy\nYW5zZmVyIEFQSTEPMA0GA1UECxMGRGV2T3BzMSwwKgYDVQQDEyNTaWduaWFudCBN\nUyBUcmFuc2ZlciBBUEkgVHJ1c3RlZCBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEP\nADCCAQoCggEBAM/iBZG81g6OgpB1u+Xiwcocx9HJeM5DSkL/L3ZVMl1pKulh9JnB\nzQryK2mvC24FwScdfqEv788cwgNzXquY2EUqz0y4ult24GziI8oyGb/OZGlP7Jax\n+2c9Rd1LV8A3z9U4IwXMHJ35pbjMnH6QjaswFl4XjSIP7XK+SBANXxq/3aE9bulL\nlx50GTjek2o7l1TkZ+gPVCDFyaGpc1ezgZ95zXTizk6jJw+JZYzcBw8xtFHx4rna\ntB3VLbTO8rVleY0wE7YSOtabb1e3Z+W3RzJ8hqueoih0wUzN+cbUH/H3dLJ/dBcQ\n59gdam3Db/pmbuiqOTWBBumZ0TVd8i1jT2MCAwEAAaOCAUgwggFEMA8GA1UdEwEB\n/wQFMAMBAf8wEQYJYIZIAYb4QgEBBAQDAgIEMAsGA1UdDwQEAwIBBjAwBglghkgB\nhvhCAQ0EIxYhVHJ1c3RlZCBERFMgQ2VydGlmaWNhdGUgQXV0aG9yaXR5MB0GA1Ud\nDgQWBBTaOaPuXmtLDTJVv++VYBiQr9gHCTCBvwYDVR0jBIG3MIG0gBTaOaPuXmtL\nDTJVv++VYBiQr9gHCaGBmKSBlTCBkjELMAkGA1UEBhMCQ0ExEDAOBgNVBAgTB09u\ndGFyaW8xDzANBgNVBAcTBk90dGF3YTEhMB8GA1UEChMYU2lnbmlhbnQgTVMgVHJh\nbnNmZXIgQVBJMQ8wDQYDVQQLEwZEZXZPcHMxLDAqBgNVBAMTI1NpZ25pYW50IE1T\nIFRyYW5zZmVyIEFQSSBUcnVzdGVkIENBggEAMA0GCSqGSIb3DQEBBQUAA4IBAQCb\n1ZLHXZM0vRUDOJpPgWv+3WDPYDcDHwfTImcsutbAobL61TRD+MBDmv89A8W8wYWk\n5MiDhBvAUVUhJm1rgLxxjOjqiX4WpikbhmMc5hjNQN0h1Ybt7XideN+DCiR/tnAv\nhMyW0efovrHwYN15XxoDN/GgMYb7kNy9Jc4mi5jt05wSaDKv1iht7VFE6K2SVuvi\nwwmz+4BaAlbp5yCDULwqtCpkaS6w05538Bfhruw9iswZcZyAK5E9iTFT0h+jpe23\nQhYpTkcLu9vhCM/7jEV6SGxRMFnV5JVPs/sGDVcdW9D9j92h+p0ti+HXiIR0TwDb\ngPIRFH2JSaYBwoIFQMPl\n-----END CERTIFICATE-----";

var destinationFolderPath = ''; //(optional) String: Path you want the file to go into (ie. folder1/folder2/)

/* AMAZON SETTINGS
** The following Amazon settings are set for Flight trials as well as for showing the files in Amazon (on the right hand column of this demo page). 
** If the files in your bucket aren't showing up, then add the following CORS policy to it as described at http://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html 
<CORSConfiguration><CORSRule><AllowedOrigin>*</AllowedOrigin><AllowedMethod>PUT</AllowedMethod><AllowedMethod>POST</AllowedMethod><AllowedMethod>GET</AllowedMethod><MaxAgeSeconds>3000</MaxAgeSeconds><AllowedHeader>*</AllowedHeader></CORSRule></CORSConfiguration>
**
*/
var amazonS3Key = ""; //AWS Key for transfers
var amazonS3Secret = ""; //AWS Secret for transfers
var amazonS3Bucket = ""; //Bucket for transfers
var amazonS3Region = "us-east-1"; //set the region of the above bucket. Required only for listing files.

/* AZURE SETTINGS
** The following Azure settings are set for Flight trials. 
** Note that this Azure information provides complete access to your Azure environment.
** DO NOT PUT THIS FILE ON THE INTERNET OR SEND IT TO PEOPLE YOU DO NOT TRUST.
** For production, use our https://manage.signiant.com site to link your Azure account and use the "configId" option below.
*/
var azureAccountName = ""; //DO NOT PUT THIS FILE ON THE INTERNET
var azureAccessKey = ""; //DO NOT PUT THIS FILE ON THE INTERNET
var azureContainer = ""; //Container for your Azure account

/* CUSTOMERS
** Link your cloud storage account at https://manage.signiant.com (Click on "Storage") to use 
** temporary access credentials, instead of having to enter AWS/Azure keys, secrets, buckets etc... in this file. 
*/
var configId = false; //GET THIS FROM https://manage.signiant.com (click on Storage).
/* When you generate an API key from https://manage.signiant.com you generate a "secret" as well. You need to use that secret to generate a "signature" on your server. */
var globalSignature = null; //JSON Web Token (JWT) calculated from server (see signature_generators folder for examples). Please note that secrets are only good for 5 minutes. You will need to refres the generation every 5 minutes.
var signatureEndPoint = ""; //url that we go to retrieve a signature. 

/* FILE DESTINATION 
** Change the folder path that the file will go into.
*/
var destinationFolderPath = ''; //(optional) String: Path you want the file to go into (ie. folder1/folder2/)