function evUploadPictureChange() {
    if (this.files) {
        var fd = new FormData();
        fd.append('image', this.files[0]);
        var xhr = new XMLHttpRequest();


        xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener("load", uploadComplete, false);
        xhr.addEventListener("error", uploadFailed, false);
        xhr.addEventListener("abort", uploadCanceled, false);

        xhr.open("POST", "/control-panel/pictures/_upload");

        xhr.send(fd);

        $('#upload-progress').remove();

        this.parentNode.appendChild(div({'id': 'upload-progress', 'class': 'cf', style: ' margin-top:10px;background-color:#4d161a; width:auto; height:10px;'}, [
            div({'id': 'progress-bar', 'style': 'float:left;width:0%; height:100%;background-color:#ff475a;-webkit-transition:all 400ms; transition:all 400ms;'})
        ]));

    }

}

function uploadProgress(data) {
    console.log('progressing');
    document.getElementById('progress-bar').style.width = parseInt((parseFloat(data.loaded) / data.total) * 100) + '%';
}
function uploadComplete(data) {
    console.log(data);
    try {
        var dict = JSON.parse(data.target.response);
    } catch (err) {
        pop('The server did not seem to respond well to that', 'error');
    }
    if (dict.error) {
        return pop(dict.error, 'error');
    }
    pop('Upload Complete!', 'success');
    setTimeout(popOut, 1100)
}

function uploadFailed() {
    console.log('upload failed');
}

function uploadCanceled() {
    console.log('upload canceled');
}

$('#bu-form-upload-picture').click(function () {
    pop(input({'type': 'file', 'change': evUploadPictureChange}));
});


// Source: http://www.quirksmode.org/js/events_properties.html
function mousePosition(e) {
    var posx = 0;
    var posy = 0;
    if (!e) var e = window.event;
    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    }
    else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft
            + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop
            + document.documentElement.scrollTop;
    }
    return [posx, posy];
    // posx and posy contain the mouse position relative to the document
    // Do something with this information
}

function buSureDeleteArticle(link) {
    pop(div([
        p('Are you sure you would like to delete this article?'),
        button('yes', {'click': function () {
            buDeleteArticle(link)
        }}),
        span(' '),
        button('no', {'click': closePop})
    ]), 'slide')
}
function buDeleteArticle(link) {

    if (true) {
        perfDeleteArticle({}, link);
    } else {
        go_ajax('/control-panel/_article/' + link, 'DELETE', {}, function (dict) {
            perfDeleteArticle(dict, link)
        });
    }
    //pop(link);
}

function perfDeleteArticle(dict, link) {
    if (dict.error) {
        return pop(dict.error, 'error');
    }
    jam_manage_article_rows.filter('tr[data-link="' + link + '"]').remove();
    popOut();
    pop('Article Deleted!', 'success');
    setTimeout(popOut, 1100);
}

function buUnpublishArticle(link) {

    var ctx = $('[data-link="' + link + '"]').find('[data-published]');

    if (true) {
        perfUnpublishArticle.call(ctx, {});
    } else {
        go_ajax('/control-panel/_article/' + link + '/unpublish', 'PATCH', {}, perfUnpublishArticle, {context: ctx})
    }
}

function perfUnpublishArticle(dict) {
    if (dict.error) {
        return pop(dict.error, 'error');
    }

    $(this).attr('data-published', "false");
    pop('The article has been unpublished', 'success');
    setTimeout(popOut, 1000);
}

function buPublishArticle(link) {

    var ctx = $('[data-link="' + link + '"]').find('[data-published]');

    if (true) {
        perfPublishArticle.call(ctx, {});
    } else {
        go_ajax('/control-panel/_article/' + link + '/publish', 'PATCH', {}, perfPublishArticle, {context: ctx})
    }

}

function perfPublishArticle(dict) {
    if (dict.error) {
        return pop(dict.error, 'error');
    }
    $(this).attr('data-published', "true");
    pop('Article successfully published!', 'success');
    setTimeout(popOut, 1000);
}

