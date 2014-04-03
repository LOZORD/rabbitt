$(document).ready(

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

		const numRowBits = 2;

		const numColBits = 2;

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

		const downTime = 500;

		var oneSubmit = false;


		$("#amntColors").text(Math.pow(2, numClrBits));
		$("#binStrLen").text(binStringLengthMax);

		$("#numRowBits").text(numRowBits);
		$("#numColBits").text(numColBits);
		$("#numClrBits").text(numClrBits);

		// $('#button0').click(
		// 	function()
		// 	{
		// 		updateScreen("0");
		// 	}
		// );

		// $('#button1').click(
		// 	function()
		// 	{
		// 		updateScreen("1");
		// 	}
		// );


		// $("#button_enter").click(
		// 	function()
		// 	{
		// 		submitScreen();
				
		// 	}
		// );

		$(document).on('keydown click', function(e) 
			{
				if(guideGone)
				{

					var myTarget = getEventTarget(e);


					

					if (myTarget == null)
						return;
					else if (myTarget === 'enter')
						submitScreen();
					else
						updateScreen(myTarget);

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

		$("#guide_ctr").click(fadeGuide);

		function fadeGuide()
		{
			$("#guide_ctr").hide("slide", {}, 1000);

			guideGone = true;
		}

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
				$("#button_enter").css("background-color","darkgray");
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

		//TODO make keyboard input


		// $(document).keydown(
		// 	function(event)
		// 	{
		// 		if (guideGone)
		// 		{
		// 			if(event.which === zeroKey)
		// 				updateScreen("0");
		// 			if(event.which === oneKey)
		// 				updateScreen("1");
		// 			if(event.which === enterKey)
		// 				submitScreen();
		// 		}
		// 	}
		// );

		function getEventTarget(e)
		{

			//console.log(e)

			if (e.type === 'keydown')
			{
				// if (e.keyCode === zeroKey)
				// 	return '0';
				// else if (e.keyCode === oneKey)
				// 	return '1';
				// else if (e.keyCode === enterKey)
				// 	return 'enter';

				return determineKey(e);
			}

			//they must have clicked
			else if (e.type === 'click' && (e.toElement.className.search('clickBtn') > 1))
			{
				//var btnName = "#";

				//btnName += e.toElement.id;

				//console.log(e.toElement.innerText.toLowerCase() + " was clicked!");

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


	}

);

/* END JS */