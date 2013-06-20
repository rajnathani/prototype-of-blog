function evUploadPictureChange() {
    if (this.files) {
        var fd = new FormData();
        fd.append('image', this.files[0]);
        var xhr = new XMLHttpRequest();


        /* event listners */
        xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener("load", uploadComplete, false);
        xhr.addEventListener("error", uploadFailed, false);
        xhr.addEventListener("abort", uploadCanceled, false);
        /* Be sure to change the url below to the url of your upload server side script */
        xhr.open("POST", "http://127.0.0.1:3000/img");
        console.log(fd);
        xhr.send(fd);

        $('#upload-progress').remove();

        this.parentNode.appendChild(div({'id': 'upload-progress', 'class': 'cf', style: ' margin-top:10px;background-color:#4d161a; width:auto; height:10px;'}, [
            div({'id': 'progress-bar', 'style': 'float:left;width:0%; height:100%;background-color:#ff475a;-webkit-transition:all 400ms; transition:all 400ms;'})
        ]));
        /*var reader = new FileReader();
         reader.readAsDataURL(this.files[0]);

         reader.onload = function(e){

         pop(e.target.result);
         } */

    }

}

function uploadProgress(data) {
    console.log('progressing');
    document.getElementById('progress-bar').style.width = parseInt((parseFloat(data.loaded) / data.total) * 100) + '%';
}
function uploadComplete() {
    pop('Upload Complete!', 'slide');
    setTimeout(function () {
        popOut()
    }, 1100)
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
        perfDeleteArticle({link: link});
    } else {
        go_ajax('/article/' + link, 'DELETE', {}, perfDeleteArticle);
    }
    //pop(link);
}

function perfDeleteArticle(dict) {
    if (dict.error) {
        return pop(dict.error, 'error');
    }
    jam_manage_article_rows.filter('tr[data-link="' + dict.link + '"]').remove();
    popOut();
}
function articleContextMenu(e) {
    document.forceEscape && document.forceEscape();
    var pos = mousePosition(e);
    var pos_x = pos[0];
    var pos_y = pos[1];

    var link = this.parentNode.getAttribute('data-link');

    document.body.appendChild(
        div({'class': 'context-menu', id: "art-context-menu", 'style': 'position:absolute; left:' + pos_x + 'px; top:' + pos_y + 'px'}, [
            a('open', {href: '/article/' + link, 'class': 'button', 'style': 'display:block'}),
            button('delete', {'style': 'display:block', 'click': function () {
                buSureDeleteArticle(link)
            }})
        ])
    );
    escapeState('art-context-menu');
    return false;

}

var jam_manage_article_rows = $('#cp-table.manage-articles').find('tr');

jam_manage_article_rows.find('td:first-child').on('contextmenu', articleContextMenu);

jam_manage_article_rows.find('td:last-child').on('click', articleContextMenu);

function perfNewCategory(dict) {
    if (dict.error) {
        return pop(dict.error, 'error');
    }
    $('#cp-table').find('tbody').append(
        tr({ 'data-name': dict.name},
            [
                td([a(dict.name, {href: '/category/' + dict.name, class: 'hover-link' })], {contextmenu: categoryContextMenu}),
                td('0 Articles'),
                td({'click': categoryContextMenu})
            ]
        )
    );
    popOut();


}
function buCreateCategory(category_name) {
    if (category_name.length > 40) {
        return pop('Category name exceeds 40 characters', 'error');
    } else if (!category_name.match(/^[a-zA-Z0-9\- _]*$/)) {
        return pop('Illegal characters in category name', 'error');
    } else {
        if (true) {
            perfNewCategory({name: category_name});
        } else {
            go_ajax('/category/' + category_name, 'POST', {}, perfNewCategory);
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
    pop(textinput({id: 'new-name', 'placeholder': 'New Category ...',
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
        perfDeleteCategory({name: name});
    } else {
        go_ajax('/category/' + name, 'DELETE', {}, perfDeleteCategory);
    }
}

function perfDeleteCategory(dict) {
    if (dict.error) {
        return pop(dict.error, 'error');
    }

    $('#cp-table.manage-categories').find('tr[data-name="' + dict.name + '"]').remove();
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