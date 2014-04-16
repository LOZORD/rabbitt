$(document).ready(


	/* TODO
		-- add save
		-- make db
			-store gen'd html doc string
			-store user's ip addr
			-store along with index
		-- add load
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

		const numRowBits = 2; // = log2(eArr[0].length)

		const numColBits = 2; // = log2(eArr.length)

		const rowLength = Math.pow(2, numRowBits);

		const colLength = Math.pow(2, numColBits);

		//must be a positive number divisible by 3
		//const numClrBits = 3;

		//const eachClrBit = numClrBits/3;

		const eachClrBit = 2;

		const numClrBits = eachClrBit * 3;

		//the current length of the binary string accepted
		const binStringLengthMax = numRowBits + numColBits + numClrBits;

		const zeroKey = 48;
		const oneKey = 49;
		const enterKey = 13;

		var guideGone = false;
		var holdGuide = false;

		const downTime = 500;

		var oneSubmit = false;

		var userIpAddr = null;


		//TODO use this to save ip addr in a clever way of logining in!!!
		//basically we want to have a db that maps ip addrs to strings that are the generated html from the screen
		$.getJSON("http://jsonip.appspot.com?callback=?",
    		function(data){
       			//console.log( "Your ip: " + data.ip);
       			userIpAddr = data.ip;
  			}
  		);


		$("#amntColors").text(Math.pow(2, numClrBits));
		$("#binStrLen").text(binStringLengthMax);

		$("#numRowBits").text(numRowBits);
		$("#numColBits").text(numColBits);
		$("#numClrBits").text(numClrBits);


		$(document).on('keydown click', function(e) 
			{
				if(guideGone)
				{

					var myTarget = getEventTarget(e);


					

					if (myTarget == null)
						return;
					else if (myTarget === 'enter')
						submitScreen();
					else if (myTarget === '0' || myTarget === '1')
						updateScreen(myTarget);
					else if (myTarget === 'reset')
						resetScreen();
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

					myTarget = "#" + myTarget;

					// $(document).keydown(function(e2)
					// 	{
					// 		while(determineKey(e2) === myTarget)
					// 		{
					// 			$(myTarget)...
					// 		}
					// 	}
					// );

					//TODO 'animate' key/click button depression


					// if (myTarget != null)
					// {

					// }

					// if (myTarget != null)
					// 	console.log(myTarget + " booyah");


				}
				//console.log(e);
			}
		);

		
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

			eArr[rowNum][colNum].animate({backgroundColor: toRGBString}, 750);
		}

		//updates the binary entry screen at the bottom of the toy
		function updateScreen(bit)
		{

			if (myScreen.text().length < binStringLengthMax)
				myScreen.append(bit);
			else
				myScreen.text(myScreen.text().substr(1) + bit);

			if (myScreen.text().length === binStringLengthMax)
			{
				colorizeScreenText(); //####################################################################
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
			for (var i = 0; i < Math.pow(2, numRowBits); i++)
			{
				for (var j = 0; j < Math.pow(2, numColBits); j++)
				{
					eArr[i][j].animate({backgroundColor: "red"}, 750);
				}
			}
		}

		// function flashMessage(msg)
		// {
		// 	var theScreen = $('#screen');

		// 	var saveText = theScreen.text();

		// 	// var endTime = Date.now() + 2500;

		// 	//theScreen.animate({content: "msg"}, 2500);


		// 	// while (Date.now() != endTime)
		// 	// {
				
		// 	// }


		// 	//theScreen.animate()

		// 	//theScreen.text(msg);


		// 	// theScreen.animate({}, 4000,
		// 	// 	function ()
		// 	// 	{
		// 	// 		theScreen.text(msg);
		// 	// 	}
		// 	// );


		// 	// //theScreen.text(saveText);

		// 	// theScreen.animate({}, 4000,
		// 	// 	function()
		// 	// 	{
		// 	// 		theScreen.text(saveText);
		// 	// 	}
		// 	// );

		// }

		function genHTMLScreen()
		{
			var screen_data = "";

			//flashMessage("printing...");

			//could be buggin depending on the f'ed up eArr
			var blockWidth = 100.0 / (Math.pow(2, numRowBits));

			var blockHeight = 100.0 / (Math.pow(2, numColBits));

			//fill with the regular html stuff
			screen_data += "<html><head><title>RABBITT OUTPUT</title>";
			screen_data += "<style>\nbody{margin:0;padding:0;}\n.block{width:" + blockWidth + "vw;height:" + blockHeight + "vw;float:left;}</style></head><body>";


			//<div class="block" style="background-color:black;"></div>

			//will produce a file >1000 chars

			for (var i = 0; i < Math.pow(2, numRowBits); i++)
			{
				screen_data += '<div class="row">\n';

				for (var j = 0; j < Math.pow(2, numColBits); j++)
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

			console.log(screen_data);

			//alert('Check your console!');

			return screen_data;

		}


		function download(filename, text)
		{
			alert('unimplemented!');
		}



  		function colorizeScreenText()
  		{
  			//for(var someChar in )
  			// myScreen.each(
  			// );

			//split text into single chars
			//wrap indexed bits in spans for row, col, red, green, blue

			var str = myScreen.text();

			//TODO check that these values are legit
			var rowStr = str.substr(0, numRowBits);
			var colStr = str.substr(numRowBits, numColBits);
			
			//get the entire color segment

			//var aColor = parseInt(str.substr(numRowBits+numColBits), 2);

			/* option one, rgb string always R, G, B */
			
			/*
			var rgbStr = str.substr(numRowBits + numColBits);

			var redStr = rgbStr.substr(0, eachClrBit);
			var grnStr = rgbStr.substr(eachClrBit, eachClrBit);
			var bluStr = rgbStr.substr(2 * eachClrBit);
			*/

			/* option two, rgb string as rgb color */
			

			var rgbStr = str.substr(numRowBits + numColBits);

			var redAmnt = rgbNormalize(parseInt(rgbStr.substr(0, eachClrBit), 2));
			var grnAmnt = rgbNormalize(parseInt(rgbStr.substr(eachClrBit, eachClrBit), 2));
			var bluAmnt = rgbNormalize(parseInt(rgbStr.substr(2*eachClrBit), 2));

			var toRGBString = "rgb(" + redAmnt + "," + grnAmnt + "," + bluAmnt + ")";

			//then sub in this line for the individual colors

			//retStr += '<span style="color: ' + toRGBString + ';">' + rgbStr + '</span>';

			



			var retStr = '<span style="color:white;">' + rowStr + '</span>';

			retStr += '<span style="color:black;">' + colStr + '</span>';

			retStr += '<span style="color: ' + toRGBString + ';">' + rgbStr + '</span>';


			//retStr += '<span style="color:red;">' + redStr + '</span>'; //UNCOMMENT FOR OPTION ONE

			//retStr += '<span style="color:green;">' + grnStr + '</span>'; //

			//retStr += '<span style="color:blue;">' + bluStr + '</span>'; //


			//console.log(retStr);

			// var redAmnt = rgbNormalize(parseInt(rgbStr.substr(0, eachClrBit), 2));
			// var grnAmnt = rgbNormalize(parseInt(rgbStr.substr(eachClrBit, eachClrBit), 2));
			// var bluAmnt = rgbNormalize(parseInt(rgbStr.substr(2*eachClrBit), 2));

			// var toRGBString = "rgb(" + redAmnt + "," + grnAmnt + "," + bluAmnt + ")";

			// eArr[rowNum][colNum].animate({backgroundColor: toRGBString}, 750);

			//return retStr;

			myScreen.html(retStr);




			//TODO make box value id appear tooooooooo

			var eRow = parseInt(rowStr, 2);
			var eCol = parseInt(colStr ,2);

			//var blockNum = ()

			var someBlock = eArr[eCol][eRow];//eArr[eRow/4][]

			//console.log(eRow + ' row , ' + eCol + ' col');


			//var someBlock = eArr[eCol][eRow];

			console.log(someBlock);

			var blockText = someBlock.find('span');


			//use toBinaryString
			blockText.text(toBinaryString($(someBlock)));
			blockText.css({backgroundColor: "white", color: "black", opacity: 1, fontFamily: "Menlo, monospace"}).delay(500).fadeTo(500,0);
			//blockText.fadeToggle(2000);
			//blockText.fadeToggle(500).delay(500);

			//someBlock.focus();
			//blockText.toggle(2000);

			
  		}

  		//TODO save func
  		function saveState()
  		{
  			console.log('Are you attaching this functio to an event?');
  			console.log("SAVE THIS IP ADDR: " + userIpAddr);
  		}

  		//TODO load function
  		function loadState()
  		{
  			console.log('Are you attaching this functio to an event?');
  			
  		}


	}

);

/* END JS */