function start_CRA_experiment(cfg) {
	console.log('imagesOfImages exp', imagesOfImages);
	console.log('cfg', cfg);

	var canvas = document.getElementById("canvas");
	console.log(canvas);
	var ctx = canvas.getContext("2d");
	var textSlide = document.getElementById('text');
	var trialNum = 0;
	var NAcount_prob = 0;
	var NAcount_sol = 0;
	var NAcount_IorA = 0;
	var solBoxExist;
	var solutionInput;
	var IorAInput;
	var solutionPrompt;
	var masterClockStart;
	var dateTimeStart;
	var dateTimeEnd;
	var blockNum = 0;
	var practice = true;
	var problems = true;
	var practiceNum = 0;
	var realProblem = 0;
	//var problemNum = 0
	//var cfg = JSON.parse(ServerHelper.config_file);


	var status_info = ['trial: ' + trialNum, 'date: ' + new Date().toString()];
	var realProblem = 0;
	var LIVE_MTURK = 'https://www.mturk.com/mturk/externalSubmit';		//AMR
	var SANDBOX_MTURK = 'https://workersandbox.mturk.com/mturk/externalSubmit';

	var WIDTH = 600;
	var HEIGHT = 400;

	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	ctx.font = "20px Arial";


	var response_log = [];
	//var params = parse_url(submitURL); // function in server.js


	var response = {
		"blockNum": 0,
		"trialNum": 0,
		"readyRT": 0,
		"word1": "  ",
		"word2": "  ",
		"word3": "  ",
		"craRT": 0,
		"solutionRT": 0,
		"craSolution": "NA",
		"IorART": 0,
		"IorA": "  "
		//"subj": params['workerId']
	};

	var responseImages = {
		"blockNum": 0,
		"trialNum": 0,
		"readyRT": 0,
		"img": "  ",
		"craRT": 0,
		"solutionRT": 0,
		"craSolution": "NA",
		"IorART": 0,
		"IorA": "  "
		//"subj": params['workerId']
	};


	response_log.push('Lead Investigator: Test');
	response_log.push('IRB protocol #STU...');

	//   AMW we can't use these till linked to server.js
	//response_log.push('SessionId is: ' + params["session"]);
	//response_log.push('GroupId is: ' + params["group"]);
	//response_log.push('WorkerID is: ' + params["workerId"]);
	//response_log.push('AssignmentID is: ' + params["assignmentId"]);

	//  AMW we need to link these to specs/experiment info
	//response_log.push('Fixation Timeout: ' + fixateTimeout);
	//response_log.push('Stimulus Timeout: ' + desired_OST * 1000);
	//response_log.push('Response Timeout: ' + desired_OST * 1000);
	//response_log.push('Feedback Timeout: ' + feedbackTimeout);
	//response_log.push('ITI: ' + itiTimeout);
	//response_log.push('\n\nTrials Before Break: ' + trialBeforeBreak);
	//response_log.push('Trials Before Test: ' + trialsBeforeTest);
	//response_log.push('Trials Before End: ' + trialsBeforeEnd);
	//response_log.push('Total Trials: ' + cfg["exp_control"].stimList.length);

	dateTimeStart = Date();
	response_log.push('Start date time: ' + dateTimeStart + '\n\n');

	// headers for data output (space separated)
	response_log.push("subj_session_token blockNum trialNum readyRT word1 word2 word3 craRT solutionRT craSolution IorART IorA");
	// Ben's: response_log.push("trial total_time sf ori stimImg label response feedback hit/miss RT block subj_session_token");

	console.log(response_log);
	//ServerHelper.sessionToken = 'f80bbd367012e8fa'; // DELETE!
	//ServerHelper.upload_data("initial", response_log); // Delete

	function message(lines) {
       ctx.font = "24px Arial";
       ctx.fillStyle='black';
       ctx.textAlign="center";
       for (var i=0; i<lines.length; i++) {
           ctx.fillText(lines[i], canvas.width/2, 165+(i*28));
       }
   }

	function initiateExperiment() {

		window.onbeforeunload = warn_termination;
		function warn_termination() {
				console.log('problem');
				alert('dont leave me');
				ServerHelper.upload_data('nav away. block:' + blockNum + ', trial:' + trialNum, response_log);
				var status_info_unload = ['trial' + trialNum, 'date:' + new Date().toString()];
				ServerHelper.upload_data('status', status_info_unload);
				return 'navigation message';
		}


		function show_picture (image_name) {
			var x = WIDTH/2.0 - imagesOfImages[image_name].width/2.0;
			var y = HEIGHT/ 2.0 - imagesOfImages[image_name].height/2.0;
			console.log('images wtf', typeof(imagesOfImages[image_name]));
			ctx.drawImage(imagesOfImages[image_name], x,y);
		}

		var fsm = StateMachine.create({

			events: [
				{name: 'start', from: 'none', to: 'instructions'},
				{name: 'instructions', from: 'start', to: 'ready'},
				{name: 'ready', from: ['instructions', 'moveToNext', 'break'], to: 'iti'},
				{name: 'iti', from: 'ready', to: ['practice', 'problem']},
				{name: 'practice', from: 'iti', to: ['solution', 'moveToNext']},
				{name: 'problem', from: 'iti', to: ['solution', 'moveToNext']},
				{name: 'solution', from: ['practice', 'problem'], to: ['IorA', 'moveToNext']},
				{name: 'IorA', from: 'solution', to: 'moveToNext'},
				{
					name: 'timeoutFlag',
					from: ['practice', 'problem', 'solution', 'IorA'],
					to: ['solBoxExist', 'moveToNext']
				},
				{name: 'solBoxExist', from: 'timeoutFlag', to: 'moveToNext'},
				{
					name: 'moveToNext',
					from: ['practice', 'problem', 'solution', 'IorA'],
					to: ['ready', 'break', 'practiceInstructions', 'end']
				},
				{name: 'practiceInstructions', from: 'moveToNext', to: 'ready'},
				{name: 'break', from: 'moveToNext', to: 'ready'}
			],

			callbacks: {

				oninstructions: function (event, from, to) {
					masterClockStart = performance.now();
					text.innerText = cfg.instrux.slide1;

					window.onkeydown = function (e) {
						if (e.keyCode === 32) {
							e.preventDefault();
							text.innerText = cfg.instrux.slide2;

							window.onkeydown = function (e) {
								if (e.keyCode === 32) {
									e.preventDefault();
									text.innerText = cfg.instrux.slide3;

									window.onkeydown = function (e) {
										if (e.keyCode === 32) {
											e.preventDefault();
											text.innerText = cfg.instrux.slide4;

											window.onkeydown = function (e) {
												if (e.keyCode === 32) {
													e.preventDefault();
													text.innerText = cfg.instrux.slide5;

													window.onkeydown = function (e) {
														if (e.keyCode === 32) {
															e.preventDefault();
															document.body.removeChild(text);
															fsm.onready();
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				},

				onready: function (event, from, to) {
					startReadyTime = performance.now();
					ctx.clearRect(0, 0, WIDTH, HEIGHT);
					ctx.fillText("Ready?", WIDTH / 2, HEIGHT / 2);

					response.blockNum = blockNum;

					if (realProblem == 2) {
						trialNum++;
						response.trialNum = trialNum;
					}
					else {
						practiceNum++;
						response.practiceNum = practiceNum;
					}

					window.onkeydown = function (e) {
						if (e.keyCode === 32) {
							e.preventDefault();
							endReadyTime = performance.now();
							totalReadyTime = endReadyTime - startReadyTime;
							totalReadyTime = totalReadyTime.toFixed(2);
							response.readyRT = totalReadyTime;
							console.log(response_log);
							fsm.oniti();
						}
					}
				},

				oniti: function (event, from, to) {
					ctx.clearRect(0, 0, WIDTH, HEIGHT);
					console.log('cfg.problems', cfg.problems);
					if (practice) {
						fsm.onpractice();
					}
					else {
						fsm.onproblem();
					}
				},

				onpractice: function (event, from, to) {
					var timeout = setTimeout(function () {
							console.log("Problem Timeout");
							response.craRT = " ";
							response.solutionRT = " ";
							response.craSolution = " ";
							response.IorART = " ";
							response.IorA = "NA";
							NAcount_prob++;
							console.log('problems', cfg.problems.length);
							fsm.onmoveToNext();
						},

						cfg.specs.CRA_timeout);

					var problemTimer = performance.now();

					if (practice) {
						message([cfg.practice[practiceNum - 1].firstWord,
							cfg.practice[practiceNum - 1].secondWord,
							cfg.practice[practiceNum - 1].thirdWord]);

						//ctx.fillText(cfg.practice[practiceNum - 1].firstWord + " "
						//	+ cfg.practice[practiceNum - 1].secondWord + " "
						//	+ cfg.practice[practiceNum - 1].thirdWord
						//	, WIDTH / 2, HEIGHT / 2);

						response.word1 = cfg.practice[practiceNum - 1].firstWord;
						response.word2 = cfg.practice[practiceNum - 1].secondWord;
						response.word3 = cfg.practice[practiceNum - 1].thirdWord;
					}



					window.onkeydown = function (e) {
						if (e.keyCode === 32) {
							clearTimeout(timeout); //stops timer
							e.preventDefault();
							var problemEndTime = performance.now();
							var totalProblemTime = problemEndTime - problemTimer;
							totalProblemTime = totalProblemTime.toFixed(2);
							response_log.push(totalProblemTime);
							fsm.onsolution();
						}
					}
				},

				onproblem: function (event, from, to) {
					var timeout = setTimeout(function () {
							console.log("Problem Timeout");
							response.craRT = " ";
							response.solutionRT = " ";
							response.craSolution = " ";
							response.IorART = " ";
							response.IorA = "NA";

							NAcount_prob++;

							fsm.onmoveToNext();
						},
						cfg.specs.CRA_timeout);

					var problemTimer = performance.now();

					if (realProblem) {

						//IMAGES
						show_picture(trialNum-1); // -1 so it starts at 0th item in array
						console.log('cfg.images[trialNum-1]', cfg.images[trialNum-1]);
						responseImages.img = cfg.images[trialNum-1];
						console.log('responseImages', responseImages);


						//WORDS
						message([cfg.problems[trialNum - 1].firstWord,
							cfg.problems[trialNum - 1].secondWord,
							cfg.problems[trialNum - 1].thirdWord]);

						//ctx.fillText(cfg.problems[trialNum - 1].firstWord + " "
						//	+ cfg.problems[trialNum - 1].secondWord + " "
						//	+ cfg.problems[trialNum - 1].thirdWord
						//	, WIDTH / 2, HEIGHT / 2);

						response.word1 = cfg.problems[trialNum - 1].firstWord;
						response.word2 = cfg.problems[trialNum - 1].secondWord;
						response.word3 = cfg.problems[trialNum - 1].thirdWord;
					}
					else { //AMComeback
						ctx.fillText(cfg.practice[practiceNum - 1].firstWord + " "
							+ cfg.practice[practiceNum - 1].secondWord + " "
							+ cfg.practice[practiceNum - 1].thirdWord
							, WIDTH / 2, HEIGHT / 2);

						response_log.push(cfg.practice[practiceNum - 1].firstWord + " "
							+ cfg.practice[practiceNum - 1].secondWord + " "
							+ cfg.practice[practiceNum - 1].thirdWord);
					}


					window.onkeydown = function (e) {
						if (e.keyCode === 32) {
							clearTimeout(timeout); //stops timer
							e.preventDefault();
							var problemEndTime = performance.now();
							var totalProblemTime = problemEndTime - problemTimer;
							totalProblemTime = totalProblemTime.toFixed(2);
							response.craRT = totalProblemTime;
							fsm.onsolution();
						}
					}
				},

				onsolution: function (event, from, to) {
					ctx.clearRect(0, 0, WIDTH, HEIGHT);
					ctx.fillText("Solution?", WIDTH / 2, (HEIGHT / 2) - 20);

					var timeout = setTimeout(function () {
						console.log("Solution Timeout");
						response.solutionRT = "  ";
						NAcount_sol++;
						fsm.onmoveToNext();
					}, cfg.specs.sol_timeout);

					var solutionTimer = performance.now();

					solutionPrompt = document.createElement("INPUT");
					solutionPrompt.setAttribute("type", "text");
					solutionPrompt.setAttribute("id", "textbox");
					document.body.appendChild(solutionPrompt);
					solutionPrompt.select();

					window.onkeydown = function (e) {
						if (e.keyCode === 13) {
							clearTimeout(timeout); //stops timer
							e.preventDefault();
							var solutionTimerEnd = performance.now();
							var totalSolutionTime = solutionTimerEnd - solutionTimer;
							totalSolutionTime = totalSolutionTime.toFixed(2);
							solutionInput = document.getElementById("textbox").value;

							response.solutionRT = totalSolutionTime;
							response.craSolution = solutionInput;

							if (solutionInput == "") {
								NAcount_sol++;
								console.log("NAcount_sol", NAcount_sol);
								response.solutionRT = totalSolutionTime;
								response.craSolution = "blankInput";
								fsm.onmoveToNext();
							}
							else {
								document.body.removeChild(solutionPrompt);

								response.solutionRT = totalSolutionTime;
								response.craSolution = solutionInput;
								fsm.onIorA();
							}
						}
					}
				},

				onIorA: function (event, from, to) {
					//console.log("onIorA");
					ctx.clearRect(0, 0, WIDTH, HEIGHT);
					ctx.fillText("Insight or Analysis?", WIDTH / 2, HEIGHT / 2);
					var timeout = setTimeout(function () {
							console.log("IorA Timeout");
							response.IorART = "  ";

							NAcount_IorA++;
							fsm.onmoveToNext();
						},
						cfg.specs.iora_timeout);

					var iaTimer = performance.now();

					window.onkeydown = function (e) {
						if (e.keyCode === 73 || e.keyCode === 65) {
							clearTimeout(timeout); //stops timer
							e.preventDefault();
							var iaTimerEnd = performance.now();
							var iaTimerTotal = iaTimerEnd - iaTimer;
							iaTimerTotal = iaTimerTotal.toFixed(2);
							IorAInput = String.fromCharCode(e.keyCode);

							response.IorART = iaTimerTotal;
							response.IorA = IorAInput;

							fsm.onmoveToNext();
						}
					}
				},

				onmoveToNext: function (event, from, to) {
					response_log.push(
						//response.subj + " " +
						response.blockNum + " " +
						response.trialNum + " " +
						response.readyRT + " " +
						response.word1 + " " +
						response.word2 + " " +
						response.word3 + " " +
						response.craRT + " " +
						response.solutionRT + " " +
						response.craSolution + " " +
						response.IorART + " " +
						response.IorA + "\n");
					console.log('TOTAL RESPONSE LOG', response_log);

					solBoxExist = document.getElementById("textbox");

					if (!!solBoxExist) {
						document.body.removeChild(solutionPrompt);
					}

					if (practiceNum == cfg.practice.length) {
						practice = false;
						practiceNum = 0;
						blockNum++;
						realProblem = 1;
					}

					//error handling - too many solution NAs
					//boot if taking too long
					var currTime = performance.now();
					if ((currTime - masterClockStart) >= cfg.specs.boot_time) {
						console.log('currTime', currTime);
						fsm.onend();
					}
					else if (NAcount_sol == cfg.specs.NAcount_sol_max || NAcount_prob == cfg.specs.NAcount_prob_max) {
						fsm.onend();
					}
					//choose what comes next
					else if (realProblem == 1) {
						fsm.onpracticeInstructions();
					}
					else if (trialNum == (Math.floor(cfg.problems.length / 2))) {
						blockNum++;
						fsm.onbreak();
					}
					else if (trialNum < cfg.problems.length) {
						fsm.onready();
					}
					else {
						fsm.onend();
					}

				},

				onbreak: function (event, from, to) {
					//send response_log to the server
					if (cfg.specs.upload == 0) {		//AMR
						// ServerHelper.upload_data('partial block: ' + blockNum + ', trial: ' + trialNum, response_log);
						// ServerHelper.upload_data('status', status_info );
					}

					ctx.clearRect(0, 0, WIDTH, HEIGHT);
					ctx.fillText("You may take a break, press the spacebar to continue",
						WIDTH / 2, HEIGHT / 2);

					window.onkeydown = function (e) {
						if (e.keyCode === 32) {
							e.preventDefault();
							fsm.onready();
						}
					}
				},

				onpracticeInstructions: function (event, from, to) {
					ctx.clearRect(0, 0, WIDTH, HEIGHT);
					message(["You will now begin the real experiment", "press the spacebar to continue"]);

					realProblem = 2;

					window.onkeydown = function (e) {
						if (e.keyCode === 32) {
							e.preventDefault();
							fsm.onready();
						}
					}
				},

				onend: function (event, from, to) {
					//send response_log to the server
					console.log('in onend');
					if (cfg.specs.upload === 0) {		//AMR
						console.log('res', response_log);
						ServerHelper.upload_data('complete', response_log);
						//ServerHelper.upload_data('status', status_info );
					}

					//ServerHelper.upload_to_mturk(LIVE_MTURK, summary); //AMR
					//console.log('summary: ', summary); //AMR

					var masterClockEnd = performance.now();
					var masterClockMs = masterClockEnd - masterClockStart;
					var masterClockMin = (masterClockMs / 1000 / 60) << 0;
					var masterClockSec = (masterClockMs / 1000) % 60;
					masterClockSec = masterClockSec.toFixed(0);
					console.log("masterClock", masterClockMin + ": " + masterClockSec);
					dateTimeEnd = Date();
					response_log.push('End date time: ' + dateTimeEnd);
					ctx.clearRect(0, 0, WIDTH, HEIGHT);
					ctx.fillText("Experiment Complete",
						WIDTH / 2, HEIGHT / 2);
				}
			}
		});

		fsm.start();
	}
	initiateExperiment();
}

