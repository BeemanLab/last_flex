var groupID;
console.log('demo.js btn', document.getElementById('start-btn'));
document.getElementById('start-btn').onclick = function() {
    window.location = 'http://127.0.0.1:8000/static/CRA_index.html?group=' + params.group + '&workerId=' + params.workerId;
    ServerHelper.demo_mode = false;
    console.log('grp token', ServerHelper.groupToken());
    groupID = ServerHelper.groupToken();
    //ServerHelper.empirical_start('http://127.0.0.1:8000/static/CRA_index.html');
    //console.log('started empirical url');
};