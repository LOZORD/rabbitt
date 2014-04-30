$(document).ready(


	/* TODO
	-- make row/col conflict and weird html less janky
    xx add x button for overlays
    xx bigger button font
    xx change background
    -- feedback for partial strings
    -- add indication to screen to show length of required string
    -- flash text on save and load
    xx add backspace compatibility
    -- give examples
    -- hammer.js for tablet compatibility
    -- make it into a puzzle toy
    xx fix enter button
    ?? make more dynamic by using logs of eArr for bit sizing
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

        //dimensions of eArr
		const rowLength = Math.pow(2, numRowBits);

		const colLength = Math.pow(2, numColBits);

		const eachClrBit = 2;

		//multiply for {Red, Green, Blue}
		const numClrBits = eachClrBit * 3;

		//the current length of the binary string accepted
		const binStringLengthMax = numRowBits + numColBits + numClrBits;

		/* KEY CODES */
		const zeroKey = 48;
		const oneKey = 49;
		const enterKey = 13;
        const bckspKey = 8;

        //code names
        const enterCode = 'entr';
        const resetCode = 'rset';
        const bckspCode = 'back';
        const printCode = 'prnt';
        const saveCode = 'save';
        const loadCode = 'load';

        const code0 = '0';
        const code1 = '1';

        const screenClr = 'tan';
        const saveClr = '#4ce85c';
        const loadClr = '#5c78ff';
        const printClr = '#ffe740';
        const resetClr = '#e83a3f';
        //const submitClr = '';
        const notEnoughInputClr = 'black';


		//slideover appearance booleans
		var guideGone = false;
		var holdGuide = false;

		//XXX needed?
		// var oneSubmit = false;

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
                    //remember that these are sent back LOWERCASE!!!
					var myTarget = getEventTarget(e);

					if (myTarget === null)
						return;
					else if (myTarget === enterCode)
						submitScreen();
					//the user entered a one or a zero
					//either via kb or clicking the buttons
                    else if (myTarget === bckspCode)
                        doBackspace(e);
					else if (myTarget === code0 || myTarget === code1)
						updateScreen(myTarget);
					else if (myTarget === resetCode)
						resetScreen();
					else if (myTarget === printCode)
                        printState();
					else if (myTarget === saveCode)
						saveState();
					else if (myTarget === loadCode)
						loadState();
                    //otherwise, do nothing
				}
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

            return toRGBString;
		}

		//updates the binary entry screen at the bottom of the toy

		function setScreenElement(rowNum, colNum, color, time)
		{
			//set 750 ms as the default
			if (typeof(time)=== 'undefined') time = 750;

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

            //flashScreen(submitColor);
		}

		//used for hovering over blocks to show their binary data value
		function toBinaryString(myElement)
		{

			var eleNum = parseInt(myElement.attr("id").substr(1), 10);

			var rowNum = parseInt(eleNum % 4, 10);

			var colNum = parseInt(eleNum / 4, 10);

			var clrNumArr = myElement.css("background-color").split(',');

            //remove the preceding "rgb", then get each assoc'd color
			var red = clrNumArr[0].substr(3);
			var grn = clrNumArr[1];
			var blu = clrNumArr[2];

			return (rowNum + " " + colNum + " " + red + " " + grn + " " + blu);

		}

        //return a valid rgb number for any number num bits
        //warning -- not tested for 8 bits (2^8 = 255)
		function rgbNormalize(num)
		{
			return (num * 255 / (Math.pow(2, eachClrBit) - 1));
		}

        function doBackspace(e)
        {
            //aha! this call on e stops the page from going backwards!
            e.preventDefault();
            
            //get the screen text
            var screenText = myScreen.text();
            //get its length
            var textLen = screenText.length;
            //delete one character
            var newText = screenText.substr(0, textLen - 1);
            //update the text
            myScreen.text(newText);

            //myScreen.text(screenText.substr())
        }
	
		//what to do when the user presses the enter button
		function submitScreen()
		{
			if (myScreen.text().length === binStringLengthMax)
				{
					//push the current binary screen to make changes
                    //get the color the user submits!
					var userColor = updateBox(myScreen.text());

					//then, empty the screen
					myScreen.text("");

					//change the button back to the "inactive" color
					$("#button_enter").css("background-color","lightgray");

					// oneSubmit = true; XXX
                    flashScreen(userColor);
				}
            else
            {
                //user did not read directions
                //myScreen.animate({backgroundColor: 'white'}, 350).animate({backgroundColor})
                flashScreen(notEnoughInputClr);
                //myScreen.animate({backgroundColor: 'tan'}, 350);
            }
		}

        function printState()
        {
            //get the eArr data in HTML form and set it to the guide's text

            flashScreen(printClr);

            var output = genHTMLScreen();

            $('#guide').text(output);

            //prepend a close message
            //$('#guide').prepend('<span style="color:gray;">---<br/><br/>Your RABBITT printout...<br/>\
            //    <span id="print_closer"> < CLICK HERE TO CLOSE > </span><br/><br/>---<br/></span>');
            $('#guide').prepend('<div id="closer">&times;</div>');

            //slide out the guide
            $('#guide_ctr').show('slide', {}, 1000);

            //slide away the guide when the user clicks
            $('#closer').click
            (
                function()
                {
                    $('#guide_ctr').hide('slide', {}, 1000);
                }
            );
        }

		function getEventTarget(e)
		{
			if (e.type === 'keydown')
			{
				return determineKey(e);
			}

			//they must have clicked, so find the assoc'd div
			else if (e.type === 'click' && (e.toElement.className.search('clickBtn') > 1))
			{

				return e.toElement.innerText.toLowerCase();
			}

			else
            {
				return null;
            }
		}

		function determineKey (e)
		{
			if (e.keyCode === zeroKey)
				return code0;
			else if (e.keyCode === oneKey)
				return code1;
			else if (e.keyCode === enterKey)
				return enterCode;
            else if (e.keyCode === bckspKey)
                return bckspCode;
			else
				return null;
		}

		function resetScreen()
		{
			for (var i = 0; i < rowLength; i++)
			{
				for (var j = 0; j < colLength; j++)
				{
                    //animate fade back to the original red tile colors
					eArr[i][j].animate({backgroundColor: "red"}, 750);
				}
			}

            flashScreen(resetClr);
		}

		//
		// function flashMessage(msg)
		//

        function flashScreen(someColor)
        {
            //console.log("eagle?");
            //hardcoded at 350
            // myScreen.animate
            // (
            //     {backgroundColor: someColor},
            //     350,
            //     'swing',
            //     flashHelper
            // );
            //myScreen.animate({backgroundColor: 'tan'}, 350);
            

            // myScreen.animate({backgroundColor: someColor}, 350);
            // myScreen.queue(flashHelper(screenClr));

            //myScreen.animate({backgroundColor: screenClr}, flashHelper(someColor));
            

            myScreen.effect("highlight", {color: someColor});
            
            //$(this).effect("highlight", {color: 'blue'}, 3000);

        }


        // function flashHelper(someColor)
        // {
        //     console.log('eagle has landed');
        //     myScreen.animate({backgroundColor: someColor});
        //     //myScreen.dequeue();
        // }

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

			//end the html file payload
			screen_data += "</body></html>";

			return screen_data;

		}

  		function colorizeScreenText()
  		{

			var str = myScreen.text();

			
			var rowStr = str.substr(0, numRowBits);
			var colStr = str.substr(numRowBits, numColBits);

			var rgbStr = str.substr(numRowBits + numColBits);

			var redAmnt = rgbNormalize(parseInt(rgbStr.substr(0, eachClrBit), 2));
			var grnAmnt = rgbNormalize(parseInt(rgbStr.substr(eachClrBit, eachClrBit), 2));
			var bluAmnt = rgbNormalize(parseInt(rgbStr.substr(2 * eachClrBit), 2));

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

  		//save func
  		function saveState()
  		{
  			var textToSave = '';

  			for (var row in eArr)
  			{
  				//use curly braces to signify rows
  				//textToSave += '';

  				for (var col in eArr[row])
  				{
  					textToSave += (eArr[col][row].css('backgroundColor') + '|')
  				}

  				//textToSave += '}';
  			}

  			//WRITE TO THE COOKIE
  			//Save cookies until "the end of time"
  			docCookies.setItem('RABBITT_save_data', textToSave, new Date(0x7fffffff * 1e3));

            flashScreen(saveClr);


  		}

        //load func
  		function loadState()
  		{
            flashScreen(loadClr);

  			var cookieFetchRes = docCookies.getItem('RABBITT_save_data');

  			//if the user hasn't previously saved their data
  			if (cookieFetchRes === null)
  				return;

  			cookieFetchRes.trim();

  			//assume the cookie is valid, decode the result
  			//limit splitting to the number of elements in eArr
  			var decodeArr = cookieFetchRes.split('|', rowLength * colLength);

  			
  			var i = 0;

  			for (var row in eArr)
  			{
  				for (var col in eArr[row])
  				{
					setScreenElement(col ,row, decodeArr[i++]);
  				}
  			}

  		}



	} //end inclosing function

);

/* END JS */
