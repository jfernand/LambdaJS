function run(id) {
    var code = document.getElementById(id);

    var parser = new LambdaJS.Parser();
    var parsed = parser.parse(code.textContent);
    var sandbox = new LambdaJS.Sandbox();

    var exp = sandbox.run(parsed.join(''));

    code.appendChild(document.createElement('br'));
    while (true) {
        code.appendChild(document.createElement('br'));
        code.appendChild(document.createTextNode((exp||'').toString()));
        if (typeof exp == 'undefined') break;

        var st = new LambdaJS.Strategy.CallByName();
        exp = exp.reduce(st);
        if (!st.reduced) break;
    }

    var exp = sandbox.run(parsed.join(''));

    code.appendChild(document.createElement('br'));
    while (true) {
        code.appendChild(document.createElement('br'));
        code.appendChild(document.createTextNode((exp||'').toString()));
        if (typeof exp == 'undefined') break;

        var st = new LambdaJS.Strategy.CallByValue();
        exp = exp.reduce(st);
        if (!st.reduced) break;
    }

    var exp = sandbox.run(parsed.join(''));

    code.appendChild(document.createElement('br'));
    while (true) {
        code.appendChild(document.createElement('br'));
        code.appendChild(document.createTextNode((exp||'').toString()));
        if (typeof exp == 'undefined') break;

        var st = new LambdaJS.Strategy.NormalOrder();
        exp = exp.reduce(st);
        if (!st.reduced) break;
    }
};

function init() {
    var links = document.getElementsByTagName('a');
    for (var i=0; i < links.length; i++) {
        if (links[i].id.match(/^run-.+/)) {
            var href = "javascript:run('$1')";
            links[i].href = links[i].id.replace(/^run-(.+)$/, href);
        }
    }
};
function setup(id) {
    init();
    var elm = document.getElementById(id);
    var console = new UI.Console(elm);
    var env = new LambdaJS.Env();
    console.command = function(cmd) {
        var exp = env.evalLine(cmd);
        if (exp) {
            var st = new LambdaJS.Strategy.NormalOrder();
            do {
                console.insert(exp.toString());
                exp = st.reduce(exp);
            } while (st.reduced)
        }
    };
};
