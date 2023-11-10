var dict = {
    '_': 'operation:left click,right click,middle click,drag with mouse.<br>commands: `set-size` `show-as-tree` `fix-all` `attr`<br>you can use help &lt;command&gt; to get more info',
    'set-size': '`set-size &ltwidth:int&gt; &ltheight:int&gt;`: set the size of canvas ',
    'show-as-tree': '`show-as-tree &lt;root:text=1&gt;`: show as a tree with the root named text',
    'fix-all': '`fix-all`: fixed all the nodes',
    'attr': '`attr &lt;key&gt; &lt;value=null&gt;`: to get the config[key] by leave value null,or set the config[key]=value<br>the Config has the default value of: var Config = {<br>        node_r: 40,<br>        state_names: ["default", "gs1", "gs2", "gs3"],<br>        e_len: 200,<br>        e_f: 0.01,<br>        e_maxf: 1,<br>        n_len: 120,<br>        n_f: 1000,<br>        n_maxf: 1,<br>        center_f: 0.0005,<br>        c_w: 800,<br>        c_h: 600,<br>        eps: 0.1,<br>        line_style: "black",<br>        line_width: 3,<br>        line_font: "14px 微软雅黑",<br>        e_force: (d) => { return Math.max(d - Config.e_len, 0) * Config.e_f },<br>        e_force: (d) => { return Math.min((d - Config.e_len) * Config.e_f, Config.e_maxf) },<br>        n_force: (d) => { return Math.min(d > Config.eps ? 1 / d / d * Config.n_f : 1 / Config.eps * Config.n_f, Config.n_maxf) },<br>        c_force: (d) => { return Config.center_f * d },<br>        t_sw: 100,<br>        t_sh: 100,<br>        arrow_offset: 22,<br>        arrow_1ength: 10,<br>        arrow_width: 5,<br>    directioned:false}',
};


function parseCommand(str, graph) {
    words = str.split(' ');
    if (words[0] == 'set-size') {
        if (words.length == 3) {
            G.setsize(parseInt(words[1]), parseInt(words[2]));
            return 'Success';
        } else {
            return ('Incorrect format');
        }
    } else if (words[0] == 'show-as-tree') {
        if (words.length == 2) {
            graph.arrange_as_tree(words[1]);
            return 'Success';
        } else if (words.length == 1) {
            graph.arrange_as_tree();
            return 'Success';
        } else {
            return ("Incorrect format");
        }
    } else if (words[0] == 'fix-all') {
        if (words.length != 1) {
            return ("Incorrect format");
        } else {
            for (var node of graph.nodes) {
                node.fixed = true;
            }
            return 'Success';
        }
    } else if (words[0] == 'attr') {
        if (words.length != 2 && words.length != 3) return 'Incorrect format';
        if (!(words[1] in G.Config)) return 'Incorrect parameter';
        if (words.length == 3) {
            G.Config[words[1]] = eval(words[2]);
        } else {
            return ':' + G.Config[words[1]]
        }
    } else if (words[0] == 'help') {
        if (words.length > 2) return 'Incorrect format,try `help`';
        if (words.length == 2) {
            return words[1] in dict ? dict[words[1]] : 'No command named ' + words[1];
        } else {
            return dict['_'];
        }
    } else {
        return ('Incorrect command');
    }
}
function parse(str, graph) {
    nodemap = {};
    var newstr = [];
    for (var line of str.split('\n')) {
        if (!line) {
            newstr.push('')
            continue;
        }

        newstr.push(line)
        var words = line.split(' ');
        if (words.length != 1 && words.length != 2 && words.length != 3)
            continue;
        if (words.length == 1) {
            if (!nodemap[words[0]]) {
                nodemap[words[0]] = new G.Node();
                nodemap[words[0]].text = words[0];
                graph.nodes.push(nodemap[words[0]]);
            }
            continue;
        }
        words.push('');
        if (!nodemap[words[0]]) {
            nodemap[words[0]] = new G.Node();
            nodemap[words[0]].text = words[0];
            graph.nodes.push(nodemap[words[0]]);
        }
        if (!nodemap[words[1]]) {
            nodemap[words[1]] = new G.Node();
            nodemap[words[1]].text = words[1];
            graph.nodes.push(nodemap[words[1]]);
        }
        graph.edges.push(new G.Edge(nodemap[words[0]], nodemap[words[1]], words[2]));
    }
    return newstr.join('\n');
}
function cmd(e){
    parseCommand(e.getAttribute('cmd'),graph);
}

window.onload = () => {
    graph = G.init('.canvas');
    // for (var i = 0; i < 100; i++) { var node = new G.Node(); node.text = i; graph.nodes.push(node); }
    // for (var i = 0; i < 100; i++) {
    //     var u=graph.nodes[parseInt(Math.random()*graph.nodes.length)];
    //     var v=graph.nodes[parseInt(Math.random()*graph.nodes.length)];
    //     graph.edges.push(new G.Edge(u,v,''));
    // }
    editor = document.querySelector('#graphtext');
    var cmd = document.querySelector('#cmd');
    var output = document.querySelector('#output');
    editor.addEventListener('keyup', (e) => {
        graph.clear();
        editor.value = parse(editor.value, graph);
        graph.set_poses();
    });
    cmd.addEventListener('keyup', (e) => {
        if (e.keyCode != 13) return;
        output.innerHTML += '> ' + cmd.value + '<br>'
        output.innerHTML += (parseCommand(cmd.value, graph)) + '<br>';
        cmd.value = '';
    });
    editor.dispatchEvent(new KeyboardEvent('keyup'))
}