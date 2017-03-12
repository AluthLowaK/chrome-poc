# cloudforcehr-chrome
A Small extension to allow Chrome users to use cloudforcehr

All this extension does it adjust a hidden html form element value. 
if you look at the code from *[link removed by request of clourforcehr]*
you can clearly see that the compatibility flag is being sent from the client.

```javascript
document.getElementById("hidIsCompatible").value = "yes";
```
added extra code to modify the webRequest User-Agent header to spoof IE-9. 

```javascript
chrome.webRequest.onBeforeSendHeaders.addListener(...);

if (headers[i].name == 'User-Agent') {
  headers[i].value = "Mozilla/5.0 (Windows; U; MSIE 9.0; WIndows NT 9.0; en-US))";
```

## build 
- you can build the extension your self from chrome.

## install
- download latest crx file from build directory (after cloning repo) or from the releases folder https://github.com/devzer01/cloudforcehr-chrome/releases
- drag it to chrome://extensions

## misc
- Tested with Chrome Version 40.0.2214.115 (64-bit) Ubuntu 14.04

## bugs
- please create an issue on github if you find any bugs and or submit a pull-request

# disclaimer 
i am not affiliated with CloudForce HR, please use this software at your own risk. Some functions of cloudforce-hr may not work if the developers of CloudForce HR has not tested them with Chrome.
