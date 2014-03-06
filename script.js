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
		var colors = ["red","green","blue","yellow"];
		//other colors for later versions
		// "cyan", "yellow","magenta","white",
		//"black","orange","brown","pink","purple","gray","tan","chartreuse"];

		//the screen variable
		var myScreen = $("#screen");

		const numRowBits = 2;

		const numColBits = 2;

		const numClrBits = 2;

		//the current length of the binary string accepted
		const binStringLengthMax = numRowBits + numColBits + numClrBits;

		//console.log(binString);

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
				//console.log("pizza");

				if (myScreen.text().length === binStringLengthMax)
				{
					//console.log(binString);
					updateBox(myScreen.text());

					myScreen.text("");

					$("#button_enter").css("background-color","lightgray")

					//$("#screen").val(binString);
				}
			}
		);

		//$("#screen").val(binString);

		$("#guide_ctr").click(fadeGuide);


		// $(".block").mouseenter
		// (
		// 	function()
		// 	{
		// 		if (guideGone)
		// 			toBinaryString($(this));
		// 	}
		// );

		// $(".block").mouseleave
		// (
		// 	function()
		// 	{
		// 		if (guideGone)
		// 			$(this).text("");
		// 	}
		// );


		function updateBox (str)
		{
			// //$("#screen").text(str);
			// console.log("HOLA");
			// ///UPDATE COLOR BOXES HERE, AKA PARSE!

			var colNum = parseInt(str.substr(0,2), 2);
			var rowNum = parseInt(str.substr(2,2), 2);
			var aColor = parseInt(str.substr(4,4), 2);

			console.log(aColor);

			eArr[rowNum][colNum].animate({backgroundColor: colors[aColor]}, 750);

			// eArr[rowNum][colNum]._myColor = colors[aColor];


			//console.log(str);

		}

		function fadeGuide()
		{
			// $("#guide_ctr").fadeOut("fast");
			$("#guide_ctr").hide("slide", {}, 1000);

			guideGone = true;
		}

		function updateScreen(bit)
		{
				if (myScreen.text().length < binStringLengthMax)
					myScreen.append(bit);
				else
					myScreen.text(myScreen.text().substr(1) + bit);

				if (myScreen.text().length === binStringLengthMax)
					$("#button_enter").css("background-color","darkgray");
		}

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
		

	}

);