$(document).ready(

	function()
	{
		var eArr = 	[
						[$("#e0"), $("#e1"), $("#e2"), $("#e3")],
						[$("#e4"), $("#e5"), $("#e6"), $("#e7")],
						[$("#e8"), $("#e9"), $("#e10"), $("#e11")],
						[$("#e12"), $("#e13"), $("#e14"), $("#e15")]
					];
		var colors = ["red","green","blue","yellow"];

		var myScreen = $("#screen");

		//console.log(binString);

		$('#button0').click(
			function()
			{
				//var binString = myScreen.text();

				if (myScreen.text().length < 6)
					myScreen.append("0");
				else
					myScreen.text(myScreen.text().substr(1) + "0");

				//$("#screen").val(binString);

				if (myScreen.text().length === 6)
					$("#button_enter").css("background-color","darkgray");
				
				//console.log(binString);
			}
		);

		$('#button1').click(
			function()
			{
				if (myScreen.text().length < 6)
					myScreen.append("1");
				else
					myScreen.text(myScreen.text().substr(1) + "1");

				//$("#screen").val(binString);

				if (myScreen.text().length === 6)
					$("#button_enter").css("background-color","darkgray");

				//console.log(binString);
			}
		);


		$("#button_enter").click(
			function()
			{
				//console.log("pizza");

				if (myScreen.text().length === 6)
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


		function updateBox (str)
		{
			// //$("#screen").text(str);
			// console.log("HOLA");
			// ///UPDATE COLOR BOXES HERE, AKA PARSE!

			var colNum = parseInt(str.substr(0,2), 2);
			var rowNum = parseInt(str.substr(2,2), 2);
			var aColor = parseInt(str.substr(4,2), 2);

			eArr[rowNum][colNum].animate({backgroundColor: colors[aColor]}, 750);


			//console.log(str);

		}
		

	}

);