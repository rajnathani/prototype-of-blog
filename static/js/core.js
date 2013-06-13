function add_animation(node, animation_name, duration) {
    var animation_content = animation_name + ' ' + duration + 'ms';
    if (node.style !== undefined) {
        node.style.animation = animation_content;
        node.style.webkitAnimation = animation_content;
    } else {
        node.css({'animation':animation_content, '-webkit-animation':animation_content});
    }
}

function remove_animation(node) {
    node.style.animation = 'none';
    node.style.webkitAnimation = 'none';
    return node;
}


function is_there(node) {
    return node !== undefined;
}
function go_ajax(url, method, data, success_func) {
    if (!is_there(success_func)) {
        success_func = function () {
            location.reload();
        }
    }

    $.ajax({
        url:url,
        type:method,
        data:JSON.stringify(data),
        contentType:"application/json;charset=UTF-8",
        success:success_func,
        error:function () {
            alert('something went wrong');
        }
    });
}

function bring_json(url, data, func) {
    $.getJSON(url, data, func);
}



function isParent(element, id) {
    var cur_element = element;
    var cur_id;
    while (cur_element) {
        cur_id = cur_element.id ? cur_element.id : "";

        if (cur_id) {
            if (cur_id === id) {
                return true;
            }
        }
        cur_element = cur_element.parentNode;
    }

    return false;
}

function destroyByID(id) {

    document.getElementById(id).parentNode.removeChild(document.getElementById(id));
}
function escapeState(elementID) {

    var original_onclick = document.onclick;
    var original_forceescape = document.forceEscape;
    var original_onkeydown = document.onkeydown;


    document.onclick = function (e) {

        e = e || window.event;
        var target = e.target || e.srcElement;
        if (!isParent(target, elementID)) {

            destroyByID(elementID);
            document.onclick = original_onclick;
            document.onkeydown = original_onkeydown;
            document.forceEscape = original_forceescape;
        }
    };

     document.forceEscape = function(){
         destroyByID(elementID);
         document.onclick = original_onclick;
         document.onkeydown = original_onkeydown;
         document.forceEscape = original_forceescape;
     };

    document.onkeydown = function (e) {

        var keycode = e ? e.keyCode : (window.event).keyCode;
        if (keycode === 27) {
            destroyByID(elementID);
            document.onclick = original_onclick;
            document.onkeydown = original_onkeydown;
            document.forceEscape = original_forceescape;
        }
    }


}