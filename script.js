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
		const numClrBits = 6;

		const eachClrBit = numClrBits/3;

		//the current length of the binary string accepted
		const binStringLengthMax = numRowBits + numColBits + numClrBits;

		var guideGone = false;

		$('#button0').click(
			function()
			{
				updateScreen("0");
			}
		);

		$('#button1').click(
			function()
			{
				updateScreen("1");
			}
		);


		$("#button_enter").click(
			function()
			{

				if (myScreen.text().length === binStringLengthMax)
				{
					//push the current binary screen to make changes
					updateBox(myScreen.text());

					//then, empty the screen
					myScreen.text("");

					//change the button back to the "inactive" color
					$("#button_enter").css("background-color","lightgray");
				}
			}
		);

		$("#guide_ctr").click(fadeGuide);

		function fadeGuide()
		{
			$("#guide_ctr").hide("slide", {}, 1000);

			guideGone = true;
		}


		//TODO -- show binary data when user hovers over block
		$(".block").mouseenter
		(
			function()
			{
				console.log("hovered over block");

				//if (guideGone)
					//toBinaryString($(this));
			}
		);

		//Clear blocks' text when the mouse exits them
		$(".block").mouseleave
		(
			function()
			{
				if (guideGone)
					$(this).text("");
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

			//console.log(myElement);

			//better way to do this using eArr?

			var eleNum = parseInt(myElement.attr("id").substr(1), 10);

			var colorNum = colors.indexOf(myElement._myColor);

			var rowNum = eleNum % 4;

			//var colNum = eleNum / 4

			var colNum = Math.floor(eleNum / 4);

			//TODO figure out how to parse the color!!!
			//make it easy -- make last binary numbers rgb numbers!!!!!


			// var bRow = parseInt(rowNum, 2);
			// var bCol = parseInt(colNum, 2);
			// var bClr = parseInt(colorNum, 2);

			var retBinStr = rowNum + " " + colNum + " " + colorNum;

			//console.log(retBinStr);

			myElement.text(retBinStr);


		}

		function rgbNormalize(num)
		{
			return (num * 255 / (Math.pow(2, eachClrBit) - 1));
		}
	
		//TODO fix keyboard input		

	}

);