function articleContextMenu(e) {
    document.forceEscape && document.forceEscape();
    var pos = mousePosition(e);
    var pos_x = pos[0];
    var pos_y = pos[1];

    var link = this.parentNode.getAttribute('data-link');

    var published = $(this.parentNode).find('[data-published]').first().attr('data-published') === "true";

    var edit_publish_status = button(published ? 'unpublish' : 'publish', {style: 'display:block;', 'click': published ? function () {
        buUnpublishArticle(link)
    } : function () {
        buPublishArticle(link)
    }});

    document.body.appendChild(
        div({'class': 'context-menu', id: "art-context-menu", 'style': 'position:absolute; left:' + pos_x + 'px; top:' + pos_y + 'px'}, [
            published ? a('open', {href: '/article/' + link, 'class': 'button', 'style': 'display:block'}) :
                span('open', { 'class': 'button', 'style': 'display:block; color:rgb(150,150,150); cursor:default;'}),
            button('delete', {'style': 'display:block', 'click': function () {
                buSureDeleteArticle(link)
            }}),
            edit_publish_status
        ])
    );
    escapeState('art-context-menu');
    return false;

}

var jam_manage_article_rows = $('#cp-table.manage-articles').find('tr');

jam_manage_article_rows.find('td:first-child').on('contextmenu', articleContextMenu);

jam_manage_article_rows.find('td:last-child').on('click', articleContextMenu);

function perfNewCategory(dict, category_name) {
    if (dict.error) {
        return pop(dict.error, 'error');
    }
    $('#cp-table').find('tbody').append(
        tr({ 'data-name': category_name},
            [
                td([a(category_name, {href: '/category/' + category_name, class: 'hover-link' })], {contextmenu: categoryContextMenu}),
                td('0 Articles'),
                td({'click': categoryContextMenu})
            ]
        )
    );
    popOut();
    pop('Category Successfully Created!', 'success');
    setTimeout(popOut, 500);


}
function buCreateCategory(category_name) {
    if (!category_name.match(/^[a-zA-Z0-9\- _]*$/)) {
        return pop('Illegal characters in category name', 'error');
    } else {
        if (true) {
            perfNewCategory({}, category_name);
        } else {
            go_ajax('/control-panel/_categories', 'POST', {name: category_name}, function (dict) {
                perfNewCategory(dict, category_name)
            });
        }
    }
}

function keypressCategoryName(e) {
    var key_code = e.keyCode;
    if (key_code === 13) {

        if (this.value) {
            buCreateCategory(this.value);
        }
    }
}
$('#bu-new-category').click(function () {
    pop(textinput({id: 'new-name', maxlength: '40', 'placeholder': 'New Category ...',
        style: 'width:100%',
        keypress: keypressCategoryName}));
    $('#new-name').focus();

});


function buSureDeleteCategory(name) {
    pop(div([
        p('Are you sure you would like to delete the category: ' + name + '?'),
        button('yes', {'click': function () {
            buDeleteCategory(name)
        }}),
        span(' '),
        button('no', {'click': closePop})]
    ), 'slide')
}
function buDeleteCategory(name) {
    if (true) {
        perfDeleteCategory({}, name);
    } else {
        go_ajax('/control-panel/_category/' + name, 'DELETE', {}, function (dict) {
            perfDeleteCategory(dict, name)
        });
    }
}

function perfDeleteCategory(dict, category_name) {
    if (dict.error) {
        return pop(dict.error, 'error');
    }

    $('#cp-table.manage-categories').find('tr[data-name="' + category_name + '"]').remove();
    popOut();
}

function categoryContextMenu(e) {
    document.forceEscape && document.forceEscape();
    var pos = mousePosition(e);
    var pos_x = pos[0];
    var pos_y = pos[1];

    var name = this.parentNode.getAttribute('data-name');

    document.body.appendChild(
        div({'class': 'context-menu', id: "art-context-menu", 'style': 'position:absolute; left:' + pos_x + 'px; top:' + pos_y + 'px'}, [
            button('delete', {'style': 'display:block', 'click': function () {
                buSureDeleteCategory(name)
            }})
        ])
    );
    escapeState('art-context-menu');
    return false;

}

var jam_manage_category_rows = $('#cp-table.manage-categories').find('tr');

jam_manage_category_rows.find('td:first-child').on('contextmenu', categoryContextMenu);

jam_manage_category_rows.find('td:last-child').on('click', categoryContextMenu);


$('.pictures-grid').find('div').click(function () {
    var bgcss_url = this.style.backgroundImage;

    pop(img({src: bgcss_url.replace(/^url\(["']?/, '').replace(/["']?\)$/, ''), style: 'width:auto;display:block;margin:auto;'}), 'large');
});