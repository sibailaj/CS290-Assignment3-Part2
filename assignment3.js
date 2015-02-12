window.onload = function() {
	displayStorage();
}

var httpRequest;
var parsedRequest;
var link;

function getGists() {
	var page = document.getElementById("sel");
	var pageValue = page.options[page.selectedIndex].text;
	var url = 'https://api.github.com/gists?page=' + pageValue;

	if (window.XMLHttpRequest) {
		httpRequest = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
	}

	if (!httpRequest) {
		alert('XMLHTTP Instance Failed');
		return false;
	}

	httpRequest.onreadystatechange = alertContents;
	httpRequest.open('GET', url, true);
	httpRequest.send();

	function alertContents() {
	if (httpRequest.readyState === 4 && httpRequest.status === 200) {

		console.log(httpRequest.responseText);
		
		parsedRequest = JSON.parse(httpRequest.responseText);

	}

	verifyCheckbox();

	function verifyCheckbox() {
		var checkbox = document.getElementsByName("check");
		var emptyCheckbox = true;

		for (var x = 0; x < checkbox.length; x++) {
			if (checkbox[x].checked) {
				displayResults(parsedRequest, checkbox[x].value);
				emptyCheckbox = false;
			}
		}

		if (emptyCheckbox == true) {
			displayResults(parsedRequest, "all")
		}
	}

	function displayResults(request, language) {
		var outerObject;
		var innerObject;
		link = [];
		var gistResult = "";
		var listBegin;
		var favoriteButton = [];
		var index;

		var listBeginRef;
		var favoriteButtonRef;
		var linkRef;
		var div;

		if (language == "all") {
			for (var i in parsedRequest) {
				link[i] = document.createElement("a");
				link[i].textContent = parsedRequest[i].description;
				if (link[i].textContent === "") {link[i].textContent = "No Description Listed";}
				link[i].href = parsedRequest[i].url;
				listBegin = document.createElement("li");
				
				div = document.createElement("div");
				div.innerHTML = '<button id="' + i + '" onclick="saveFavorite(' + i + ');">Favorite</button>';

				listBeginRef = document.getElementById("results").appendChild(listBegin);
				favoriteButtonRef = document.getElementById("results").appendChild(div);
				linkRef = document.getElementById("results").appendChild(link[i]);

			}
		} else {
			for (var i in parsedRequest) {
				for (var j in parsedRequest[i].files) {
					outerObject = parsedRequest[i].files[j];
					for (var k in outerObject) {
						if (outerObject[k] == language) {
							link[i] = document.createElement("a");
							link[i].textContent = parsedRequest[i].description;
							if (link[i].textContent === "") {link[i].textContent = "No Description Listed";}
							link[i].href = parsedRequest[i].url;
							listBegin = document.createElement("li");
							
							div = document.createElement("div");
							div.innerHTML = '<button id="' + i + '" onclick="saveFavorite(' + i + ');">Favorite</button>';

							listBeginRef = document.getElementById("results").appendChild(listBegin);
							favoriteButtonRef = document.getElementById("results").appendChild(div);
							linkRef = document.getElementById("results").appendChild(link[i]);
						}				
					}
				}
			}
		}

	}	
}

}

function saveFavorite(index) {
	button = document.getElementById("" + index);
	index = parseInt(index);
	var localLength;
	var htmlString;

	if (localStorage.length > 0) {
		localLength = localStorage.length;
	} else {
		localLength = 0;
	}

	localStorage.setItem("favorite" + localLength, link[index]);

	var div = document.createElement("div");
	var newLink = document.createElement("a");
	newLink.textContent = parsedRequest[index].description;
	if (newLink.textContent === "") {newLink.textContent = "No Description Listed";}
	newLink.href = localStorage.getItem('favorite' + index) + "";
	document.getElementById("displayFavorites").appendChild(div);
	document.getElementById("displayFavorites").appendChild(newLink);
}


function displayStorage() {
	for (var i in localStorage) {
		var div = document.createElement("div");
		var newLink = document.createElement("a");
		newLink.textContent = localStorage.getItem(i) + "";
		newLink.href = localStorage.getItem(i) + "";
		document.getElementById("displayFavorites").appendChild(div);
		document.getElementById("displayFavorites").appendChild(newLink);		
	}
}
