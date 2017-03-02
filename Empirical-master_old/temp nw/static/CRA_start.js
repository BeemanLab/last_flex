var imagesOfImages = []; //this is the array we put actual images (not strings) into #willtherealimagepleasestandup


function main() {
    console.log('in start feb 13');
    var consent_form = {};
    // extract session token from url
    var url = document.URL;
    //var params = url.split('?');

    //console.log(params)
    var imgDir = null;
    var imgList = null;
    var canvas_space = document.getElementById("canvas");
    var canvas_properties = '<canvas id="mainWin" width="600" height="600"></canvas>';
    var trialCount = 0;
    var preload_done = 0;
    //parse myConfig
    var cfg = null;
    //var cfg_demo = {}; // upload  !!! 0
    var my_url = window.location.href;
    console.log('url is', my_url);

    params = ServerHelper.empirical_start(url);
    ServerHelper.start_request();

    //cfg = ServerHelper.start_request(params.group);
    window.requestAnimationFrame(cfgIsReady);



    if (params.hasOwnProperty('assignmentId') && params["assignmentId"].match("ASSIGNMENT_ID_NOT_AVAILABLE") && !my_url.includes("demo")) {
        window.location = 'http://127.0.0.1:8000/static/CRA_demo.html?group=e3cc102355550f93&assignmentId=ASSIGNMENT_ID_NOT_AVAILABLE';
        console.log("demo mode?", ServerHelper.demo_mode);
    }

    function cfgIsReady() {
        //if(ServerHelper.demo_mode) {
        //    window.location = 'http://127.0.0.1:8000/static/CRA_demo.html?group=e3cc102355550f93&assignmentId=ASSIGNMENT_ID_NOT_AVAILABLE'
        //}
        //
        //ServerHelper.demo_mode = false;


        //console.log('getting cfg');
        if (ServerHelper.config_file.length > 0 ) {

            ////dont freak out when redirect
            //if (!ServerHelper.demo_mode){
            //    window.onbeforeunload = warn_termination;
            //}
            //function warn_termination() {
            //        console.log('problem');
            //        alert('dont leave me');
            //        ServerHelper.upload_data('nav away. block:' + blockNum + ', trial:' + trialNum, response_log);
            //        var status_info_unload = ['trial' + trialNum, 'date:' + new Date().toString()];
            //        ServerHelper.upload_data('status', status_info_unload);
            //        return 'navigation message';
            //}

            cfg = JSON.parse(ServerHelper.config_file);
            console.log('cfg', cfg);
            console.log(cfg.images);
            console.log('ServerHelper.sessionToken', ServerHelper.sessionToken);

            //add button

            //button will check to see if we need to be in demo mode or exp mode
            // if (serverhelper.demo_mode){
            // preload_images(cfg_demo);}
            // else{
            preload_images(cfg);
            window.requestAnimationFrame(ready_to_start);
            //}
        } else {
            window.requestAnimationFrame(cfgIsReady);
        }
    }

    function preload_images(cfg) {
        console.log("is this right?????");
        console.log('called preload_images');

        for (var i=0; i < cfg.images.length; i++){
            var im = new Image();
            im.src = ServerHelper.image_url + 'cfg_and_imgs/' + cfg.images[i];
            console.log('im', im);
            imagesOfImages.push(im);
            console.log(image_url)
        }
        preload_done = 1;
        console.log('imagesOfImages', imagesOfImages);
    }

    function ready_to_start(){
        if (preload_done === 1){
            // collapse canvas height to 0
            // add important text stuff
            // create a button that executes:
            //
            //if (ServerHelper.demo_mode){
            //    start_CRA_experiment(cfg_demo);
            //}else {
                start_CRA_experiment(cfg);
            //}
        }else{
            console.log('still waiting');
            window.requestAnimationFrame(ready_to_start);
        }

    }
    //var cfg = {"specs": {"CRA_timeout":3000,"sol_timeout" : 6000, "iora_timeout" : 3000, "NAcount_sol_max": 3,"NAcount_prob_max": 4, "boot_time": 120000, "upload": 0},"instrux":{"slide1":"In this experiment, you will see three words presented on the screen. For each problem you are asked to come up with a solution word that could be combined with each of the three problem words to form a common compound or phrase. \n The solution word can precede or follow the problem word. For example, what word can go with \npine \ncrab \nsauce \n\nPress space bar to continue.","slide2" : "pine apple \ncrab apple \napple sauce \n\nPress space bar to continue","slide3":"You will also decide whether the solution was reached with insight or with analysis \nInsight:\n- sudden & surprising\n- confidence; you 'just know' solution works with all 3 problem words\n- may be unable to articulate how you reached the solution\n-  Aha! moment \nAnalysis:\n- gradually approach solution\n- part by part solution \n- may use deliberate strategy\n- might be able to report steps \n\nPress space bar to continue","slide4":"No solution type is better or worse than the other; there are no right or wrong answers in reporting insight or analysis. \nYou will not be able to solve every problem, and that is OK. \n\nPress space bar to continue","slide5":"Press spacebar when you are ready to start the practice problems.","slide6":"Now the experiment will begin.\nPress enter to begin"},"error_handling":{"upload":0},"practice":[{"firstWord":"practice1","secondWord":"practice2","thirdWord":"practice3"},{"firstWord":"practice1","secondWord":"practice2","thirdWord":"practice3"}],"problems":[{"firstWord":"pine","secondWord":"crab","thirdWord":"sauce"},{"firstWord":"cane","secondWord":"daddy","thirdWord":"plum"},{"firstWord":"fox","secondWord":"man","thirdWord":"peep"},{"firstWord":"worm","secondWord":"shelf","thirdWord":"end"},{"firstWord":"puppy","secondWord":"true","thirdWord":"letter"}]};

    //var cfg = {
    //  "specs": {
    //    "CRA_timeout" : 3000,
    //    "sol_timeout" : 6000,
    //    "iora_timeout" : 3000,
    //    "NAcount_sol_max": 3,
    //    "NAcount_prob_max": 4,
    //    "boot_time": 120000,
    //    "upload": 0
    //   },
    //
    //  "instrux":{
    //        "slide1" : "In this experiment, you will see three words presented on the screen. For each problem you are asked to come up with a solution word that could be combined with each of the three problem words to form a common compound or phrase. \n The solution word can precede or follow the problem word. For example, what word can go with \npine \ncrab \nsauce \n\nPress space bar to continue.",
    //        "slide2" : "pine apple \ncrab apple \napple sauce \n\nPress space bar to continue",
    //        "slide3" : "You will also decide whether the solution was reached with insight or with analysis \nInsight:\n- sudden & surprising\n- confidence; you 'just know' solution works with all 3 problem words\n- may be unable to articulate how you reached the solution\n-  Aha! moment \nAnalysis:\n- gradually approach solution\n- part by part solution \n- may use deliberate strategy\n- might be able to report steps \n\nPress space bar to continue",
    //        "slide4" : "No solution type is better or worse than the other; there are no right or wrong answers in reporting insight or analysis. \nYou will not be able to solve every problem, and that is OK. \n\nPress space bar to continue",
    //        "slide5" : "Press spacebar when you are ready to start the practice problems.",
    //        "slide6" : "Now the experiment will begin.\nPress enter to begin"
    //    },
    //
    //
    //    "error_handling":{
    //        "upload" : 0
    //    },
    //
    //
    //    "practice":[{
    //        "firstWord":"practice1",
    //        "secondWord":"practice2",
    //        "thirdWord" : "practice3"
    //    },
    //    {
    //        "firstWord":"practice1",
    //        "secondWord":"practice2",
    //        "thirdWord" : "practice3"
    //    }],
    //
    //
    //    "problems":[{
    //        "firstWord":"pine",
    //        "secondWord":"crab",
    //        "thirdWord" : "sauce"
    //    },
    //    {
    //        "firstWord":"cane",
    //        "secondWord":"daddy",
    //        "thirdWord" : "plum"
    //    },
    //    {
    //        "firstWord":"fox",
    //        "secondWord":"man",
    //        "thirdWord" : "peep"
    //    },
    //    {
    //        "firstWord":"worm",
    //        "secondWord":"shelf",
    //        "thirdWord" : "end"
    //    },
    //    {
    //        "firstWord":"puppy",
    //        "secondWord":"true",
    //        "thirdWord" : "letter"
    //    }],
    //
    //
    //    "images": [
    //        'Image_10002_2.jpg', 'Image_10008_4.jpg', 'Image_10014_4.jpg', 'Image_10016_1.jpg', 'Image_10034_2.jpg'
    //    ]
    //};
    //

    // show_consent() using the cfg.consent_form






    //function parse_config(myConfig) {
    //    var parts = myConfig.split('\n');
    //    var dictionary = {};
    //   console.log('parts 1', parts);
    //
    //    for(var i = 0; i < parts.length; i++){
    //        var p = parts[i];
    //        console.log('parts 2', parts);
    //    }
    //
    //}
    //parse_config(ServerHelper.config_file);


}
    // //if you do not have a session token, you get sent to a demo.
    // if (params.hasOwnProperty('assignmentId') && params["assignmentId"].match("ASSIGNMENT_ID_NOT_AVAILABLE")) {
    //     window.location = 'https://www.reberlab.org/static/Falling_Cat_Demo.html?group='+ params["group"] + '&demo' ;
    // }
    // else if (params.hasOwnProperty('session')){ // if you do have a session token, we request the consent form.
    //     //console.log(params[1]);
    //
    //     var sessionToken = params["session"];
    //
    //     ServerHelper.request_consent_form(sessionToken);
    //     window.requestAnimationFrame(showConsent);
    //
    // }else{
    //     //console.log('getting session from group number');
    //     ServerHelper.group_session_request(params["group"], params["workerId"]);
    //     function getSessionByGroup() {
    //         if (ServerHelper.group_session_received) {
    //             sessionToken = ServerHelper.sessionToken;
    //             //console.log(sessionToken.split(" ")[0]);
    //             params["session"] = sessionToken.split(" ")[0];
    //
    //             if (params["session"].match("Error")){
    //                 alert("Something seems to have gone wrong. Please press OK and refresh the page.\n\nIf the problem persists, please contact us at: reberlab@gmail.com and include the following in the email:\n\n" + sessionToken )
    //             }else {
    //                 ServerHelper.request_consent_form(params["session"]);
    //                 window.requestAnimationFrame(showConsent)
    //             }
    //         } else {
    //             //console.log('not ready yet');
    //             window.requestAnimationFrame(getSessionByGroup);
    //         }
    //     }
    //     window.requestAnimationFrame(getSessionByGroup);
    // }
    //
    //
    // // this function modifies an HTML element and constructs the consent form. It also creates an "I Accept" button.
    // function show_consent() {
    //     var form_holder = document.getElementById("form_holder");
    //     consent_string = "<h2>You are being asked to participate in a research study.  Please read and provide consent to participate before beginning.</h2><table class=\"consent\">";
    //     for (section in consent_form) {
    //         consent_string += "<tr><td>" + section + "</td><td><b>" + consent_form[section] + "</b></td></tr>"
    //     }
    //     consent_string += "</table><div id=\"acceptbutton\"><p></p>Do you consent to participate in the experiment?<br><br></div>";
    //     form_holder.innerHTML = consent_string;
    //     b = document.createElement("input");
    //     b.type = "button";
    //     b.value = "I accept";
    //     //b.style.margin = "0px 0px 0px 8.5%";
    //     b.addEventListener("click", consent_accepted);
    //     document.getElementById("acceptbutton").appendChild(b);
    //     //form_holder.appendChild(b);
    // }
    //
    // //cleans up the listener, empties the div and begins the cfg process.
    // function consent_accepted() {
    //     b.removeEventListener("click", consent_accepted);
    //     var form_holder = document.getElementById("form_holder");
    //     form_holder.innerHTML = '';
    //     //next_session_state();
    //     //document.getElementById("mainWin").focus();
    //     //console.log("Consent accepted");
    //     //console.log(params["session"]);
    //     ServerHelper.request_config(params["session"]);
    //     window.requestAnimationFrame(cfgIsReady);
    // }
    //
    // // displays the consent form when it's ready to be shown.
    // function showConsent() {
    //     //console.log('getting consent');
    //     if (ServerHelper.consent_received) {
    //         if (ServerHelper.status === 'None') {
    //             consent_form = {};
    //             //console.log('none');
    //         }else {
    //             try {
    //                 form = JSON.parse(ServerHelper.status);
    //                 consent_form = form['consent_form'];
    //             } catch (e) {
    //                 consent_form = {};
    //             }
    //         }
    //         show_consent();
    //     } else {
    //         window.requestAnimationFrame(showConsent);
    //     }
    // }
    //
    // // checks to see whether the cfg has been retrieved. If so, it creates the canvas element
    // // and invokes image_preload to fetch images.
    // function cfgIsReady() {
    //     //console.log('getting cfg');
    //     if (ServerHelper.config_received === true) {
    //         cfg = JSON.parse(ServerHelper.config_file);
    //         imgDir = cfg["exp_control"].imgPath;
    //         //var imgDir = "VisCat_Stims_13_3/";
    //         imgList = cfg["exp_control"].stimList;
    //
    //         ServerHelper.request_status(params["session"]);
    //         window.requestAnimationFrame(trial_num_checker);
    //
    //         canvas_space.style.margin = "auto";
    //         canvas_space.innerHTML = canvas_properties;
    //         img_preload(imgList, imgDir);
    //     } else {
    //         window.requestAnimationFrame(cfgIsReady);
    //     }
    // }
    //
    //
    // function trial_num_checker() {
    //
    //     if (ServerHelper.status_received) {
    //         var t = ServerHelper.status.split(/\s+/);
    //         for (var i = 0; i < t.length; i++) {
    //             if (t[i] === 'trial:' && (i + 1) < t.length) {
    //                 params['trialCount'] = Number(t[i + 1].trim());
    //                 i++;
    //             }
    //         }
    //         window.requestAnimationFrame(preLoadIsDone);
    //     }else{
    //         window.requestAnimationFrame(trial_num_checker);
    //     }
    // }
    //
    //
    //
    // // function that checks whether img-preload is done and then invokes the button creation function
    // function preLoadIsDone() {
    //     if (preLoad_done === true) {
    //         window.requestAnimationFrame(startExp);
    //         clickToStart();
    //     } else {
    //         window.requestAnimationFrame(preLoadIsDone);
    //     }
    // }
    //
    // // function that checks whether the button is ready and we're set to start the exp, then starts it.
    // function startExp() {
    //     if (readyToStart === true) {
    //         startFallingStimsExp(params);
    //     }else{
    //         window.requestAnimationFrame(startExp);
    //     }
    // }
    //
    // }
