$(document).ready(


	/* TODO
		-- make code less janky i.e. refactor
		-- make row/col conflict and weird html less janky
	*/

	function()
	{
		//the array of grid elements

		var eArr = 	[
						[$("#e0"), $("#e1"), $("#e2"), $("#e3")],
						[$("#e4"), $("#e5"), $("#e6"), $("#e7")],
						[$("#e8"), $("#e9"), $("#e10"), $("#e11")],
						[$("#e12"), $("#e13"), $("#e14"), $("#e15")]
					];

		//the screen variable
		var myScreen = $("#screen");

		const numRowBits = 2; // = log2(eArr[0].length) //TODO -- make code more dynamic

		const numColBits = 2; // = log2(eArr.length)

		const rowLength = Math.pow(2, numRowBits);

		const colLength = Math.pow(2, numColBits);

		//must be a positive number divisible by 3
		//const numClrBits = 3;

		//const eachClrBit = numClrBits/3;

		const eachClrBit = 2;

		//multiply for {Red, Green, Blue}
		const numClrBits = eachClrBit * 3;

		//the current length of the binary string accepted
		const binStringLengthMax = numRowBits + numColBits + numClrBits;

		/* KEY CODES */
		const zeroKey = 48;
		const oneKey = 49;
		const enterKey = 13;

		//slideover appearance booleans
		var guideGone = false;
		var holdGuide = false;

		//XXX needed?
		var oneSubmit = false;

		$("#amntColors").text(Math.pow(2, numClrBits));
		$("#binStrLen").text(binStringLengthMax);

		$("#numRowBits").text(numRowBits);
		$("#numColBits").text(numColBits);
		$("#numClrBits").text(numClrBits);


		//the main user input function
		//active on keyboard or click input
		$(document).on('keydown click', function(e) 
			{
				//only accept input once the starting guide is gone
				if(guideGone)
				{

					//get the particular event
					var myTarget = getEventTarget(e);

					if (myTarget == null)
						return;
					else if (myTarget === 'enter')
						submitScreen();
					//the user entered a one or a zero
					//either via kb or clicking the buttons
					else if (myTarget === '0' || myTarget === '1')
						updateScreen(myTarget);
					else if (myTarget === 'reset')
						resetScreen();
					//TODO make own function!!!
					else if (myTarget === 'print')
					{
						var output = genHTMLScreen();

						$('#guide').text(output);
						//$('#guideMsg').text('HELLO');


						$('#guide').prepend('<span style="color:gray;">---<br/><br/>Your RABBITT printout...<br/>\
							<span id="print_closer"> < CLICK HERE TO CLOSE > </span><br/><br/>---<br/></span>');


						$('#guide_ctr').show('slide', {}, 1000);

						$('#print_closer').click(
							function()
							{
								$('#guide_ctr').hide('slide', {}, 1000);
							}
						);


					}

					else if (myTarget === 'save')
					{
						saveState();
					}
					else if (myTarget === 'load')
					{
						loadState();
					}

					//XXX use?
					myTarget = "#" + myTarget;

				}
				//console.log(e);
			}
		);

		//the user clicks to hide the guide
		$("#guide_ctr").click
		(
			function fadeGuide()
			{
				if (!guideGone)
				{
					$("#guide_ctr").hide("slide", {}, 1000);

					guideGone = true;
				}
			}
		);
		

		$(".block").mouseenter
		(
			function()
			{
				//$(this).text(toBinaryString($(this)));
				//$
				$(this).find("span").text(toBinaryString($(this)));
				$(this).find("span").css({backgroundColor: "black", color: "white", opacity: 1, fontFamily: "Menlo, monospace"});
			}
		);

		//Clear blocks' text when the mouse exits them
		$(".block").mouseleave
		(
			function()
			{
				if (guideGone)
				{
					$(this).find("span").text("");
					$(this).find("span").css("opacity", 0);
				}
			}
		);


		//apply the user's binary string to the toy's screen
		function updateBox (str)
		{
			var colNum = parseInt(str.substr(0, numRowBits), 2);
			var rowNum = parseInt(str.substr(numRowBits, numColBits), 2);
			
			//get the entire color segment

			var aColor = parseInt(str.substr(numRowBits+numColBits), 2);

			var rgbStr = str.substr(numRowBits + numColBits);

			var redAmnt = rgbNormalize(parseInt(rgbStr.substr(0, eachClrBit), 2));
			var grnAmnt = rgbNormalize(parseInt(rgbStr.substr(eachClrBit, eachClrBit), 2));
			var bluAmnt = rgbNormalize(parseInt(rgbStr.substr(2*eachClrBit), 2));

			var toRGBString = "rgb(" + redAmnt + "," + grnAmnt + "," + bluAmnt + ")";

			//eArr[rowNum][colNum].animate({backgroundColor: toRGBString}, 750);
			setScreenElement(rowNum,colNum, toRGBString);
		}

		//updates the binary entry screen at the bottom of the toy

		function setScreenElement(rowNum, colNum, color, time)
		{
			//set 750 ms as the default
			if (typeof(time)==='undefined') time = 750;

			eArr[rowNum][colNum].animate( {backgroundColor : color} , time );
		}


		function updateScreen(bit)
		{

			if (myScreen.text().length < binStringLengthMax)
				myScreen.append(bit);
			else
				myScreen.text(myScreen.text().substr(1) + bit);

			if (myScreen.text().length === binStringLengthMax)
			{
				colorizeScreenText();
				$("#button_enter").css("background-color","darkgray");
			}
		}

		//used for hovering over blocks to show their binary data value
		function toBinaryString(myElement)
		{

			var eleNum = parseInt(myElement.attr("id").substr(1), 10);

			var rowNum = parseInt(eleNum % 4, 10);

			var colNum = parseInt(eleNum / 4, 10);

			var clrNumArr = myElement.css("background-color").split(',');

			var red = clrNumArr[0].substr(3);
			var grn = clrNumArr[1];
			var blu = clrNumArr[2];

			return (rowNum + " " + colNum + " " + red + " " + grn + " " + blu);

		}

		function rgbNormalize(num)
		{
			return (num * 255 / (Math.pow(2, eachClrBit) - 1));
		}
	
		//what to do when the user presses the enter button
		function submitScreen()
		{
			if (myScreen.text().length === binStringLengthMax)
				{
					//push the current binary screen to make changes
					updateBox(myScreen.text());

					//then, empty the screen
					myScreen.text("");

					//change the button back to the "inactive" color
					$("#button_enter").css("background-color","lightgray");

					oneSubmit = true;
				}
		}


		function getEventTarget(e)
		{

			//console.log(e)

			if (e.type === 'keydown')
			{
				return determineKey(e);
			}

			//they must have clicked
			else if (e.type === 'click' && (e.toElement.className.search('clickBtn') > 1))
			{

				return e.toElement.innerText.toLowerCase();
			}

			else
				return null;
		}

		function determineKey (e)
		{
			if (e.keyCode === zeroKey)
				return '0';
			else if (e.keyCode === oneKey)
				return '1';
			else if (e.keyCode === enterKey)
				return 'enter';
			else
				return null;
		}

		function resetScreen()
		{
			for (var i = 0; i < rowLength; i++)
			{
				for (var j = 0; j < colLength; j++)
				{
					eArr[i][j].animate({backgroundColor: "red"}, 750);
				}
			}
		}

		//
		// function flashMessage(msg)
		//

		function genHTMLScreen()
		{
			var screen_data = "";

			//flashMessage("printing...");

			//could be buggin depending on the f'ed up eArr
			var blockWidth = 100.0 / rowLength;

			var blockHeight = 100.0 / colLength;

			//fill with the regular html stuff
			screen_data += "<html><head><title>RABBITT OUTPUT</title>";
			screen_data += "<style>\nbody{margin:0;padding:0;}\n.block{width:" + blockWidth + "vw;height:" + blockHeight + "vw;float:left;}</style></head><body>";


			//<div class="block" style="background-color:black;"></div>

			//will produce a file >1000 chars

			for (var i = 0; i < rowLength; i++)
			{
				screen_data += '<div class="row">\n';

				for (var j = 0; j < colLength; j++)
				{
					//TODO replace with html and color data
					//screen_data += ( '[(' + i + ',' + j + ')' + eArr[j][i].css("backgroundColor") + ']');
					screen_data += '<div class="block" style="background-color:' + eArr[j][i].css("backgroundColor") + ';"></div>\n';

				}

				//screen_data += "\n";
				screen_data += '</div>\n';
			}

			//end the html file
			screen_data += "</body></html>";

			//console.log(screen_data);

			//alert('Check your console!');

			return screen_data;

		}

		//GARBAGE!
		function download(filename, text)
		{
			alert('unimplemented!');
		}



  		function colorizeScreenText()
  		{

			var str = myScreen.text();

			
			var rowStr = str.substr(0, numRowBits);
			var colStr = str.substr(numRowBits, numColBits);

			var rgbStr = str.substr(numRowBits + numColBits);

			var redAmnt = rgbNormalize(parseInt(rgbStr.substr(0, eachClrBit), 2));
			var grnAmnt = rgbNormalize(parseInt(rgbStr.substr(eachClrBit, eachClrBit), 2));
			var bluAmnt = rgbNormalize(parseInt(rgbStr.substr(2*eachClrBit), 2));

			var toRGBString = "rgb(" + redAmnt + "," + grnAmnt + "," + bluAmnt + ")";

			var retStr = '<span style="color:white;">' + rowStr + '</span>';

			retStr += '<span style="color:black;">' + colStr + '</span>';

			retStr += '<span style="color: ' + toRGBString + ';">' + rgbStr + '</span>';

			myScreen.html(retStr);


			var eRow = parseInt(rowStr, 2);
			var eCol = parseInt(colStr ,2);


			var someBlock = eArr[eCol][eRow];//eArr[eRow/4][]

			

			var blockText = someBlock.find('span');

			blockText.text(toBinaryString($(someBlock)));

			blockText.css({backgroundColor: "white", color: "black", opacity: 1, fontFamily: "Menlo, monospace"}).delay(500).fadeTo(500,0);

  		}

  		//TODO save func
  		function saveState()
  		{
  			//console.log('Are you attaching this functio to an event?');
  			//console.log("SAVE THIS IP ADDR: " + userIpAddr);


  			var textToSave = '';

  			for (var row in eArr)
  			{
  				//use curly braces to signify rows
  				//textToSave += '';

  				for (var col in eArr[row])
  				{
  					//textToSave += ( eArr[col][row].css('backgroundColor') + ' , ');

  					//console.log('r' + row + 'c' + col + '...' + eArr[col][row].css('backgroundColor'));

  					//textToSave += ('[' + row + '][' +  col + ']' + eArr[col][row].css('backgroundColor') + ' | ');

  					textToSave += (eArr[col][row].css('backgroundColor') + '|')

  				}

  				//textToSave += '}';
  			}

  			//textToSave += '>';

  			//console.log("\n\n" + textToSave);

  			//WRITE TO THE COOKIE
  			//Save cookies until "the end of time"
  			docCookies.setItem('RABBITT_save_data', textToSave, new Date(0x7fffffff * 1e3));

  			console.log('set cookie!')


  		}

  		//TODO load function
  		function loadState()
  		{
  			//console.log(docCookies.getItem('RABBITT_save_data'));

  			console.log('loading cookie!');

  			var cookieFetchRes = docCookies.getItem('RABBITT_save_data');



  			//if the user hasn't previously saved their data
  			if (cookieFetchRes === null)
  				return;


  			//var fetchString = new String(cookieFetchRes);

  			//assuming we've recieved some type of cookie...

  			//console.log(cookieFetchRes);

  			// console.log(typeof cookieFetchRes);

  			// console.log('gerald!');

  			cookieFetchRes.trim();


  			// console.log(fetchString.search('|'));



  			// if (!fetchString.contains('rgb'))
  			// {
  			// 		console.log('salty dog!');
  			// 		return;
  			// }

  			//assume the cookie is valid, decode the result
  			//limit splitting to the number of elements in eArr
  			var decodeArr = cookieFetchRes.split('|', rowLength * colLength);

  			console.log('split cookie!');

  			// for (var i in decodeArr)
  			// 	console.log(decodeArr[i]);

  			var i = 0;

  			for (var row in eArr)
  			{
  				for (var col in eArr[row])
  				{
  					//eArr[row][col].css('backgroundColor');
  					//make code less redundant -- see updateBox func above
					//eArr[col][row].animate({backgroundColor: decodeArr[i++]}, 750);
					setScreenElement(col ,row, decodeArr[i++]);

  				}
  			}




  		}


	}

);

/* END JS */
