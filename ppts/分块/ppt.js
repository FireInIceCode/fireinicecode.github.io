ppt = (function () {
    function V(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    V.prototype.contrary = function () {
        return new V(-this.x, -this.y, -this.z);
    }

    function $(str) {
        return document.querySelector(str);
    }

    function $$(str) {
        return document.querySelectorAll(str);
    }

    function css(el, attr, value) {
        el.style[attr] = value;
    }

    function attr(el, name, default_value) {
        var v = el.getAttribute(name);
        if (v == null) {
            return default_value;
        } else {
            return v;
        }
    }

    function format(str, values) {
        for (var i = 0; i < values.length; i++) {
            str = str.replace('%v', values[i]);
        }
        return str;
    }

    function to_view_css(pos, rotation) {
        return format(
            "rotateZ(%vdeg) rotateY(%vdeg) rotateX(%vdeg) translate3d(%vpx,%vpx,%vpx)",
            [rotation.z, rotation.y, rotation.x, pos.x, pos.y, pos.z]
        );
    }

    function to_page_css(pos, rotation, scale) {
        return format(
            "translate3d(%vpx,%vpx,%vpx) rotateX(%vdeg) rotateY(%vdeg) rotateZ(%vdeg) scale(%v)",
            [pos.x, pos.y, pos.z, rotation.x, rotation.y, rotation.z, scale]
        );
    }

    function to_array(nodes) {
        var arr = [];
        for (var i = 0; i < nodes.length; i++) {
            arr.push(nodes[i]);
        }
        return arr;
    }
    var page_datas = [],
        el, elf, pages;
    var animate_tags = [
        "fly-b",
        "fly-t",
        "fly-l",
        "fly-r",
        "fly-tl",
        "fly-tr",
        "fly-bl",
        "fly-br",
        "rock",
        "scale-in",
        "scale-out",
        "loop-rotate",
        "bomb"
    ]

    function create_button(){
        html_str=
        '<div class="button-left" onclick="ppt.last()"><</div>\
        <div class="button-right" onclick="ppt.next()">></div>';
        document.write(html_str);
    }

    function create_loading(){
        var bg=document.createElement('div');
        bg.className="loading";
        bg.innerHTML="<h1>Loading...</h1><div><div></div></div>";
        document.body.appendChild(bg);
        setTimeout(() => {
            document.body.removeChild($('div.loading'));
        }, 5000);
    }

    function get_index_by_hash(){
        return parseInt(location.hash.slice(0,location.hash.length).split("-")[1])-1;
    }

    function init() {
        create_button();
        create_loading();
        elf = $("#ppt");
        el = document.createElement('div');
        chs = to_array(elf.children);
        for (var i = 0; i < chs.length; i++) {
            el.appendChild(chs[i]);
        }
        el.id = "canvas";
        elf.appendChild(el);

        el.classList.add('ppt-box');
        elf.classList.add('ppt-box-father');

        pages = to_array(el.children);
        for (var i = 0; i < pages.length; i++) {
            var page = pages[i];
            var x = parseInt(attr(page, 'x', 0)),
                y = parseInt(attr(page, 'y', 0)),
                z = parseInt(attr(page, 'z', 0)),
                rotate_x = parseInt(attr(page, 'rotate-x', 0)),
                rotate_y = parseInt(attr(page, 'rotate-y', 0)),
                rotate_z = parseInt(attr(page, 'rotate-z', 0)),
                scale = Number(attr(page, 'scale', 1));
            var pos = new V(x, y, z);
            var rotation = new V(rotate_x, rotate_y, rotate_z);
            page_datas.push({
                pos: pos,
                rotation: rotation,
                scale: scale
            });
            page.classList.add('ppt-page');
            css(page,'zIndex',"-1");
            css(page, 'transform', to_page_css(pos, rotation, scale) + " translate(-50%,-50%)");
        }
        for (var i = 0; i < animate_tags.length; i++) {
            var els = to_array($$(animate_tags[i]));
            for (var j = 0; j < els.length; j++) {
                els[j].classList.add("ppt-" + animate_tags[i]);
                els[j].classList.add("animation-element");
                els[j].style.animationDelay = 0 + parseInt(attr(els[j], "delay", 1)) + "s";
            }
        }
        if(location.hash.length>1){
            go()
        }else{
            goto(0);
            go();
        }
    }

    function reset_animation(el) {
        var l = to_array(el.classList);
        for (var i = 0; i < l.length; i++) {
            el.classList.remove(l[i]);
        }
        el.offsetWidth = el.offsetWidth;
        for (var i = 0; i < l.length; i++) {
            el.classList.add(l[i]);
        }
        el.style.animationPlayState="paused";
    }

    function goto(index) {
        location.hash="page-"+(index+1);
    }

    function get_now() {
        for (var i = 0; i < pages.length; i++) {
            if (pages[i] == $('.active')) {
                return i;
            }
        }
    }

    function next() {
        goto((get_now() + 1) % pages.length);
    }

    function last() {
        var t = get_now();
        if (t == 0) {
            t = pages.length;
        }
        goto(t - 1);
    }
    function go() {
        var index=get_index_by_hash();
        var data = page_datas[index];
        if($('.last')){
            $('.last').classList.remove('last');
        }
        if($('.active')){
            $('.active').style.zIndex="-1";
            $('.active').classList.add('last');
            $('.active').classList.remove('active');
        }
        pages[index].classList.add('active');
        for (var i = 0; i < animate_tags.length; i++) {
            var els = to_array($$('.active ' + animate_tags[i]));
            for (var j = 0; j < els.length; j++) {
                els[j].style.animationPlayState="running";
            }
        }
        pages[index].style.zIndex="1";
        console.log(to_view_css(data.pos.contrary(), data.rotation.contrary()))
        css(el, 'transform', to_view_css(data.pos.contrary(), data.rotation.contrary()));
        css(elf, 'perspective', data.scale * 1000 + "px");
        css(elf, 'transform', 'scale(' + 1 / data.scale + ')');
        setTimeout(() => {
            for (var i = 0; i < animate_tags.length; i++) {
                var els = to_array($$('.last ' + animate_tags[i]));
                for (var j = 0; j < els.length; j++) {
                    var ele=els[j];
                    reset_animation(ele);
                }
            }
        }, 1000);
    }
    window.addEventListener('load', () => {
        window.addEventListener('keyup', (e) => {
            if (e.keyCode == 32 || e.keyCode == 39 || e.keyCode == 40) {
                next();
            } else if (e.keyCode == 37 || e.keyCode == 38) {
                last();
            }
        });
        window.onhashchange=go;
    });
    return {
        'init': init,
        'goto': goto,
        'get_now': get_now,
        'next':next,
        'last':last
    }
})()