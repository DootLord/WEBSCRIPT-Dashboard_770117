# WEBSCRIPT Coursework for the Univesity of Portsmouth
### https://github.com/DootLord/webscript3

Student Number: 770117

### A lightweight and easy to use dashboard service.

A single page dashboard for use at home. Featuring functionality to keep track of friends through the use of the Twitter Pannel
or to keep up to date with the latest news and gossep. Due to the nature of the dashboard a lot of infomation is available to you
at first glance, and clicking on elements will often give additonal details or peform a function for you. Clicking on a news colmn for 
example will redirect you to the actual news source on a new tab.

# Functionality

## Todo List

### *Function*

The dashboard allows for todo list that can be altered by any user sharing the server at a time, allowing for an easy way for people in the same home to keep track on what needs to be done for the day, and to enusre that everyone is on the same page.

### *Use*

A new todo item can be added to the todo list by typing in any text that you want to be used for the prompt. Once done, click the add button to the right of the text box. Once you've done so, the to-do list should be updated. 

## Weather & Time

### *Function*

The dashboard supplys the current server time constantly, as well as supplying the user with infomation about the current day. Such as the weather that they should expect as well as how hot they can expect it to be. As no weather estimation is perfect, a high and a low temp for the day is also supplied. Low temps being BLUE expected temp being GREEN and the highest temp being RED

### *Use*

To set your weather area, go to the options screen and drop the dropdown select the area that best reprosents where you live. Upon closing the options pane the weather pannel will be updated with your current weather for the selected area.


## Twitter Feed

### *Function*

Once a user has been logged in (Ideally a family account) The household can then keep up to date with their latest tweets. Tweets are shown with basic infomation that can be enhanced by clicking. On click a new pannel will appear, showing the full text of the tweet. Users can then click this text to open a new window to the actual tweet itself. If no tweets can be obtained from the server this pannel is hidden.

### *Use*

A user will first have to be logged in. This can be done by accessing the options area in the top right and clicking login. After logging in, you should be redirected to the dashboard. Tweets can be clicked on to show more infomation. To logout, simply go to the options menu again and click logout. The twitter pannel should disappear

*Note There's a bug with the twitter feed on inital login, ocassionally the twitter pannel might not update and end up showing a blank pannel. A refresh should recitify this issue.*

## File Server

### *Function*

A file server is built into the application, allowing for backing up any files or photos you wish. Alternitively this could be used as a way to host files for other family members to download as and when they feel like it. The server allows for the uploading of files, downloading of files, renaming and deletion. As well as a refresh button to see any updates made to the file server.

### *Use*

A file can be uploaded via the Choose File button and Upload button, found at the top of the element. Click Choose File to select the file you want to upload and clicking upload will upload it to the server. There are buttons available to manipulate these files. Download will download to your machine whatever file it is that is currently selected. Modify allows the user to change the filename of the file and on pressing enter, will rename it. Delete will delete whatever selected file is on the clientside and refresh will pull all the latest and new files from the server.

Ideally make sure that you refresh the client before running an operation that may change the file in any way.

### *Photo Gallery*

### *Function*
A simple and easy to use photo gallery, to allow for pictures to constantly iterate from one after another during a small time period. Be it family photos or anything that you may want. If no photos are available then this pannel is hidden.

### *Use*
Upload images using the options pannel that can be accessed using the cogs in the upper right of the screen. Very simular to file server operation, select a photo you wish to upload and then click the upload button. The photo gallery should now be shown. Should you wish to delete any photos simply open the option pannel again and then click on the photo. If there are no images left the photo gallery should become hidden again.
