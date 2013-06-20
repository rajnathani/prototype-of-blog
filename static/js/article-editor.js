$('textarea').autosize();

$('.default-category-select').chosen();



function categoryCount(){
    return parseInt($('#number-of-categories').val());
}

function increaseCategory(){
    $('#number-of-categories').val( categoryCount()+1);
}

function decreaseCategory(){
    $('#number-of-categories').val(categoryCount()-1);
}

$('#bu-remove-category').click(function () {
    var category_count = categoryCount();
    if (category_count > 0){
        if (category_count === 1){$('#bu-remove-category').css('visibility','hidden');}
        $('#category-' + category_count).remove();
        $('#category_' +category_count +'_chzn').remove();

        decreaseCategory();
    }
    return false;
});
$('#bu-add-category').click(function () {
    var new_category_num = categoryCount() + 1;
    if (new_category_num === 1){
        $('#bu-remove-category').css('visibility','visible');
    }


    $('#bu-remove-category').after($('#category-placeholder').first().clone(false).attr('id','category-' + new_category_num).show());
    $('#category-' + new_category_num).chosen();
    increaseCategory();

    return false;

});


$('#bu-preview-article').click(function(){
    var $this = $(this);
    if ($this.hasClass('color')){
        $this.removeClass('color');
        $('#article-preview').hide();
        $('textarea.article-content').show();
    } else {
        $this.addClass('color');

        var $article_textarea = $('textarea.article-content');
        var $article_preview = $('#article-preview');

        $article_preview.html(markDown($article_textarea.val()));

        $article_textarea.hide();
        $article_preview.show();
    }
    return false;
});

function markDown(mark_down){
    var converter = new Markdown.Converter();
    return (converter.makeHtml(mark_down));
}