//Remove any trailing slash
_path_name = window.location.pathname.replace(/\/$/, "");
function skinTesting() {
    return window.location.href.match(/^file:\/\/\//);
}
function add_animation(node, animation_name, duration) {
    var animation_content = animation_name + ' ' + duration + 'ms';
    if (node.style !== undefined) {
        node.style.animation = animation_content;
        node.style.webkitAnimation = animation_content;
    } else {
        node.css({'animation': animation_content, '-webkit-animation': animation_content});
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
function go_ajax(url, method, data, success_func, extra_dict) {
      if ($.type(data) === "function") {
          var success_func_holder = success_func;
          success_func = data;
          extra_dict = success_func_holder;
          data = undefined;
      }


    /*var remove_loading = function (jx, status) {
     $('.loading').hide();
     };
     var complete_functions;
     if (extra_dict.complete) {
     if ($.isArray(extra_dict.complete)) {
     extra_dict.complete.push(remove_loading);
     complete_functions = extra_dict.complete;
     } else {
     complete_functions = [extra_dict.complete, remove_loading];
     }
     } else {
     complete_functions = remove_loading;
     } */

    $.ajax({
        url: url,
        type: method,
        data: data ? JSON.stringify(data) : null,
        contentType: "application/json;charset=UTF-8",

        success: success_func,
        complete: extra_dict && extra_dict.complete ? extra_dict.complete : null,
        error: extra_dict && extra_dict.error ? extra_dict.error : function () {
            pop('Something went wrong, your request could not be completed.', 'error');
        },
        context: extra_dict && extra_dict.context ? extra_dict.content : null

    });
}

function bring_json(url, data, func) {
    $.getJSON(url, data, func);
}


function validEmail(email) {

    var reg_email = /[A-Za-z0-9\._%\+\-]+@[A-Za-z0-9\._%\+\-]+\.[A-Za-z]{2,4}/;
    return email !== undefined && email.substring && email.match(reg_email);
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

    document.forceEscape = function () {
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