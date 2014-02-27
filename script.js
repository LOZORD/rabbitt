$(document).ready(

	function()
	{

		var binString = $("#screen").text();

		$('#button0').click(
			function()
			{
				if (binString.length < 6)
					binString += "0";
				else
					binString = binString.substr(1) + "0";
				// console.log("added 0");

				// if(binString.length === 6)
				// 	$("#screen").css("color","green");
			}
		);

		$('#button1').click(
			function()
			{
				if (binString.length < 6)
					binString += "1";
				else
					binString = binString.substr(1) + "1";
				
				// console.log("added 1");

				// if(binString.length === 6)
				// 	$("#screen").css("color","green");

			}
		);

		// if(binString.length === 6)
		// {
		// 	$("#screen").css("color","green");
		// }

		$("#button_enter").click(
			function()
			{
				console.log(binString);
				updateBox(binString);
				binString = "";
			}
		);

		$("#screen").text(binString);


		function updateBox (str)
		{
			//$("#screen").text(str);
			console.log(str);
			///UPDATE COLOR BOXES HERE, AKA PARSE!
		}
		

	}

);