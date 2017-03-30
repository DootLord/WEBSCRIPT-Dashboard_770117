# WEBSCRIPT Coursework for the University of Portsmouth

## <https://github.com/DootLord/webscript3>

Student Number: 770117

## A lightweight and easy to use dashboard service.

A single page dashboard for use at home. Featuring functionality to keep track of friends through the use of the Twitter Panel or to keep up to date with the latest news and gossip. Due to the nature of the dashboard a lot of information is available to you at first glance, and clicking on elements will often give additional details or perform a function for you. Clicking on a news column for example will redirect you to the actual news source on a new tab.

# Functionality

## Todo List

### _Function_

The dashboard allows for todo list that can be altered by any user sharing the server at a time, allowing for an easy way for people in the same home to keep track on what needs to be done for the day, and to ensure that everyone is on the same page.

### _Use_

A new todo item can be added to the todo list by typing in any text that you want to be used for the prompt. Once done, click the add button to the right of the text box. Once you've done so, the to-do list should be updated.

## Weather & Time

### _Function_

The dashboard supplies the current server time constantly, as well as supplying the user with information about the current day. Such as the weather that they should expect as well as how hot they can expect it to be. As no weather estimation is perfect, a high and a low temp for the day is also supplied. Low temps being BLUE expected temp being GREEN and the highest temp being RED

### _Use_

To set your weather area, go to the options screen and drop the drop down select the area that best represents where you live. Upon closing the options pane the weather panel will be updated with your current weather for the selected area.

## Twitter Feed

### _Function_

Once a user has been logged in (Ideally a family account) The household can then keep up to date with their latest tweets. Tweets are shown with basic information that can be enhanced by clicking. On click a new panel will appear, showing the full text of the tweet. Users can then click this text to open a new window to the actual tweet itself. If no tweets can be obtained from the server this panel is hidden.

### _Use_

A user will first have to be logged in. This can be done by accessing the options area in the top right and clicking login. After logging in, you should be redirected to the dashboard. Tweets can be clicked on to show more infomation. To logout, simply go to the options menu again and click logout. The twitter panel should disappear

_Note There's a bug with the twitter feed on initial login, occasionally the twitter panel might not update and end up showing a blank panel. A refresh should rectify this issue._

## File Server

### _Function_

A file server is built into the application, allowing for backing up any files or photos you wish. Alternatively this could be used as a way to host files for other family members to download as and when they feel like it. The server allows for the uploading of files, downloading of files, renaming and deletion. As well as a refresh button to see any updates made to the file server.

### _Use_

A file can be uploaded via the Choose File button and Upload button, found at the top of the element. Click Choose File to select the file you want to upload and clicking upload will upload it to the server. There are buttons available to manipulate these files. Download will download to your machine whatever file it is that is currently selected. Modify allows the user to change the filename of the file and on pressing enter, will rename it. Delete will delete whatever selected file is on the client-side and refresh will pull all the latest and new files from the server.

Ideally make sure that you refresh the client before running an operation that may change the file in any way.

## Photo Gallery

### _Function_

A simple and easy to use photo gallery, to allow for pictures to constantly iterate from one after another during a small time period. Be it family photos or anything that you may want. If no photos are available then this panel is hidden.

### _Use_

Upload images using the options panel that can be accessed using the cogs in the upper right of the screen. Very similar to file server operation, select a photo you wish to upload and then click the upload button. The photo gallery should now be shown. Should you wish to delete any photos simply open the option panel again and then click on the photo. If there are no images left the photo gallery should become hidden again.

## News source

### _Function_

This panel retrieves the top news or stories from a specified source in such a way so that you and your family can easily keep up to date with the latest going ons with the outside world whilst staying comfy inside playing video games all day. News sources can be gone to directly.

### _Use_

To change news source, access the options panel in the top right of the screen and from the dropdown box, select a source you would like. After closing the options pane the news source should be updated to use the new source. To access a direct source click on the news article and a new tab or window should open.

### Misc features

Any two panels can be swapped around by clicking on the circles found on the top right side of any panel. Clicking once will select the panel, and clicking on another will perform the swap.

# Reflection

I found this to be a great exercise in putting all the skills we've gotten over the year into one super project. It's helped me find and adjust some pretty poor practises that I was doing in other coursework examples and gave me a great insight on how to actually start a full-stack website.

## Design

I've always been a big fan of the flat colour scheme and style. It's simplistic but still looks great and modern, while remaining easily animatable and given that CSS3 now has support for animations I felt this was a great route to go down. Unfortunately I spent more time just making sure that the initial look of everything was the way I wanted, and near the end of development I figured that perhaps I needed to refine my practises in just managing good CSS, let alone animating it.

Saying that I'd look forward to playing around with additional keyframes and finding out about new techniques. A little bit of animation can go along way I feel.

## Functionality

I tried to get a a ground between having a shared instance of information, whilst also keep the dashboard unique to anyone who was using it. The whole house would benifit to having a backup of key files or keeping track of what needs doing for the day, but not everyone would necessarily want the same news source. Hence why not everything is managed through an API call. In hindsight perhaps looking into some short-term local storage for their preferences might make sense.

## Conclude

I feel this was a great experience and that something that's going to help me greatly down the line, both in terms of experience and as a product for me to show off for employability. It gave me a great insight into how powerful Nodejs and his client friends can be.

It also helped me develop my soft skills, as I found that near the end of the project I was really struggling to follow and reference old code. I realise this is something that many people tell me time and time a gain to keep an eye on, but it's been a real kick in the teeth and has helped really get the message in my head that good code management is key.

### Programmer's Note

I'd like to thank Rich, Jack and Matt for this Unit as it's given me the tools to develop in a way that I find absolutely superb, I wish I had taken the initiative to look into Node or any other form of backend language years ago, as I've severely missed out.

The structure of the lectures and practicals have been done superbly and the obvious passion you guys have for this really shows. So I'd like to thank you for that.

I hope you find my coursework to not be too much of a headache :)
