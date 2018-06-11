window.ondragstart = function() { return false; } 
var xcoorTo,xcoorFrom,speed;
var scrollItem;
var searchStr = "";
var Trigger = false;
const maxSize = 330;
var elementwidth = 330;
const youtubePrefix = "https://www.youtube.com/watch?v="
var blockArr = [];
const accel = 1;
var searchResult;
var End = false;
var request;
document.addEventListener('mousedown', mousedown, false);
document.addEventListener('mouseup', mouseup, false);
document.addEventListener('mousemove', mousemove, false);
var key = 'AIzaSyAkGXk81x8ett2OIKvu2mJFGCa6RJAwRas';
var request = '';


/////////////////////////////////////////////////////////
function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

function onYouTubeApiLoad() {
    gapi.client.setApiKey('AIzaSyAkGXk81x8ett2OIKvu2mJFGCa6RJAwRas');
}
/////////////////////////////////////////////////////////


function mousedown(evt)
{
    Trigger = true;
}

function mousemove(evt)
{
    xcoorTo =  evt.screenX;
    if (Trigger)
    {
        scrollItem.scrollLeft += xcoorFrom-xcoorTo;
        speed = xcoorFrom-xcoorTo;
    }
    xcoorFrom=  evt.screenX;
}

function mouseup(evt)
{
    Trigger = false;
    CalcSpeed();
}

////////////////////////////////////////////////////////

function GetNewSize()
{
    var scrollpoint = scrollItem.scrollLeft;                 
    var curretSeen = Math.floor((scrollpoint+2)/elementwidth);       
    var newWindowSize = document.getElementById('body').clientWidth;
    var targetOnScreen = Math.floor(newWindowSize/maxSize) + 1;      
    var targetBlockArraySize = targetOnScreen*maxSize;              
    var targetAndWindowDif = newWindowSize - targetBlockArraySize;
    var sizeCurrection = targetAndWindowDif / targetOnScreen;       
    var currectedSize = (maxSize + sizeCurrection - 20)+'px';      
    for (var i = 0; i < blockArr.length; i++)                       
    {
        blockArr[i].style.width = currectedSize;
    }
    elementwidth = maxSize + sizeCurrection;
    scrollItem.scrollLeft = curretSeen*elementwidth;
}

function CalcSpeed()
{
    if ((!(Trigger))&&(Math.abs(speed) > 1))
    {
        scrollItem.scrollLeft += speed;
        if (speed > 0)
        {
            speed -= accel;
        }
        else 
        {
            speed += accel;
        }
        setTimeout(function() {CalcSpeed();}, 10)
    }
    else
    {
        if (Math.abs(speed) <= 1)
        {
           fixer();
        }
    }
    var scrollpoint = scrollItem.scrollLeft;
    var WindowSize = document.getElementById('body').clientWidth;
    if ((scrollpoint+WindowSize+30 > listBlock.clientWidth) && !(End))
    {
        End = true;
        alert("мы в конце, прогрузочка");
    }
    if (scrollpoint+WindowSize < listBlock.clientWidth - maxSize*2)
    {
        inInEnd = false;
    }
}


function fixer() 
{
    var startX = scrollItem.scrollLeft % elementwidth 
    if(startX > (elementwidth / 2))                  
    {
        var targetX = elementwidth - startX;
    }
    else
    {
        var targetX = -startX;
    }
    var sqrTime2 = 2*targetX*accel;
    time = Math.sqrt(Math.abs(sqrTime2));
    tempSpeed = accel*time;
    if (targetX < 0)
    {
        speed = tempSpeed/(-1);
    }
    else
    {
        speed = tempSpeed;
    }
    setTimeout(function() {CalcSpeed();}, 10)
}

///////////////////////////////////////////////////////////
 
function Search() {
    searchStr = document.getElementById('query').value
    if(searchStr.length == 0)
    {
        alert('Пусто');
    }
    else
    {
        var query = searchStr;
            request = gapi.client.youtube.search.list({
            part: 'snippet',
            q:query,
            maxResults: 20
        });
        request.execute(onSearchResponse);
    }
}

function onSearchResponse(response) {
    console.log(response.result.items[0].id);
    scrollItem = document.getElementById('s');
    listBlock = document.getElementById('list');
    for (var i = 0; i < 20; i++)
    {
        var element = document.createElement('div');
        element.className = 'block';
        listBlock.appendChild(element);
        blockArr.push(element);                     //Итак блок создан

        var a = document.createElement('a');        //ссылка
        a.setAttribute("href", youtubePrefix +response.result.items[i].id.videoId);
        a.setAttribute("target", "_blank");
        element.appendChild(a);


        var img = document.createElement('img');    //Картинка с ссылкой
        img.setAttribute("src",response.result.items[i].snippet.thumbnails.high.url);
        img.draggable = false;
        a.appendChild(img);

        var h1 = document.createElement('h1');      //название само
        var t = document.createTextNode(response.result.items[i].snippet.title);
        h1.appendChild(t);
        element.appendChild(h1);                                    

        var h2 = document.createElement('h2');      //название канала
        var t = document.createTextNode(response.result.items[i].snippet.channelTitle);
        h2.appendChild(t);
        element.appendChild(h2);    

        var p = document.createElement('p');        //Описание
        var t = document.createTextNode(response.result.items[i].snippet.description);
        p.appendChild(t);
        element.appendChild(p); 
    }
    GetNewSize(); 
}